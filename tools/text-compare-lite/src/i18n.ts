/** YDD adaptation: explicitly localize UI messages; document data never goes through this module. */
const zh: Record<string, string> = {
  "Third-party licenses": "第三方许可",
  "Jump to where this block is on the other side": "跳转到另一侧对应的内容块",
  "This file isn't a valid {0}.": "这不是有效的 {0}。",
  "Word document": "Word 文档",
  "Excel workbook": "Excel 工作簿",
  "This file isn't a Word document (.docx).": "此文件不是 Word 文档（.docx）。",
  "This file isn't an Excel workbook (.xlsx).": "此文件不是 Excel 工作簿（.xlsx）。",
  "That comparison is no longer here.": "该对比记录已不存在。",
  "{0} and {1}, ": "{0} 与 {1}，",

  "or": "或",
  "Find and replace": "查找与替换",
  "Accept change": "接受改动",
  "Reject change": "拒绝改动",
  "Added": "新增",
  "Removed": "删除",
  "Modified": "修改",
  "Change": "变化",
  "Path": "路径",
  "Row": "行",
  "a table": "表格",
  "plain text": "纯文本",
  "{0} addition": "新增 {0} 项",
  "{0} additions": "新增 {0} 项",
  "{0} removal": "删除 {0} 项",
  "{0} removals": "删除 {0} 项",
  "{0} changed value": "修改 {0} 项",
  "{0} changed values": "修改 {0} 项",
  "{0} row": "{0} 行",
  "{0} rows": "{0} 行",
  "Same data. Only formatting or key order differs, if anything.": "数据相同，可能只有格式或键顺序不同。",
  "JSON compared by structure: {0}, {1}, {2}. Key order is ignored, and lists of objects are matched by their id.": "按 JSON 结构比较：{0}，{1}，{2}。忽略键顺序，对象列表按 id 匹配。",
  "Showing the first {0} of {1} differences.": "共 {1} 处差异，仅显示前 {0} 处。",
  "Rows matched by {0}.": "按 {0} 匹配行。",
  "No unique first column, so rows are matched by order.": "首列不唯一，按行顺序匹配。",
  "New columns: {0}.": "新增列：{0}。",
  "Removed columns: {0}.": "删除列：{0}。",
  "Table compared by rows: {0} added, {1} removed, {2} changed ({3} rows before, {4} after).": "按行比较：新增 {0}，删除 {1}，修改 {2}（原有 {3} 行，修改后 {4} 行）。",
  "Every row matches.": "所有行相同。",
  "Showing the first {0} of {1} changed rows.": "共 {1} 行改动，仅显示前 {0} 行。",
  "Add JSON, CSV or TSV to both sides to compare them as data.": "请在两侧输入 JSON、CSV 或 TSV，以按数据结构比较。",
  "The Data view compares JSON with JSON, or CSV/TSV tables with each other. The original is {0} and the changed side is {1}.": "数据视图支持 JSON 之间或 CSV/TSV 表格之间的比较。原始内容是{0}，修改后内容是{1}。",
  "Document mode is on, so paragraphs wrap and changes show by word.": "已开启文档模式，段落会自动换行。",
  "Your browser blocked reading the clipboard. Click in the side and press Ctrl+V instead.": "浏览器未允许读取剪贴板。请点击编辑区并按 Ctrl+V 或 ⌘V 粘贴。",
  "Only the first two files were opened.": "只打开了前两个文件。",
  "Slide between original and changed": "滑动比较原始与修改后图片",
  "Drop an image here or use Open file to add the {0} image": "拖入图片或点击「打开文件」，添加{0}图片",
  "Add an image to both sides to compare them.": "请在两侧各添加一张图片。",
  "Both {0}×{1}": "两侧均为 {0}×{1}",
  "Sizes differ: {0}×{1} and {2}×{3}": "尺寸不同：{0}×{1} 与 {2}×{3}",
  "pixels identical": "像素相同",
  "{0}% of pixels differ": "{0}% 的像素不同",
  "{0} ({1} of {2})": "{0}（第 {1} / {2} 处）",

  "Comparison tools": "对比工具", "Layout": "视图", "Side by side": "并排", "Unified": "单栏", "Data": "数据",
  "Compare JSON, CSV or TSV by structure": "按结构比较 JSON、CSV 或 TSV", "Syntax highlighting": "语法高亮", "Language": "语言",
  "Options": "设置", "What counts as a difference": "比较规则", "Ignore upper/lower case": "忽略大小写", "Ignore blank lines": "忽略空行",
  "Compare all whitespace": "比较所有空白", "Ignore spaces at line ends": "忽略行尾空白", "Ignore all whitespace": "忽略所有空白",
  "Ignore text that matches": "忽略匹配的内容", "Your own patterns, one regular expression per line": "自定义规则，每行一个正则表达式（RE2 语法）",
  "e.g. build-\\d+": "例如 build-\\d+", "Highlight changes by": "高亮精度", "Whole words": "按词", "Single characters": "按字符",
  "Show moved blocks": "标出移动的内容块", "Display": "显示", "Document mode, for prose": "文档模式，适合文章", "Hide unchanged lines": "折叠未改动行",
  "Wrap long lines": "长行自动换行", "Merge arrows copy right to left": "合并箭头从右向左复制", "Privacy": "隐私", "Keep a history of my comparisons": "保存本地历史记录",
  "Reopen my last text on this device": "在此设备恢复上次文本", "Changes": "差异", "Previous change": "上一处", "Previous change (Shift+F7)": "上一处（Shift+F7）",
  "Next change": "下一处", "Next change (F7)": "下一处（F7）", "Library": "本地记录", "Saved comparisons and history": "本地保存与历史记录",
  "Save": "保存", "Save this comparison (Ctrl+S)": "保存本次对比（Ctrl+S）", "Tools": "工具", "Swap sides": "交换两侧", "Format JSON and sort keys": "格式化 JSON 并排序键",
  "Remove spaces at line ends": "删除行尾空白", "Sort lines on both sides": "两侧按行排序", "Clear both sides": "清空两侧", "Export": "导出",
  "Download report (HTML)": "下载 HTML 报告", "Print or save report as PDF": "打印或另存为 PDF", "Copy diff": "复制差异", "Download .patch": "下载 .patch 补丁",
  "Download original": "下载原始文本", "Download changed": "下载修改后文本", "Copy link": "复制链接", "Theme": "主题", "Help": "帮助", "Shortcuts and about (?)": "快捷键与说明（?）",
  "Original": "原始文本", "Changed": "修改后文本", "Original name": "原始文本名称", "Changed name": "修改后文本名称", "Open file": "打开文件", "Paste": "粘贴", "Clear": "清空",
  "Structured comparison": "结构化比较", "Image comparison": "图片比较", "Image view": "图片视图", "Slider": "滑块", "Overlay": "叠加", "Difference": "差异图", "Changed image": "修改后图片",
  "Back to text": "返回文本", "Change map": "差异概览", "Drop to open as original": "拖到这里作为原始内容", "Drop to open as changed": "拖到这里作为修改后内容",
  "text.compare is free and open source.": "text.compare 免费开源。", "Source for this version": "本站版本源码", "Upstream project": "上游项目", "Get the code on GitHub": "在 GitHub 查看源码",
  "Buy me a coffee": "支持原作者", "Compare two texts and see exactly what changed. The comparison runs in your browser, and this site has no ads.": "比较两份文本，查看每处改动。对比在浏览器本地运行，本页没有广告。",
  "Text you paste and files you open (Word, Excel, PDF, images) are read in your browser. Comparing never sends them anywhere.": "粘贴的文本和打开的 Word、Excel、PDF、图片均在浏览器本地读取，比较时不会上传。",
  "History is off by default. Explicit saves and any history you enable stay in this browser.": "默认关闭历史记录。主动保存的内容和自行开启的历史记录只保存在本浏览器。",
  "Copy link puts the text inside the link itself. Anyone with the complete link can read it; this is not encrypted sharing.": "复制链接会把文本放进链接本身。持有完整链接的人可以读取内容，这不是加密分享。",
  "There are no accounts, no analytics and no tracking.": "没有账号、统计脚本或跟踪。", "Keyboard": "快捷键", "Tips": "使用提示",
  "Find and replace in a side": "在当前侧查找与替换", "Undo an edit or merge": "撤销编辑或合并", "Save the comparison to your library": "将对比保存到本地记录", "Show this help": "打开帮助",
  "Both sides are editable. Use the arrows between them to copy a block across.": "两侧均可编辑。使用中间的箭头复制整块改动。",
  "Drop two files at once to compare them straight away. Word, Excel, PDF and image files work too.": "同时拖入两个文件即可比较，也支持 Word、Excel、PDF 和图片。",
  "Blocks that moved are shown in violet with a tag that jumps to where they went.": "移动的内容块显示为紫色，点击标记可跳转到对应位置。",
  "The Data tab compares JSON and CSV by structure, so reordered keys or rows don't count as changes.": "数据视图按结构比较 JSON 和 CSV，可识别键顺序变化并按键匹配行。",
  "Export a report to send someone, or print it as a PDF redline.": "可导出报告，或打印为带改动标记的 PDF。", "Options can ignore case, whitespace and blank lines.": "设置中可忽略大小写、空白或空行。",
  "Save a comparison explicitly and find it later in the Library.": "主动保存后，可在本地记录中重新打开对比。",
  "This tool is adapted from text-compare-lite under GNU AGPL-3.0. Made by James Patton; adapted for YDD.": "本工具基于 text-compare-lite 改造，遵循 GNU AGPL-3.0。原作者 James Patton，YDD 接入与适配。",
  "Close": "关闭", "Copy this": "手动复制", "Your browser blocked automatic copying. Select the text below and copy it.": "浏览器未允许自动复制，请选中下方文本后手动复制。", "Done": "完成",
  "No changes": "没有差异", "{0} of {1}": "第 {0} / {1} 处", "{0} change": "{0} 处差异", "{0} changes": "{0} 处差异", "{0} line": "{0} 行", "{0} lines": "{0} 行",
  "Comparing images. Switch views with the buttons above the pictures.": "正在比较图片，可用图片上方按钮切换视图。",
  "Paste or drop text on both sides to compare. Word, Excel, PDF and image files work too, and are read in your browser, not uploaded.": "在两侧粘贴文本或拖入文件即可比较。也支持 Word、Excel、PDF 和图片，均在本地读取。",
  "with your ignore options": "已应用忽略规则", "The two sides are identical": "两侧内容相同", "Lines only in the changed text": "仅修改后文本包含的行", "Lines only in the original text": "仅原始文本包含的行",
  "{0} block changed": "{0} 个内容块改动", "{0} blocks changed": "{0} 个内容块改动", "Blocks that were moved, not rewritten": "移动而非重写的内容块", "{0} moved": "{0} 块移动", "{0} of lines are unchanged": "{0} 的行未改动", "{0} the same": "{0} 相同",
  "Not a valid pattern, so it's skipped: {0}": "规则无效或不支持，已跳过：{0}", "Side by side needs a wider screen.": "并排视图需要更宽的屏幕。",
  "Auto-detect": "自动识别", "Plain text": "纯文本", "Common": "常用语言", "All languages": "全部语言", "Auto ({0})": "自动（{0}）",
  "Dates and times": "日期与时间", "GUIDs / UUIDs": "GUID / UUID", "Hex values like 0x1F": "十六进制值（如 0x1F）", "All numbers": "所有数字",
  "Your text will be kept in this browser until you turn this off.": "文本将保存在本浏览器，直到关闭此选项。", "Saved text removed from this browser.": "已删除本浏览器保存的恢复文本。",
  "That's a large text, so comparing may take a moment.": "文本较大，比较可能需要一点时间。", "Add some text first.": "请先输入文本。", "Sides swapped": "已交换两侧", "The {0} text isn't valid JSON, so nothing was formatted.": "{0}不是有效 JSON，未执行格式化。",
  "original": "原始文本", "changed": "修改后文本", " and ": "与", "JSON formatted with sorted keys": "已格式化 JSON 并排序键", "Removed spaces at line ends": "已删除行尾空白", "Sorted lines on both sides": "已将两侧按行排序",
  "Nothing to copy: the two sides are identical.": "两侧相同，没有可复制的差异。", "Diff copied": "已复制差异", "Nothing to download: the two sides are identical.": "两侧相同，没有可下载的差异。",
  "Images can't go in a link. Links carry text only.": "链接只能包含文本，不能包含图片。", "Add some text first, then copy a link to it.": "请先输入文本，再复制分享链接。", "This text is too large to fit in a link. Download a report or .patch instead.": "文本过大，无法放进链接。请下载报告或 .patch 补丁。",
  "Link copied ({0} KB). Some apps cut off links this long.": "已复制链接（{0} KB）。部分应用会截断过长的链接。", "Link copied. The text travels inside the link; nothing is stored on a server.": "已复制链接。文本包含在链接中，不存储到服务器。",
  "Reading {0}…": "正在读取 {0}…", "That image couldn't be opened.": "无法打开该图片。", "Opened {0} in document mode.": "已在文档模式打开 {0}。", "Opened {0}": "已打开 {0}", "Clipboard access was blocked. Paste into the editor with Ctrl+V or ⌘V.": "浏览器未允许读取剪贴板，请在编辑器中按 Ctrl+V 或 ⌘V 粘贴。",
  "This link is damaged or was made by a newer version, so it couldn't be opened.": "链接已损坏或来自更新版本，无法打开。", "Opened the shared comparison": "已打开分享的对比", "Untitled comparison": "未命名对比",
  "Theme: follows your system": "主题：跟随系统", "Theme: light": "主题：浅色", "Theme: dark": "主题：深色", "Following your system theme": "已跟随系统主题", "Light theme": "浅色主题", "Dark theme": "深色主题",
  "Add some text to both sides first, then save.": "请先在两侧输入文本，再保存。", "Name": "名称", "Save comparison": "保存对比", "Saving…": "正在保存…", "Saved to this browser": "已保存到本浏览器", "Saved to this browser.": "仅保存在本浏览器。", "Couldn't save.": "无法保存。",
  "Search": "搜索", "Search saved comparisons": "搜索本地对比", "Saved": "已保存", "History": "历史记录", "Close library": "关闭本地记录", "Saved in this browser only.": "仅保存在本浏览器。", "Save current comparison": "保存当前对比",
  "Comparisons are added here as you work. Turn this off in Options.": "编辑时会自动添加历史记录，可在设置中关闭。", "History is off. Turn it on in Options.": "历史记录已关闭，可在设置中开启。", "Loading…": "正在加载…", "Couldn't load your library.": "无法加载本地记录。",
  "Nothing matches your search.": "没有符合搜索条件的记录。", "Nothing saved yet. Save a comparison to find it here later.": "还没有保存的记录。保存对比后可在这里重新打开。", "No history yet.": "暂无历史记录。", "Rename": "重命名", "Delete": "删除",
  "Rename {0}": "重命名 {0}", "Save {0}": "保存 {0}", "Delete {0}": "删除 {0}", "Couldn't open that comparison.": "无法打开该对比。", "Couldn't rename.": "无法重命名。", "Deleted": "已删除", "Couldn't delete.": "无法删除。",
  "just now": "刚刚", "{0} min ago": "{0} 分钟前", "{0} h ago": "{0} 小时前", "{0} d ago": "{0} 天前",
  "{0} has no selectable text. It may be a scanned image.": "{0} 没有可提取文本，可能是扫描图片。", "PDF text": "PDF 文本", "Word text": "Word 文本", "Excel as CSV": "Excel 转 CSV",
  "{0}: this format isn't supported. Save it as .docx, .xlsx, .pdf or text and try again.": "不支持 {0} 的格式，请转换为 .docx、.xlsx、.pdf 或纯文本后重试。", "{0} couldn't be read.": "无法读取 {0}。", "{0} looks like a binary file, not text.": "{0} 看起来是二进制文件，不是文本。",
  "{0} couldn't be opened as an image.": "无法将 {0} 作为图片打开。", "Drop or open the {0} image": "拖入或打开{0}图片", "original image": "原始图片", "changed image": "修改后图片", "Open an image on each side to compare.": "请在两侧各打开一张图片。",
  "line {0}": "第 {0} 行", "Moved to {0}": "移动到{0}", "Moved from {0}": "从{0}移动", "Moved from original {0}": "从原始文本{0}移动", "Original text": "原始文本", "Changed text": "修改后文本",
  "Paste the original text here, or drop a file": "在此粘贴原始文本，或拖入文件", "Paste the changed text here, or drop a file": "在此粘贴修改后文本，或拖入文件", "Copy this block to the right side": "将此块复制到右侧", "Copy this block to the left side": "将此块复制到左侧", "Accept": "接受", "Reject": "拒绝",
};

export function isChinese(): boolean {
  return typeof document !== "undefined" && document.documentElement.lang.toLowerCase().startsWith("zh");
}

/** The message is a developer-owned UI template; values are preserved literally. */
export function t(message: string, ...values: Array<string | number>): string {
  const template = isChinese() ? (zh[message] ?? message) : message;
  return template.replace(/\{(\d+)\}/g, (match, index) => values[Number(index)] === undefined ? match : String(values[Number(index)]));
}

/** Run once, before app initialization inserts any document or saved user data. */
export function initializeStaticUI(root: ParentNode = document): void {
  if (!isChinese()) return;
  for (const section of root.querySelectorAll<HTMLElement>(".app-shell, .site-footer, #help-dialog, #copy-dialog")) {
    const walker = document.createTreeWalker(section, NodeFilter.SHOW_TEXT);
    const texts: Text[] = [];
    while (walker.nextNode()) texts.push(walker.currentNode as Text);
    for (const node of texts) {
      const raw = node.data;
      const key = raw.trim().replace(/\s+/g, " ");
      if (Object.hasOwn(zh, key)) node.data = raw.replace(/\S[\s\S]*\S|\S/, t(key));
    }
    for (const el of [section, ...section.querySelectorAll<HTMLElement>("*")]) {
      for (const name of ["aria-label", "title", "placeholder"]) {
        const value = el.getAttribute(name);
        if (value !== null) el.setAttribute(name, t(value));
      }
    }
  }
}
