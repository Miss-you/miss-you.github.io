#!/usr/bin/env python3
"""标出中文稿件里可能读着累的位置，供人逐处判断。只读，不改稿。

用法：python3 fatigue_scan.py <稿件.md> [--max 8]
"""
import argparse
import re
import sys
from collections import defaultdict

CHECKS = {
    "13 弱动词加名词化": re.compile(
        r"(进行|实现|作出|做出|加以|予以|给予)了?(对[^，。；]{0,15}的)?(?!来|去)[一-鿿]{2}"),
    "14 句尾评论尾巴": re.compile(
        r"[，,](这|从而|进而)?(体现|彰显|凸显|反映|标志着|折射|昭示|印证)(了|出)?"),
    "8 宣告句和复述": re.compile(
        r"本节回答|值得注意的是|需要指出的是|需要说明的是|关键在于|至关重要|总而言之|综上所述|由此可见|不难看出|毋庸置疑"),
    "16 不是……而是": re.compile(r"不是[^。；\n]{1,30}而是"),
    "3 双重否定": re.compile(r"并非不|不是没有|不无|未必不|不可能不"),
    "4 可能悬空的指代": re.compile(r"第[一二三四五六]问|最初的|如上所述|上文提到|前面提到的"),
    "6 工作用语": re.compile(r"(?<![A-Za-z])v\d+(?:\.\d+)?(?![A-Za-z\d])|底稿/|\.py\b|只见摘要|读过原页|第二意见|回译|未取到|✅|⚠️"),
}
NUM = re.compile(r"\d+(?:\.\d+)?%?")
EN_RUN = re.compile(r"[A-Za-z][A-Za-z'’,\-]*(?:\s+[A-Za-z'’,\-]+){5,}")
BULLET = re.compile(r"^\s*(?:[-*+]|\d+[.)])\s+(.*)$")
BOLD = re.compile(r"\*\*[^*]+\*\*")
CLAUSE_SPLIT = re.compile(r"[，,。；;：:！？!?\n]")
SENT_SPLIT = re.compile(r"(?<=[。；！？!?])")


def scan(lines):
    hits = defaultdict(list)
    in_code = False
    for no, raw in enumerate(lines, 1):
        line = raw.rstrip("\n")
        if line.strip().startswith("```"):
            in_code = not in_code
            continue
        if in_code or not line.strip():
            continue
        text = BOLD.sub(lambda m: m.group(0)[2:-2], line)
        if re.search(r"[\u4e00-\u9fff]", text):
            for m in EN_RUN.finditer(text):
                if re.search(r"\b[a-z]{3,}\b", m.group(0)):
                    hits["15 中文里夹英文句"].append((no, m.group(0)[:40]))
        if line.lstrip().startswith("#"):
            m = CHECKS["4 可能悬空的指代"].search(text)
            if m:
                hits["4 可能悬空的指代"].append((no, text.strip()[:40]))
        if line.lstrip().startswith(("|", "#")):
            continue

        for name, pat in CHECKS.items():
            for m in pat.finditer(text):
                hits[name].append((no, snippet(text, m.start())))

        for clause in CLAUSE_SPLIT.split(text):
            if clause.count("的") >= 3 and len(clause) >= 20:
                hits["14 长定语和「的」字链"].append((no, clause.strip()[:40]))

        for sent in SENT_SPLIT.split(text):
            if len(NUM.findall(sent)) >= 5:
                hits["10 数字过密的句子"].append((no, sent.strip()[:40]))

        if len(BOLD.findall(line)) >= 2:
            hits["9 一段多处加粗"].append((no, line.strip()[:40]))

        m = BULLET.match(line)
        body = re.sub(r"\s|\*", "", m.group(1)) if m else ""
        if m and len(body) < 15 and not body.endswith(("：", ":")):
            hits["9 不到一句话的 bullet"].append((no, m.group(1)[:40]))

    return hits


def doc_level(lines):
    """全文层面的两项：单位混用、缩写第一次出现时没有解释。"""
    text = "".join(lines)
    notes = []
    if re.search(r"US\$\s?B|\$\d+(?:\.\d+)?\s?[BM]\b|\d\s?B\b", text) and re.search(r"\d\s*(?:亿|万亿)", text):
        notes.append("1 单位混用：同时出现 B（十亿）和「亿 / 万亿」，读者要换算")
    seen = {}
    for no, line in enumerate(lines, 1):
        for m in re.finditer(r"(?<![A-Za-z])[A-Z]{3,6}(?![A-Za-z])", line):
            seen.setdefault(m.group(0), (no, line[m.end(): m.end() + 2]))
    bare = [f"{w}(L{no})" for w, (no, after) in seen.items() if not after.startswith(("（", "("))]
    if bare:
        notes.append("5 首次出现没有括注的缩写（读者是外行时逐个判断）：" + "、".join(bare[:25])
                     + (f" 等 {len(bare)} 个" if len(bare) > 25 else ""))
    return notes


def snippet(text, pos, width=18):
    return text[max(0, pos - width): pos + width].strip()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("path")
    ap.add_argument("--max", type=int, default=8, help="每类最多列出几处")
    args = ap.parse_args()
    with open(args.path, encoding="utf-8") as f:
        lines = f.readlines()
    hits = scan(lines)
    for note in doc_level(lines):
        print(f"## {note}")
    if not hits:
        print("没有扫到提醒。全文层面的问题（数字对不上、一物多名、悬空指代）脚本查不到，仍要人读。")
        return
    for name in sorted(hits, key=lambda k: int(k.split()[0])):
        items = hits[name]
        print(f"\n## {name}：{len(items)} 处")
        for no, s in items[: args.max]:
            print(f"  L{no}: {s}")
        if len(items) > args.max:
            print(f"  ……其余 {len(items) - args.max} 处")
    print("\n提醒只是让你去读的位置，逐处回到 catalog.md 判断。"
          "第 1 到 6 类（数字对不上、一物多名、方向翻转、悬空指代、术语、工作用语）脚本基本查不到，要人读。")


if __name__ == "__main__":
    sys.exit(main())
