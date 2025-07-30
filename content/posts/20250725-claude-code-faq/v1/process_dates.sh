#!/bin/bash

# 获取包含claude相关讨论的日期（更广泛的搜索）
echo "=== 包含claude关键词的日期 ==="
grep -i "claude" chat_records_2025.csv | awk -F',' '{print substr($2,1,10)}' | sort -u

echo -e "\n=== 包含cursor关键词的日期 ==="
grep -i "cursor" chat_records_2025.csv | awk -F',' '{print substr($2,1,10)}' | sort -u

echo -e "\n=== 包含claude code关键词的日期 ==="
grep -i "claude.*code\|claude-code" chat_records_2025.csv | awk -F',' '{print substr($2,1,10)}' | sort -u

echo -e "\n=== 包含AI开发相关关键词的日期 ==="
grep -i "ai.*开发\|ai.*编程\|ai.*工作\|代码.*助手\|编程.*助手" chat_records_2025.csv | awk -F',' '{print substr($2,1,10)}' | sort -u