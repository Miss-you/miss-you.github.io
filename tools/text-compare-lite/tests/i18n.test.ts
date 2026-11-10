import { afterEach, describe, expect, it, vi } from "vitest";
import { t } from "../src/i18n";
import { renderDataPanel } from "../src/ui/datapanel";

afterEach(() => vi.unstubAllGlobals());

describe("YDD interface localization", () => {
  it("keeps English without a browser or on the English route", () => {
    expect(t("Save")).toBe("Save");
    vi.stubGlobal("document", { documentElement: { lang: "en" } });
    expect(t("{0} lines", 3)).toBe("3 lines");
  });

  it("translates explicit interface messages on the Chinese route", () => {
    vi.stubGlobal("document", { documentElement: { lang: "zh" } });
    expect(t("Save")).toBe("保存");
    expect(t("{0} lines", 3)).toBe("3 行");
  });

  it("preserves user values and never translates substrings", () => {
    vi.stubGlobal("document", { documentElement: { lang: "zh-Hans" } });
    expect(t("Reading {0}…", "Save <draft>.md")).toBe("正在读取 Save <draft>.md…");
    expect(t("My Original draft: Save")).toBe("My Original draft: Save");
    expect(t("{0} lines", "{1}")).toBe("{1} 行");
  });
  it("localizes data labels while preserving user keys and values verbatim", () => {
    vi.stubGlobal("document", { documentElement: { lang: "zh" } });
    const panel = { innerHTML: "" } as HTMLElement;
    renderDataPanel(panel, '{"Save":"Original <draft>"}', '{"Save":"Changed <draft>"}');
    expect(panel.innerHTML).toContain("按 JSON 结构比较");
    expect(panel.innerHTML).toContain("Save");
    expect(panel.innerHTML).toContain("Original &lt;draft&gt;");
    expect(panel.innerHTML).toContain("Changed &lt;draft&gt;");
    expect(panel.innerHTML).not.toContain("<draft>");
  });
});
