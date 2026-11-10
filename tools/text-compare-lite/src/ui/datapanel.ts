// YDD adaptation: translate labels, never JSON values, paths, column names or cells.
import { t } from "../i18n";
import { type DataChange, type TableDiff, csvDiff, jsonDiff, structureOf } from "../structure";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const MAX_ROWS = 2000;
const kindLabel = (kind: string) => t(kind === "added" ? "Added" : kind === "removed" ? "Removed" : "Modified");

function show(v: unknown): string {
  if (v === undefined) return "";
  const s = typeof v === "string" ? JSON.stringify(v) : JSON.stringify(v, null, 1);
  return esc(s.length > 400 ? s.slice(0, 400) + "…" : s);
}

function plural(n: number, one: string, many = one + "s") {
  return t(`{0} ${n === 1 ? one : many}`, n.toLocaleString());
}

function renderJson(changes: DataChange[]): string {
  if (!changes.length) return `<p class="data-empty">${t("Same data. Only formatting or key order differs, if anything.")}</p>`;
  const counts = { added: 0, removed: 0, changed: 0 };
  changes.forEach((c) => counts[c.kind]++);
  const rows = changes.slice(0, MAX_ROWS).map((c) => {
    const before = c.kind === "added" ? "" : show(c.before);
    const after = c.kind === "removed" ? "" : show(c.after);
    return `<tr class="dk-${c.kind}"><td class="kind">${kindLabel(c.kind)}</td><td class="path"><code>${esc(c.path)}</code></td><td class="val"><code>${before}</code></td><td class="val"><code>${after}</code></td></tr>`;
  });
  return `<p class="data-summary">${t("JSON compared by structure: {0}, {1}, {2}. Key order is ignored, and lists of objects are matched by their id.", `<b class="c-add">${plural(counts.added, "addition")}</b>`, `<b class="c-del">${plural(counts.removed, "removal")}</b>`, `<b class="c-mod">${plural(counts.changed, "changed value")}</b>`)}</p>
<div class="data-scroll"><table class="data-table"><thead><tr><th>${t("Change")}</th><th>${t("Path")}</th><th>${t("Original")}</th><th>${t("Changed")}</th></tr></thead><tbody>${rows.join("")}</tbody></table></div>
${changes.length > MAX_ROWS ? `<p class="data-note">${t("Showing the first {0} of {1} differences.", MAX_ROWS.toLocaleString(), changes.length.toLocaleString())}</p>` : ""}`;
}

function renderTable(d: TableDiff): string {
  const counts = { added: 0, removed: 0, changed: 0 };
  d.rows.forEach((r) => counts[r.kind]++);
  const cols = d.columns;
  const notes: string[] = [];
  if (d.keyColumn) notes.push(t("Rows matched by {0}.", `<b>${esc(d.keyColumn)}</b>`));
  else notes.push(t("No unique first column, so rows are matched by order."));
  if (d.columnsAdded.length) notes.push(t("New columns: {0}.", `<b class="c-add">${d.columnsAdded.map(esc).join(", ")}</b>`));
  if (d.columnsRemoved.length) notes.push(t("Removed columns: {0}.", `<b class="c-del">${d.columnsRemoved.map(esc).join(", ")}</b>`));

  const body = d.rows.slice(0, MAX_ROWS).map((r) => {
    if (r.kind === "changed") {
      const cells = cols.map((_, i) => {
        if (!r.changedColumns.includes(i)) return `<td>${esc(r.after[i] ?? "")}</td>`;
        const before = beforeValue(d, r.before, cols[i]);
        return `<td class="cell-changed"><del>${esc(before)}</del><ins>${esc(r.after[i] ?? "")}</ins></td>`;
      });
      return `<tr class="dk-changed"><td class="kind">${kindLabel("changed")}</td><td class="key">${esc(r.key)}</td>${cells.join("")}</tr>`;
    }
    const values = r.kind === "added" ? r.after : r.before;
    const cells = cols.map((name, i) => `<td>${esc((r.kind === "added" ? values[i] : beforeValue(d, values, name)) ?? "")}</td>`);
    return `<tr class="dk-${r.kind}"><td class="kind">${kindLabel(r.kind)}</td><td class="key">${esc(r.key)}</td>${cells.join("")}</tr>`;
  });

  return `<p class="data-summary">${t("Table compared by rows: {0} added, {1} removed, {2} changed ({3} rows before, {4} after).", `<b class="c-add">${plural(counts.added, "row")}</b>`, `<b class="c-del">${plural(counts.removed, "row")}</b>`, `<b class="c-mod">${plural(counts.changed, "row")}</b>`, d.rowCountA.toLocaleString(), d.rowCountB.toLocaleString())} ${notes.join(" ")}</p>
${d.rows.length ? `<div class="data-scroll"><table class="data-table"><thead><tr><th>${t("Change")}</th><th>${t("Row")}</th>${cols.map((c) => `<th>${esc(c)}</th>`).join("")}</tr></thead><tbody>${body.join("")}</tbody></table></div>` : `<p class="data-empty">${t("Every row matches.")}</p>`}
${d.rows.length > MAX_ROWS ? `<p class="data-note">${t("Showing the first {0} of {1} changed rows.", MAX_ROWS.toLocaleString(), d.rows.length.toLocaleString())}</p>` : ""}`;
}

function beforeValue(d: TableDiff, row: string[], name: string): string {
  const i = d.columnsBefore.indexOf(name);
  return i >= 0 ? row[i] ?? "" : "";
}

export function renderDataPanel(el: HTMLElement, a: string, b: string): void {
  if (!a.trim() || !b.trim()) {
    el.innerHTML = `<p class="data-empty">${t("Add JSON, CSV or TSV to both sides to compare them as data.")}</p>`;
    return;
  }
  const sa = structureOf(a), sb = structureOf(b);
  if (sa?.kind === "json" && sb?.kind === "json") {
    el.innerHTML = renderJson(jsonDiff(sa.value, sb.value));
    return;
  }
  if (sa?.kind === "table" && sb?.kind === "table") {
    el.innerHTML = renderTable(csvDiff(a, b));
    return;
  }
  const what = (s: typeof sa) => s ? (s.kind === "json" ? "JSON" : t("a table")) : t("plain text");
  el.innerHTML = `<p class="data-empty">${t("The Data view compares JSON with JSON, or CSV/TSV tables with each other. The original is {0} and the changed side is {1}.", what(sa), what(sb))}</p>`;
}

export function dataAvailable(a: string, b: string): boolean {
  const sa = structureOf(a), sb = structureOf(b);
  return !!sa && !!sb && sa.kind === sb.kind;
}
