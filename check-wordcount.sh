#!/bin/bash
#
# 检查 Hugo 字数统计脚本
# 需要安装 hugo 才能使用
#

set -e

echo "=========================================="
echo "Hugo 字数统计本地检查"
echo "=========================================="
echo ""

# 检查 hugo 是否安装
if ! command -v hugo &> /dev/null; then
    echo "❌ Hugo 未安装"
    echo ""
    echo "安装方法:"
    echo "  macOS:    brew install hugo"
    echo "  Ubuntu:   sudo apt install hugo"
    echo "  Windows:  winget install Hugo.Hugo.Extended"
    echo ""
    echo "或者访问: https://gohugo.io/installation/"
    exit 1
fi

echo "✅ Hugo 版本: $(hugo version)"
echo ""

# 确保子模块已初始化
if [ ! -d "themes/PaperMod/layouts" ]; then
    echo "🔄 初始化主题子模块..."
    git submodule update --init --recursive
fi

# 构建站点（使用内存文件系统避免污染 public/）
echo "🔄 构建站点..."
rm -rf /tmp/hugo-check
hugo --destination /tmp/hugo-check --buildFuture --quiet

echo "✅ 构建完成"
echo ""

# 提取文章的字数统计
# 从生成的 HTML 中查找 meta 信息
echo "📊 文章字数统计结果:"
echo "=========================================="
echo ""

cd content/posts
for dir in */; do
    if [ -f "${dir}index.md" ]; then
        slug="${dir%/}"
        html_file="/tmp/hugo-check/posts/${slug}/index.html"
        
        if [ -f "$html_file" ]; then
            # BSD grep (macOS) does not support -P; POSIX ERE is sufficient here.
            word_count=$(grep -oE '[0-9]+[[:space:]]*(字|words)' "$html_file" | head -1 || true)
            word_count=${word_count:-未找到}
            lang=$(sed -nE "s/^lang:[[:space:]]*['\"]?([[:alnum:]_-]+).*$/\\1/p" "${dir}index.md" | head -1)
            lang=${lang:-未设置}

            # 判断状态
            if [ "$lang" = "未设置" ]; then
                status="❌ 缺少 lang"
            elif echo "$word_count" | grep -q "字"; then
                if [ "$lang" = "zh" ]; then
                    status="✅"
                else
                    status="⚠️  lang=en 但显示'字'"
                fi
            else
                if [ "$lang" = "en" ]; then
                    status="✅"
                else
                    status="⚠️  lang=zh 但显示'words'"
                fi
            fi
            
            printf "%-40s lang=%-4s count=%-12s %s\n" "$slug" "$lang" "$word_count" "$status"
        fi
    fi
done
cd ../..

echo ""
echo "=========================================="
echo ""

# 启动预览服务器（可选）
REPLY=""
if [[ -t 0 ]]; then
    read -p "是否启动本地预览服务器? (y/N): " -n 1 -r
fi
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 启动 Hugo 服务器..."
    echo "   访问 http://localhost:1313 查看效果"
    echo "   按 Ctrl+C 停止"
    echo ""
    hugo server -D
fi
