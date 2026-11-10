import { afterEach, describe, expect, it, vi } from "vitest";
import markup from "../index.html?raw";
import { EditorState } from "@codemirror/state";
import { movedBlocksField, setMovedBlocks } from "../src/moved-deco";
import { strToU8, zipSync } from "fflate";
import { extractDocx, extractXlsx } from "../src/office";
import { DeviceLibrary } from "../src/library/library";
import { idb } from "../src/library/idb";
import { initializeStaticUI, t } from "../src/i18n";

afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks(); });

const chinese = () => vi.stubGlobal("document", { documentElement: { lang: "zh" } });

describe("Chinese runtime errors and static help", () => {
  it("reports invalid and wrong-format Office files in Chinese", () => {
    chinese();
    expect(() => extractDocx(new Uint8Array([1, 2, 3]))).toThrow("这不是有效的 Word 文档。");
    expect(() => extractDocx(zipSync({ "readme.txt": strToU8("Save <draft>") }))).toThrow("此文件不是 Word 文档（.docx）。");
    expect(() => extractXlsx(zipSync({ "readme.txt": strToU8("Save <draft>") }))).toThrow("此文件不是 Excel 工作簿（.xlsx）。");
  });

  it("reports a missing saved comparison in Chinese", async () => {
    chinese();
    vi.spyOn(idb, "get").mockResolvedValue(undefined);
    await expect(new DeviceLibrary().load("not-here")).rejects.toThrow("该对比记录已不存在。");
  });

  it("localizes the moved-block tooltip and connector without changing names", () => {
    chinese();
    const el = { className: "", textContent: "", type: "", title: "", addEventListener: () => {} };
    vi.stubGlobal("document", { documentElement: { lang: "zh" }, createElement: () => el });
    const state = EditorState.create({ doc: "Source block", extensions: [movedBlocksField] });
    const updated = state.update({ effects: setMovedBlocks.of([{ fromLine: 1, toLine: 1, label: "User label: Save", jump: () => {} }]) }).state;
    updated.field(movedBlocksField).between(0, updated.doc.length, (_from, _to, decoration) => {
      decoration.spec.widget?.toDOM();
    });
    expect(el.title).toBe("跳转到另一侧对应的内容块");
    expect(el.textContent).toBe("User label: Save");
    expect(t("{0} and {1}, ", "Original <draft>", "Save.md")).toBe("Original <draft> 与 Save.md，");
  });

  it("translates static help once before app data is added", () => {
    const nodes = [
      { data: "  History is off by default. Explicit saves and any history you enable stay in this browser.  " },
      { data: "Copy link puts the text inside the link itself. Anyone with the complete link can read it; this is not encrypted sharing." },
      { data: "My Original document: Save" },
    ];
    expect(markup).toContain(nodes[0].data.trim());
    expect(markup).toContain(nodes[1].data);
    const section = { querySelectorAll: () => [], getAttribute: () => null };
    vi.stubGlobal("document", {
      documentElement: { lang: "zh" },
      createTreeWalker: () => {
        let i = -1;
        return { nextNode: () => ++i < nodes.length, get currentNode() { return nodes[i]; } };
      },
    });
    vi.stubGlobal("NodeFilter", { SHOW_TEXT: 4 });
    initializeStaticUI({ querySelectorAll: () => [section] } as unknown as ParentNode);
    expect(nodes[0].data).toContain("默认关闭历史记录");
    expect(nodes[1].data).toContain("这不是加密分享");
    expect(nodes[2].data).toBe("My Original document: Save");
  });
});
