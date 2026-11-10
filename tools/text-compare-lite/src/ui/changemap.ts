// YDD adaptation: localize only developer-owned interface messages.
import { t } from "../i18n";
import type { ChunkMark } from "../editor";

/** The strip beside the editor that shows where every change is. */
export function renderChangeMap(
  el: HTMLElement,
  marks: ChunkMark[],
  current: number,
  onPick: (index: number) => void,
): void {
  el.replaceChildren(
    ...marks.map((m, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = `mark mark-${m.kind}${i === current ? " current" : ""}`;
      b.style.top = `${(m.top * 100).toFixed(3)}%`;
      b.style.height = `max(3px, ${(m.height * 100).toFixed(3)}%)`;
      const what = m.kind === "add" ? t("Added") : m.kind === "del" ? t("Removed") : t("Changed");
      b.title = t("{0} ({1} of {2})", what, i + 1, marks.length);
      b.setAttribute("aria-label", b.title);
      b.addEventListener("click", () => onPick(i));
      return b;
    }),
  );
}
