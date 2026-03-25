---
name: blog-image-pipeline
description: Use when blog post has local images (img/ directory) that need to be visually understood, inserted into the article at appropriate positions, and/or migrated from local relative paths to a GitHub image hosting repository. Triggers: 插入图片, 配图, 上传图片到图床, 图片迁移, 图片外链, insert images, upload to image hosting.
---

# Blog Image Pipeline

Read images → understand content → insert at right positions → upload to GitHub image hosting → replace local paths with external URLs.

## When to Use

- Post directory has `img/` with images not yet in article text → full pipeline
- Article already references `img/xxx.png` locally, needs external hosting only → skip to Phase 2
- Images exist but user unsure where to place them → Phase 1 only

## Phase 0: Path Discovery

All paths derived from git remotes. Never hardcode.

```bash
BLOG_REPO=$(git -C /path/to/article rev-parse --show-toplevel)
BLOG_PARENT=$(dirname "$BLOG_REPO")
for dir in "$BLOG_PARENT"/*/; do
  remote=$(git -C "$dir" remote get-url origin 2>/dev/null)
  if echo "$remote" | grep -q "/img"; then
    IMG_REPO="${dir%/}"; break
  fi
done
IMG_REMOTE=$(git -C "$IMG_REPO" remote get-url origin)
IMG_PATH=$(echo "$IMG_REMOTE" | sed 's|.*github\.com/||; s|\.git$||')
IMG_BRANCH=$(git -C "$IMG_REPO" symbolic-ref --short HEAD)
RAW_BASE="https://raw.githubusercontent.com/$IMG_PATH/$IMG_BRANCH"
BLOG_BRANCH=$(git -C "$BLOG_REPO" symbolic-ref --short HEAD)
```

Print to confirm before proceeding:
```
博客仓库: $BLOG_REPO (branch: $BLOG_BRANCH)
图片仓库: $IMG_REPO (branch: $IMG_BRANCH)
Raw URL 前缀: $RAW_BASE
```

## Phase 1: Understand & Insert Images

### 1.1 Read every image with Read tool

Use Read tool on each image file (Claude is multimodal). For each image, record:
- **Visual content**: What's depicted
- **Key text/message**: Title, labels, data shown
- **Theme**: Which argument/section it illustrates

### 1.2 Analyze article structure

Read the article. Identify logical sections by `---` dividers, headings, or topic shifts. Note the core argument of each section.

### 1.3 Present mapping table for user approval

Before any edits, show the user:

| Image | Content Summary | Target Section | Placement |
|-------|----------------|----------------|-----------|
| img_01 | Title/cover | Front matter | `cover.image` |
| img_02 | Intro concept | Opening section | Before first paragraph |
| img_03 | Argument visual | Section N conclusion | After last paragraph, before `---` |

**Selection criteria**: Not every image must be inserted. Skip images that:
- Duplicate the same point as another image
- Don't match any section's argument
- Would break reading flow (e.g., two images back-to-back)

### 1.4 Insert images

**Cover image** — add to front matter:
```yaml
cover:
    image: "img/filename.png"
    alt: "descriptive alt text"
    relative: true
```

**Body images** — markdown format:
```markdown
![Descriptive alt text summarizing the image's key message](img/filename.png)
```

**Placement principle**: Images go at the END of the section they illustrate — as a visual summary before transitioning to the next topic. Not at the beginning (reader hasn't read the argument yet).

**Alt text**: Describe the image's core message, not just its appearance. Use the article's language (Chinese article → Chinese alt text).

## Phase 2: Upload to Image Hosting

### 2.1 Copy with semantic naming

Target directory: `$IMG_REPO/blog/{article-slug}/`

**Convention**: `NN-semantic-name.ext`
- `NN` = two-digit sequence (01, 02...)
- `semantic-name` = kebab-case English phrase from image content

```bash
DEST="$IMG_REPO/blog/{slug}"
mkdir -p "$DEST"
cp "$SRC/original.png" "$DEST/01-semantic-name.png"
```

### 2.2 Push image repo FIRST

```bash
cd "$IMG_REPO"
git add blog/{slug}/
git commit -m "add blog images: {slug}"
git push origin "$IMG_BRANCH"
```

**CRITICAL**: Push image repo before modifying article paths. Ensures URLs are live.

### 2.3 Batch replace paths in article

Use Python (avoids zsh `declare -A` issues):

```python
file = "/path/to/index.md"
base = f"{RAW_BASE}/blog/{slug}"

mapping = {
    "img/original.png": f"{base}/01-semantic-name.png",
    # ... one entry per image
}

with open(file) as f:
    content = f.read()
for old, new in mapping.items():
    content = content.replace(old, new)
with open(file, "w") as f:
    f.write(content)
```

### 2.4 Fix cover image relativity

If cover image was set, change `relative: true` → `relative: false` (URL is now absolute).

## Verification

```bash
# Count replaced URLs — should equal total images
grep -c 'raw.githubusercontent' index.md

# No local img/ references remaining (only raw.githubusercontent lines expected)
grep 'img/' index.md
```

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Push article before image repo | Always push image repo first |
| `relative: true` with absolute cover URL | Change to `relative: false` |
| Alt text says "图片" or "image" | Write the image's actual message |
| Image placed before its section's argument | Place AFTER concluding paragraph |
| Two images back-to-back without text between | Choose the stronger one, drop the other |
| Using `git add .` or `git add -A` | Only stage specific files/directories |
| Forgetting to present mapping table | Always get user confirmation before editing |
| Image repo not found | Check for sibling directory with `/img` in remote URL |
