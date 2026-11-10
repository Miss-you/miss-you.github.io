import { t, isChinese } from "./i18n";
import { defaultKeymap, history, historyField, historyKeymap, invertedEffects, indentWithTab } from "@codemirror/commands";
import { bracketMatching, foldKeymap, indentOnInput } from "@codemirror/language";
import {
  type Chunk, diff, MergeView, getChunks, getOriginalDoc, goToNextChunk, goToPreviousChunk,
  originalDocChangeEffect, unifiedMergeView, updateOriginalDoc,
} from "@codemirror/merge";
import { highlightSelectionMatches, searchKeymap } from "@codemirror/search";
import { ChangeSet, Compartment, EditorSelection, EditorState, StateEffect, Text, Transaction, type Extension, type StateCommand } from "@codemirror/state";
import {
  EditorView, drawSelection, highlightActiveLine, highlightActiveLineGutter, highlightSpecialChars,
  keymap, lineNumbers, placeholder,
} from "@codemirror/view";
import { findLanguage } from "./lang";
import { makeDiffOverride } from "./merge-override";
import type { LineOp } from "./diff-core";
import type { Move } from "./moves";
import { movedBlocksField, setMovedBlocks } from "./moved-deco";
import type { CompareOptions } from "./normalize";
import type { Granularity } from "./worddiff";
import { appTheme } from "./theme";

// History stores a reversible edit, not a whole original-document snapshot.
// Later independent edits to A are mapped through when the action is undone.
const restoreOriginal = StateEffect.define<{ base: Text; changes: ChangeSet }>();

function mapOriginalChange(base: Text, current: Text, changes: ChangeSet): ChangeSet {
  if (base.eq(current)) return changes;
  const edits = diff(base.toString(), current.toString()).map((c) => ({
    from: c.fromA, to: c.toA, insert: current.slice(c.fromB, c.toB),
  }));
  return changes.map(ChangeSet.of(edits, base.length));
}

export type ViewMode = "split" | "unified";
export type RevertDirection = "a-to-b" | "b-to-a";

export interface EditorSettings {
  view: ViewMode;
  options: CompareOptions;
  collapse: boolean;
  wrap: boolean;
  revert: RevertDirection;
  granularity: Granularity;
  /** Resolved language name, or null for plain text. */
  lang: string | null;
}

export interface ChunkMark {
  kind: "add" | "del" | "mod" | "move";
  /** Position within the right-hand document, 0..1. */
  top: number;
  height: number;
}

export type UpdateKind = "doc" | "selection";

const PLACEHOLDER_A = "Paste the original text here, or drop a file";
const PLACEHOLDER_B = "Paste the changed text here, or drop a file";

export class DiffEditor {
  private merge: MergeView | null = null;
  private single: EditorView | null = null;
  private langA = new Compartment();
  private langB = new Compartment();
  private wrapA = new Compartment();
  private wrapB = new Compartment();
  private active: "a" | "b" = "b";
  private langToken = 0;
  private moves: Move[] = [];
  // YDD: retain history fields and selections in memory when changing views.
  private savedStates: { a?: EditorState; b?: EditorState } = {};


  constructor(
    private host: HTMLElement,
    private settings: EditorSettings,
    docs: { a: string; b: string },
    private onUpdate: (kind: UpdateKind) => void,
  ) {
    this.build(docs.a, docs.b);
  }

  get a(): string {
    return this.merge ? this.merge.a.state.doc.toString() : getOriginalDoc(this.single!.state).toString();
  }

  get b(): string {
    return this.merge ? this.merge.b.state.doc.toString() : this.single!.state.doc.toString();
  }

  get settingsSnapshot(): EditorSettings {
    return { ...this.settings };
  }

  /** Replace one or both documents (undoable where the editor allows it). */
  setDocs(docs: { a?: string; b?: string }): void {
    if (this.merge) {
      if (docs.a !== undefined) replaceDoc(this.merge.a, docs.a);
      if (docs.b !== undefined) replaceDoc(this.merge.b, docs.b);
    } else if (this.single) {
      const view = this.single;
      if (docs.a !== undefined) {
        const old = getOriginalDoc(view.state);
        const changes = ChangeSet.of({ from: 0, to: old.length, insert: docs.a }, old.length);
        view.dispatch({ effects: originalDocChangeEffect(view.state, changes) });
      }
      if (docs.b !== undefined) replaceDoc(view, docs.b);
    }
  }

  update(next: Partial<EditorSettings>): void {
    const prev = this.settings;
    this.settings = { ...prev, ...next };
    const s = this.settings;
    const needsRebuild =
      s.view !== prev.view ||
      JSON.stringify(s.options) !== JSON.stringify(prev.options) ||
      s.granularity !== prev.granularity ||
      (s.view === "unified" && s.collapse !== prev.collapse);
    if (needsRebuild) {
      this.rebuild();
      return;
    }
    if (this.merge && (s.collapse !== prev.collapse || s.revert !== prev.revert)) {
      this.merge.reconfigure({
        collapseUnchanged: s.collapse ? { margin: 3, minSize: 6 } : undefined,
        revertControls: s.revert,
        renderRevertControl: () => revertButton(s.revert),
      });
    }
    if (s.wrap !== prev.wrap) {
      const wrap = s.wrap ? EditorView.lineWrapping : [];
      for (const [view, c] of this.views()) view.dispatch({ effects: c.wrap.reconfigure(wrap) });
    }
    if (s.lang !== prev.lang) this.loadLanguage();
  }

  focus(): void {
    this.activeView().focus();
  }

  next(): void {
    this.move(goToNextChunk);
  }

  prev(): void {
    this.move(goToPreviousChunk);
  }

  /** Chunks, for the change map and the "3 of 12" counter. */
  chunkInfo(): { marks: ChunkMark[]; count: number; current: number } {
    const view = this.merge ? this.merge.b : this.single!;
    const info = getChunks(view.state);
    const chunks = info?.chunks ?? [];
    const doc = view.state.doc;
    // positions are relative to the scrollable height, so short texts map to the top of the strip
    const total = Math.max(view.contentHeight, this.host.clientHeight, 1);
    const docA = this.merge ? this.merge.a.state.doc : getOriginalDoc(view.state);
    const moved = (c: Chunk) =>
      this.moves.some((m) => {
        const [bFirst, bLast] = [doc.lineAt(Math.min(c.fromB, doc.length)).number - 1, doc.lineAt(Math.min(c.endB, doc.length)).number];
        const [aFirst, aLast] = [docA.lineAt(Math.min(c.fromA, docA.length)).number - 1, docA.lineAt(Math.min(c.endA, docA.length)).number];
        return c.fromB === c.toB ? m.a0 < aLast && m.a1 > aFirst : m.b0 < bLast && m.b1 > bFirst;
      });
    const marks = chunks.map((c): ChunkMark => {
      const kind = moved(c) ? "move" : c.fromA === c.toA ? "add" : c.fromB === c.toB ? "del" : "mod";
      const top = view.lineBlockAt(Math.min(c.fromB, doc.length)).top;
      const bottom = c.fromB === c.toB ? top : view.lineBlockAt(Math.min(c.endB, doc.length)).bottom;
      return { kind, top: top / total, height: (bottom - top) / total };
    });

    const av = this.activeView();
    const side = this.merge ? this.active : "b";
    const head = av.state.selection.main.head;
    let current = -1;
    chunks.forEach((c, i) => {
      const [from, to] = side === "a" ? [c.fromA, c.endA] : [c.fromB, c.endB];
      if (head >= from && head <= to) current = i;
    });
    return { marks, count: chunks.length, current };
  }

  /** Jump to the chunk at a relative position (0..1) in the right-hand document. */
  gotoChunk(index: number): void {
    const view = this.merge ? this.merge.b : this.single!;
    const chunk: Chunk | undefined = getChunks(view.state)?.chunks[index];
    if (!chunk) return;
    this.active = "b";
    view.dispatch({
      selection: { anchor: Math.min(chunk.fromB, view.state.doc.length) },
      effects: EditorView.scrollIntoView(Math.min(chunk.fromB, view.state.doc.length), { y: "center" }),
    });
    view.focus();
  }

  /** The displayed change blocks as line ranges (0-based, end exclusive). */
  lineOps(): LineOp[] {
    const view = this.merge ? this.merge.b : this.single!;
    const docA = this.merge ? this.merge.a.state.doc : getOriginalDoc(view.state);
    const docB = view.state.doc;
    const range = (doc: typeof docB, from: number, to: number, end: number) => {
      const first = doc.lineAt(Math.min(from, doc.length)).number - 1;
      return from === to ? [first, first] : [first, doc.lineAt(Math.min(end, doc.length)).number];
    };
    return (getChunks(view.state)?.chunks ?? []).map((c) => {
      const [a0, a1] = range(docA, c.fromA, c.toA, c.endA);
      const [b0, b1] = range(docB, c.fromB, c.toB, c.endB);
      return { type: "change", a0, a1, b0, b1 };
    });
  }

  /** Show moved blocks (line indexes from the analysis of the current texts). */
  setMoves(moves: Move[]): void {
    this.moves = moves;
    const tag = (n: number) => t("line {0}", n.toLocaleString());
    if (this.merge) {
      const { a, b } = this.merge;
      const jump = (view: EditorView, line: number) => () => {
        const pos = view.state.doc.line(Math.min(line, view.state.doc.lines)).from;
        view.dispatch({ selection: { anchor: pos }, effects: EditorView.scrollIntoView(pos, { y: "center" }) });
        view.focus();
      };
      a.dispatch({ effects: setMovedBlocks.of(moves.map((m) => ({ fromLine: m.a0 + 1, toLine: m.a1, label: t("Moved to {0}", tag(m.b0 + 1)), jump: jump(b, m.b0 + 1) }))) });
      b.dispatch({ effects: setMovedBlocks.of(moves.map((m) => ({ fromLine: m.b0 + 1, toLine: m.b1, label: t("Moved from {0}", tag(m.a0 + 1)), jump: jump(a, m.a0 + 1) }))) });
    } else if (this.single) {
      this.single.dispatch({ effects: setMovedBlocks.of(moves.map((m) => ({ fromLine: m.b0 + 1, toLine: m.b1, label: t("Moved from original {0}", tag(m.a0 + 1)) }))) });
    }
  }

  destroy(): void {
    this.merge?.destroy();
    this.single?.destroy();
    this.merge = this.single = null;
  }

  // ---------------------------------------------------------------------------

  private views(): Array<[EditorView, { lang: Compartment; wrap: Compartment }]> {
    if (this.merge)
      return [
        [this.merge.a, { lang: this.langA, wrap: this.wrapA }],
        [this.merge.b, { lang: this.langB, wrap: this.wrapB }],
      ];
    return [[this.single!, { lang: this.langB, wrap: this.wrapB }]];
  }

  private activeView(): EditorView {
    if (this.merge) return this.active === "a" ? this.merge.a : this.merge.b;
    return this.single!;
  }

  private move(cmd: StateCommand): void {
    const view = this.activeView();
    if (!cmd({ state: view.state, dispatch: (tr) => view.dispatch(tr) })) {
      // wrap around
      const chunks = getChunks(view.state)?.chunks ?? [];
      if (!chunks.length) return;
      const side = this.merge ? this.active : "b";
      const target = cmd === goToNextChunk ? chunks[0] : chunks[chunks.length - 1];
      const pos = Math.min(side === "a" ? target.fromA : target.fromB, view.state.doc.length);
      view.dispatch({ selection: EditorSelection.cursor(pos), effects: EditorView.scrollIntoView(pos, { y: "center" }) });
    }
    view.focus();
  }

  private rebuild(): void {
    const a = this.a, b = this.b;
    if (this.merge) this.savedStates = { a: this.merge.a.state, b: this.merge.b.state };
    else if (this.single) {
      this.savedStates.b = this.single.state;
      const oldA = this.savedStates.a;
      if (oldA && oldA.doc.toString() !== a) {
        this.savedStates.a = oldA.update({
          changes: ChangeSet.of(diff(oldA.doc.toString(), a).map((c) => ({ from: c.fromA, to: c.toA, insert: a.slice(c.fromB, c.toB) })), oldA.doc.length),
          annotations: Transaction.addToHistory.of(false),
        }).state;
      }
    }
    const scroller = this.host.querySelector<HTMLElement>(this.merge ? ".cm-mergeView" : ".cm-scroller");
    const top = scroller?.scrollTop ?? 0;
    this.destroy();
    this.build(a, b);
    const next = this.host.querySelector<HTMLElement>(this.merge ? ".cm-mergeView" : ".cm-scroller");
    if (next) next.scrollTop = top;
  }

  private shared(side: "a" | "b"): Extension[] {
    const lang = side === "a" ? this.langA : this.langB;
    const wrap = side === "a" ? this.wrapA : this.wrapB;
    return [
      lineNumbers(),
      ...(isChinese() ? [EditorState.phrases.of({
        "Find": "查找", "Replace": "替换", "next": "下一处", "previous": "上一处",
        "all": "全部", "match case": "区分大小写", "by word": "按词匹配",
        "regexp": "正则表达式", "replace": "替换", "replace all": "全部替换",
        "close": "关闭", "Go to line": "跳转到行", "Go": "跳转", "Cancel": "取消",
        "Fold line": "折叠行", "Unfold line": "展开行", "$ lines folded": "已折叠 $ 行",
      })] : []),
      highlightActiveLineGutter(),
      highlightSpecialChars(),
      history(),
      ...(this.savedStates[side] ? [historyField.init(() => this.savedStates[side]!.field(historyField))] : []),
      // The original document is an effect in unified mode; native history only
      // knows about B's ordinary edits unless we supply its inverse explicitly.
      EditorState.transactionExtender.of((tr) => {
        const restore = tr.effects.find((effect) => effect.is(restoreOriginal));
        if (!restore?.is(restoreOriginal)) return null;
        const before = this.single ? getOriginalDoc(tr.startState) : this.merge!.a.state.doc;
        const changes = mapOriginalChange(restore.value.base, before, restore.value.changes);
        return { effects: updateOriginalDoc.of({ doc: changes.apply(before), changes }) };
      }),
      invertedEffects.of((tr) => tr.effects.flatMap((effect) => {
        if (!effect.is(updateOriginalDoc)) return [];
        const before = this.single ? getOriginalDoc(tr.startState) : Text.of(this.a.split("\n"));
        const inverse = effect.value.changes.invert(before);
        return [restoreOriginal.of({ base: effect.value.doc, changes: inverse })];
      })),
      drawSelection(),
      indentOnInput(),
      bracketMatching(),
      highlightActiveLine(),
      highlightSelectionMatches(),
      EditorState.allowMultipleSelections.of(true),
      keymap.of([
        { key: "F7", run: goToNextChunk, shift: goToPreviousChunk, preventDefault: true },
        { key: "Alt-ArrowDown", run: goToNextChunk, preventDefault: true },
        { key: "Alt-ArrowUp", run: goToPreviousChunk, preventDefault: true },
        ...defaultKeymap, ...historyKeymap, ...searchKeymap, ...foldKeymap, indentWithTab,
      ]),
      placeholder(t(side === "a" ? PLACEHOLDER_A : PLACEHOLDER_B)),
      lang.of([]),
      wrap.of(this.settings.wrap ? EditorView.lineWrapping : []),
      appTheme,
      movedBlocksField,
      EditorView.contentAttributes.of({ "aria-label": t(side === "a" ? "Original text" : "Changed text") }),
      EditorView.domEventHandlers({ focus: () => { this.active = side; } }),
      EditorView.updateListener.of((u) => {
        const originalChanged = u.transactions.some((tr) => tr.effects.some((e) => e.is(updateOriginalDoc)));
        if (originalChanged && this.merge) {
          const merge = this.merge;
          const effect = u.transactions.flatMap((tr) => tr.effects).find((e) => e.is(updateOriginalDoc));
          // MergeView updates both siblings together: defer propagation until
          // that transaction completes, avoiding a reentrant sibling update.
          if (effect?.is(updateOriginalDoc)) queueMicrotask(() => {
            if (this.merge !== merge) return;
            merge.a.dispatch({
              changes: effect.value.changes,
              annotations: Transaction.addToHistory.of(false),
            });
          });
        }
        if (u.docChanged || originalChanged) this.onUpdate("doc");
        else if (u.selectionSet || u.focusChanged) this.onUpdate("selection");
      }),
    ];
  }

  private build(a: string, b: string): void {
    const s = this.settings;
    const diffConfig = { override: makeDiffOverride(s.options, s.granularity) };
    const collapse = s.collapse ? { margin: 3, minSize: 6 } : undefined;

    if (s.view === "split") {
      this.merge = new MergeView({
        a: { doc: a, selection: this.savedStates.a?.selection, extensions: this.shared("a") },
        b: { doc: b, selection: this.savedStates.b?.selection, extensions: this.shared("b") },
        parent: this.host,
        revertControls: s.revert,
        renderRevertControl: () => revertButton(s.revert),
        highlightChanges: true,
        gutter: true,
        collapseUnchanged: collapse,
        diffConfig,
      });
    } else {
      this.single = new EditorView({
        parent: this.host,
        state: EditorState.create({
          doc: b,
          selection: this.savedStates.b?.selection,
          extensions: [
            this.shared("b"),
            unifiedMergeView({
              original: a,
              gutter: true,
              highlightChanges: true,
              syntaxHighlightDeletions: true,
              mergeControls: (type, action) => {
                const btn = document.createElement("button");
                btn.name = type;
                btn.type = "button";
                btn.textContent = isChinese() ? (type === "accept" ? "保留修改" : "撤回修改") : (type === "accept" ? "Keep change" : "Undo change");
                btn.title = isChinese() ? (type === "accept" ? "将此修改保留到两侧" : "在此恢复原始文本") : (type === "accept" ? "Keep this change in both versions" : "Restore the original text here");
                btn.onmousedown = action;
                return btn;
              },
              collapseUnchanged: collapse,
              diffConfig,
            }),
          ],
        }),
      });
    }
    this.loadLanguage();
    if (this.moves.length) this.setMoves(this.moves);
    this.onUpdate("doc");
  }

  private loadLanguage(): void {
    const token = ++this.langToken;
    const desc = findLanguage(this.settings.lang);
    const apply = (ext: Extension) => {
      if (token !== this.langToken) return;
      for (const [view, c] of this.views()) view.dispatch({ effects: c.lang.reconfigure(ext) });
    };
    if (!desc) return apply([]);
    if (desc.support) return apply(desc.support);
    desc.load().then(apply, () => apply([]));
  }
}

function replaceDoc(view: EditorView, text: string): void {
  view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: text } });
}

function revertButton(dir: RevertDirection): HTMLElement {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "revert-btn";
  const toRight = dir === "a-to-b";
  btn.textContent = toRight ? "→" : "←";
  btn.title = t(toRight ? "Copy this block to the right side" : "Copy this block to the left side");
  btn.setAttribute("aria-label", btn.title);
  return btn;
}
