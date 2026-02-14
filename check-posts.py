#!/usr/bin/env python3
"""
检查博客文章的字数统计配置
- 验证 lang 参数是否存在
- 估算中文字数（用于对比 Hugo 的统计）
- 输出报告
"""

import os
import re
import sys
from pathlib import Path

def extract_front_matter(content):
    """提取 front matter 内容"""
    match = re.match(r'^---\s*\n(.*?)\n---\s*\n', content, re.DOTALL)
    if match:
        return match.group(1), content[match.end():]
    return None, content

def parse_front_matter(fm_text):
    """解析 front matter 为字典"""
    result = {}
    for line in fm_text.split('\n'):
        line = line.strip()
        if ':' in line and not line.startswith('#'):
            key, value = line.split(':', 1)
            key = key.strip()
            value = value.strip().strip('"').strip("'")
            result[key] = value
    return result

def count_chinese_chars(text):
    """统计中文字符数（包括常用标点）"""
    # 统计 CJK 统一表意文字 + 中文标点
    chinese_chars = re.findall(r'[\u4e00-\u9fff\u3000-\u303f\uff00-\uffef]', text)
    return len(chinese_chars)

def count_total_chars(text):
    """统计总字符数（去除空白）"""
    text = re.sub(r'\s+', '', text)
    return len(text)

def check_post(filepath):
    """检查单个文章"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    fm_text, body = extract_front_matter(content)
    if not fm_text:
        return {
            'file': filepath,
            'error': 'No front matter found'
        }
    
    fm = parse_front_matter(fm_text)
    
    # 检查 lang
    lang = fm.get('lang', 'NOT SET')
    
    # 统计
    cn_count = count_chinese_chars(body)
    total_count = count_total_chars(body)
    
    # 判断语言（阈值降低到 200，考虑短文章和代码混杂的情况）
    detected_lang = 'zh' if cn_count > 200 else 'en'
    lang_ok = (lang == detected_lang)
    
    return {
        'file': filepath,
        'title': fm.get('title', 'Untitled'),
        'lang': lang,
        'lang_ok': lang_ok,
        'detected': detected_lang,
        'cn_chars': cn_count,
        'total_chars': total_count,
        'should_show': f"{total_count} 字" if detected_lang == 'zh' else f"{body.split().__len__()} words"
    }

def main():
    posts_dir = Path('content/posts')
    
    if not posts_dir.exists():
        print("Error: content/posts/ directory not found")
        sys.exit(1)
    
    results = []
    errors = []
    
    # 遍历所有文章
    for post_dir in sorted(posts_dir.iterdir()):
        if post_dir.is_dir():
            index_file = post_dir / 'index.md'
            if index_file.exists():
                result = check_post(index_file)
                if 'error' in result:
                    errors.append(result)
                else:
                    results.append(result)
    
    # 输出报告
    print("=" * 80)
    print(f"博客文章字数统计检查报告")
    print("=" * 80)
    print(f"总计: {len(results)} 篇文章")
    print()
    
    # 显示问题文章
    issues = [r for r in results if not r['lang_ok'] or r['lang'] == 'NOT SET']
    
    if issues:
        print("⚠️  需要修复的文章:")
        print("-" * 80)
        for r in issues:
            print(f"  📄 {r['file']}")
            print(f"     标题: {r['title']}")
            print(f"     当前 lang: {r['lang']}")
            print(f"     建议 lang: {r['detected']}")
            print(f"     预估字数: {r['should_show']}")
            print()
    else:
        print("✅ 所有文章的 lang 参数都正确！")
        print()
    
    # 显示所有文章统计
    print("📊 文章统计详情:")
    print("-" * 80)
    print(f"{'文件名':<50} {'lang':<6} {'中文字符':<10} {'建议显示':<15}")
    print("-" * 80)
    
    for r in results:
        filename = str(r['file']).replace('content/posts/', '')
        status = "✅" if r['lang_ok'] else "❌"
        print(f"{status} {filename:<48} {r['lang']:<6} {r['cn_chars']:<10} {r['should_show']:<15}")
    
    print()
    print("=" * 80)
    print("提示:")
    print("  - Hugo 实际显示的字数可能略有不同（取决于空白处理）")
    print("  - 如果 lang=zh，Hugo 应显示 'XXX 字'")  
    print("  - 如果 lang=en，Hugo 应显示 'XXX words'")
    print("  - 运行 'hugo server -D' 可以在浏览器中预览实际效果")
    print("=" * 80)

if __name__ == '__main__':
    main()
