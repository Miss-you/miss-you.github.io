#!/bin/bash
#
# 启动 Hugo 本地开发服务器
# 自动检查并初始化子模块
#

set -e

echo "🚀 启动 Hugo 本地开发服务器..."
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
    exit 1
fi

echo "✅ Hugo 版本: $(hugo version | head -1)"
echo ""

# 检查子模块
if [ ! -d "themes/PaperMod/layouts" ]; then
    echo "🔄 主题子模块未初始化，正在初始化..."
    git submodule update --init --recursive
    echo "✅ 子模块初始化完成"
    echo ""
fi

# 检查是否有草稿文章
draft_count=$(find content/posts -name "index.md" -exec grep -l "draft: true" {} \; 2>/dev/null | wc -l | tr -d ' ')
if [ "$draft_count" -gt 0 ]; then
    echo "📝 发现 $draft_count 篇草稿文章 (draft: true)"
    echo "   使用 -D 参数预览草稿"
    echo ""
fi

echo "🌐 服务器信息:"
echo "   本地地址: http://localhost:1313"
echo "   局域网:   http://$(ifconfig | grep 'inet ' | grep -v '127.0.0.1' | head -1 | awk '{print $2}'):1313  (如适用)"
echo ""
echo "📁 监视目录: content/, layouts/, assets/"
echo "🛑 按 Ctrl+C 停止服务器"
echo ""

# 启动服务器
hugo server -D --bind 0.0.0.0
