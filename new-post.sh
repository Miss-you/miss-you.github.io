#!/bin/bash

# Hugo 文章创建脚本
# 使用方法: ./new-post.sh "文章标题"
# 例如: ./new-post.sh "我的新文章"

if [ $# -eq 0 ]; then
    echo "使用方法: $0 \"文章标题\""
    echo "例如: $0 \"我的新文章\""
    exit 1
fi

# 获取文章标题
TITLE="$1"

# 生成日期格式的目录名
DATE=$(date +%Y%m%d)
# 转换为URL友好的格式
SLUG=$(echo "$TITLE" | sed 's/ /-/g' | sed 's/[^a-zA-Z0-9\u4e00-\u9fa5-]//g')
# 如果为空，使用默认名称
if [ -z "$SLUG" ]; then
    SLUG="new-post"
fi
DIR_NAME="${DATE}-${SLUG}"

# 创建文章目录
ARTICLE_DIR="content/posts/${DIR_NAME}"
mkdir -p "${ARTICLE_DIR}/images"
mkdir -p "${ARTICLE_DIR}/assets"

# 使用Hugo创建文章
hugo new "posts/${DIR_NAME}/index.md"

# 创建说明文件
cat > "${ARTICLE_DIR}/images/README.md" << EOF
# 图片资源目录

本目录用于存放文章相关的图片文件。

## 使用方法

在 index.md 中引用图片：
\`\`\`markdown
![图片描述](./images/filename.jpg)
\`\`\`

## 支持格式
- JPG/JPEG
- PNG
- GIF
- SVG
- WebP
EOF

cat > "${ARTICLE_DIR}/assets/README.md" << EOF
# 资源文件目录

本目录用于存放文章相关的资源文件。

## 可存放的文件类型
- PDF 文档
- 代码文件
- 数据文件
- 其他附件

## 使用方法

在 index.md 中引用资源：
\`\`\`markdown
[下载文件](./assets/filename.pdf)
\`\`\`
EOF

echo "✅ 文章目录创建成功！"
echo "📁 目录位置: ${ARTICLE_DIR}"
echo "📝 文章文件: ${ARTICLE_DIR}/index.md"
echo "🖼️  图片目录: ${ARTICLE_DIR}/images/"
echo "📎 资源目录: ${ARTICLE_DIR}/assets/"
echo ""
echo "现在可以开始编辑文章了："
echo "code ${ARTICLE_DIR}/index.md"