#!/bin/bash

# Hugo 文章删除脚本
# 使用方法: ./delete-post.sh [选项] "文章目录名或关键词"
# 例如: ./delete-post.sh "20250715-hugo-tutorial"
# 例如: ./delete-post.sh --search "hugo"

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 显示帮助信息
show_help() {
    echo -e "${BLUE}Hugo 文章删除脚本${NC}"
    echo ""
    echo "使用方法:"
    echo "  $0 [选项] \"文章目录名或关键词\""
    echo ""
    echo "选项:"
    echo "  -s, --search     搜索模式：显示包含关键词的文章"
    echo "  -f, --force      强制删除，不询问确认"
    echo "  -l, --list       列出所有文章"
    echo "  -h, --help       显示此帮助信息"
    echo ""
    echo "示例:"
    echo "  $0 \"20250715-hugo-tutorial\"     # 删除具体文章"
    echo "  $0 --search \"hugo\"              # 搜索包含hugo的文章"
    echo "  $0 --list                       # 列出所有文章"
    echo "  $0 --force \"20250715-test\"      # 强制删除不询问"
    echo ""
}

# 列出所有文章
list_posts() {
    echo -e "${BLUE}📚 所有文章列表：${NC}"
    echo ""
    if [ -d "content/posts" ]; then
        find content/posts -maxdepth 1 -type d ! -path "content/posts" | sort | while read dir; do
            post_name=$(basename "$dir")
            if [ -f "$dir/index.md" ]; then
                # 尝试提取标题
                title=$(grep -m 1 "^title:" "$dir/index.md" 2>/dev/null | sed 's/title: *"\?\([^"]*\)"\?/\1/' || echo "无标题")
                echo -e "  📄 ${GREEN}$post_name${NC} - $title"
            else
                echo -e "  📄 ${YELLOW}$post_name${NC} - (无index.md)"
            fi
        done
    else
        echo -e "${RED}❌ content/posts 目录不存在${NC}"
    fi
}

# 搜索文章
search_posts() {
    local keyword="$1"
    echo -e "${BLUE}🔍 搜索包含 \"$keyword\" 的文章：${NC}"
    echo ""
    
    if [ -d "content/posts" ]; then
        found=false
        find content/posts -maxdepth 1 -type d ! -path "content/posts" | sort | while read dir; do
            post_name=$(basename "$dir")
            if [[ "$post_name" == *"$keyword"* ]]; then
                found=true
                if [ -f "$dir/index.md" ]; then
                    title=$(grep -m 1 "^title:" "$dir/index.md" 2>/dev/null | sed 's/title: *"\?\([^"]*\)"\?/\1/' || echo "无标题")
                    echo -e "  📄 ${GREEN}$post_name${NC} - $title"
                else
                    echo -e "  📄 ${YELLOW}$post_name${NC} - (无index.md)"
                fi
            fi
        done
        
        if [ "$found" = false ]; then
            echo -e "${YELLOW}😔 未找到包含 \"$keyword\" 的文章${NC}"
        fi
    else
        echo -e "${RED}❌ content/posts 目录不存在${NC}"
    fi
}

# 删除文章
delete_post() {
    local post_name="$1"
    local force="$2"
    local post_dir="content/posts/$post_name"
    
    # 检查文章是否存在
    if [ ! -d "$post_dir" ]; then
        echo -e "${RED}❌ 文章目录不存在: $post_dir${NC}"
        echo ""
        echo -e "${YELLOW}💡 提示：使用以下命令查看可用文章：${NC}"
        echo "  $0 --list"
        echo "  $0 --search \"关键词\""
        exit 1
    fi
    
    # 显示文章信息
    echo -e "${BLUE}📄 准备删除文章：${NC}"
    echo -e "  目录: ${YELLOW}$post_dir${NC}"
    
    if [ -f "$post_dir/index.md" ]; then
        title=$(grep -m 1 "^title:" "$post_dir/index.md" 2>/dev/null | sed 's/title: *"\?\([^"]*\)"\?/\1/' || echo "无标题")
        echo -e "  标题: ${GREEN}$title${NC}"
        
        # 显示文章内容预览
        echo -e "  内容预览:"
        head -n 20 "$post_dir/index.md" | sed 's/^/    /'
        echo ""
    fi
    
    # 显示目录内容
    echo -e "${BLUE}📁 目录内容：${NC}"
    ls -la "$post_dir" | sed 's/^/  /'
    echo ""
    
    # 确认删除
    if [ "$force" != "true" ]; then
        echo -e "${YELLOW}⚠️  确定要删除这篇文章吗？${NC}"
        echo -e "${RED}   此操作不可恢复！${NC}"
        echo ""
        read -p "请输入 'yes' 确认删除: " confirmation
        
        if [ "$confirmation" != "yes" ]; then
            echo -e "${BLUE}ℹ️  取消删除操作${NC}"
            exit 0
        fi
    fi
    
    # 执行删除
    echo -e "${YELLOW}🗑️  正在删除文章...${NC}"
    rm -rf "$post_dir"
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ 文章删除成功！${NC}"
        echo ""
        echo -e "${BLUE}📝 建议执行以下操作：${NC}"
        echo "  1. 重新构建网站: hugo -d docs"
        echo "  2. 提交更改: git add . && git commit -m \"删除文章: $post_name\""
        echo ""
    else
        echo -e "${RED}❌ 删除失败${NC}"
        exit 1
    fi
}

# 主函数
main() {
    local search_mode=false
    local force_mode=false
    local list_mode=false
    local target=""
    
    # 解析参数
    while [[ $# -gt 0 ]]; do
        case $1 in
            -s|--search)
                search_mode=true
                shift
                ;;
            -f|--force)
                force_mode=true
                shift
                ;;
            -l|--list)
                list_mode=true
                shift
                ;;
            -h|--help)
                show_help
                exit 0
                ;;
            *)
                target="$1"
                shift
                ;;
        esac
    done
    
    # 检查是否在正确的目录
    if [ ! -d "content/posts" ]; then
        echo -e "${RED}❌ 请在Hugo项目根目录下运行此脚本${NC}"
        exit 1
    fi
    
    # 执行相应操作
    if [ "$list_mode" = true ]; then
        list_posts
    elif [ "$search_mode" = true ]; then
        if [ -z "$target" ]; then
            echo -e "${RED}❌ 搜索模式需要提供关键词${NC}"
            show_help
            exit 1
        fi
        search_posts "$target"
    else
        if [ -z "$target" ]; then
            echo -e "${RED}❌ 请提供要删除的文章目录名${NC}"
            show_help
            exit 1
        fi
        delete_post "$target" "$force_mode"
    fi
}

# 运行主函数
main "$@"