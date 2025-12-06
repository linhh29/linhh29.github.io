#!/usr/bin/env python3
"""
自动从 Google Scholar 获取论文信息并生成格式化的论文列表
"""

import json
import re
import os
import shutil
import requests
from pathlib import Path
from datetime import datetime
from scholarly import scholarly
from bs4 import BeautifulSoup
from urllib.parse import urlparse, urljoin

# 配置
SCHOLAR_ID = 'u2TFzcAAAAAJ'  # 从 config.js 中的 scholar URL 提取
AUTHOR_NAME = 'Hehai Lin'  # 用于标记作者
PUBLICATIONS_DIR = Path(__file__).parent / 'public' / 'materials' / 'publications'
FIGURES_DIR = Path(__file__).parent / 'figures'
OUTPUT_FILE = Path(__file__).parent / 'papers_output.txt'

def get_papers_from_scholar():
    """从 Google Scholar 获取论文列表"""
    print(f"正在从 Google Scholar 获取论文 (ID: {SCHOLAR_ID})...")
    author = scholarly.search_author_id(id = SCHOLAR_ID, filled = True, sortby = "year")
    # scholarly.pprint(author)

    # author = scholarly.fill(scholarly.search_author_id(id = SCHOLAR_ID, sortby = "year"))
    publications = author.get('publications', [])
    
    papers = []
    for i, pub in enumerate(publications):
        print(f"\n处理论文 {i+1}/{len(publications)}...")
        filled_pub = scholarly.fill(pub)
        # print(pub)
        # break
        
        bib = filled_pub.get('bib', {})
        title = bib.get('title', '')
        authors = bib.get('author', [])
        venue = bib.get('venue', '')
        year = bib.get('pub_year', '')
        pub_url = filled_pub.get('pub_url', '')
        url = filled_pub.get('eprint_url', '') or pub_url or ''
        
        if not title:
            continue
            
        papers.append({
            'title': title,
            'authors': authors,
            'venue': venue,
            'year': str(year) if year else '',
            'url': url,
            'filled_pub': filled_pub
        })
    
    # 按日期降序排序（最新的在前）
    # papers.sort(key=lambda x: x['pub_date'], reverse=True)
    
    return papers

def format_authors(authors_list, author_name):
    """格式化作者列表，标记第一作者和自己"""
    if isinstance(authors_list, str):
        authors_list = [a.strip() for a in authors_list.split(' and ')]
    
    formatted = []
    for i, author in enumerate(authors_list):
        author = author.strip()
        if not author:
            continue
            
        is_me = author_name.lower() in author.lower() or author.lower() in author_name.lower()
        # is_first = (i == 0)
        
        if is_me:
            # 自己，用 == 标记（无论是否第一作者）
            tmp = f'=={author}=='
            tmp = tmp.replace('*==', '==*')
            formatted.append(tmp)
        else:
            formatted.append(author)

        
    
    return ', '.join(formatted)

def extract_venue_from_title(title):
    """从标题中提取会议/期刊名称"""
    patterns = [
        r'\[([^\]]+)\s+\d{4}\]',  # [ACL 2025], [UIST 2023]
        r'\(([^\)]+)\s+\d{4}\)',   # (ACL 2025)
    ]
    
    for pattern in patterns:
        match = re.search(pattern, title)
        if match:
            venue = match.group(1).strip()
            return venue
    
    return ''

def normalize_title_for_matching(title):
    """标准化标题用于匹配文件名"""
    # 转换为小写，移除标点符号和多余空格
    normalized = title.lower()
    # 移除常见的标点符号
    normalized = re.sub(r'[^\w\s]', '', normalized)
    # 移除多余空格
    normalized = re.sub(r'\s+', ' ', normalized).strip()
    return normalized

def find_figure_by_title(title):
    """根据论文标题在 figures 文件夹中查找对应的图片文件"""
    if not FIGURES_DIR.exists():
        return None
    
    # 标准化标题用于匹配
    normalized_title = normalize_title_for_matching(title)
    
    # 遍历 figures 文件夹中的所有图片文件
    for img_file in FIGURES_DIR.glob('*.png'):
        # 获取文件名（不含扩展名）
        file_name = img_file.stem
        # 标准化文件名
        normalized_file = normalize_title_for_matching(file_name)
        
        # 检查是否匹配（使用包含关系，因为标题可能不完全一致）
        if normalized_title in normalized_file or normalized_file in normalized_title:
            return img_file
    
    # 如果精确匹配失败，尝试部分匹配
    title_words = set(normalized_title.split())
    best_match = None
    best_score = 0
    
    for img_file in FIGURES_DIR.glob('*.png'):
        file_name = img_file.stem
        normalized_file = normalize_title_for_matching(file_name)
        file_words = set(normalized_file.split())
        
        # 计算匹配的单词数量
        common_words = title_words & file_words
        if len(common_words) > best_score and len(common_words) >= 3:  # 至少3个单词匹配
            best_score = len(common_words)
            best_match = img_file
    
    return best_match

def copy_image_from_figures(title, output_path):
    """从 figures 文件夹根据标题复制图片到 publications 目录"""
    print(f"  正在从 figures 文件夹查找图片: {title}")
    
    source_file = find_figure_by_title(title)
    
    if not source_file:
        print(f"  ✗ 未找到匹配的图片文件")
        return False
    
    try:
        shutil.copy2(source_file, output_path)
        print(f"  ✓ 图片已复制: {source_file.name} -> {output_path.name}")
        return True
    except Exception as e:
        print(f"  ✗ 复制失败: {str(e)}")
        return False

def clean_title(title):
    """清理标题，移除已有的会议标记"""
    # 移除 [Conference Year] 格式的标记
    title = re.sub(r'\[[^\]]+\s+\d{4}\]\s*', '', title)
    # 移除 (Conference Year) 格式的标记
    title = re.sub(r'\([^\)]+\s+\d{4}\)\s*', '', title)
    return title.strip()

def format_paper_entry(paper, index):
    """格式化单篇论文为 config.js 格式"""
    raw_title = paper['title']
    title = clean_title(raw_title)
    authors = format_authors(paper['authors'], AUTHOR_NAME)
    print(authors)
    venue = paper['venue'] or extract_venue_from_title(raw_title)
    year = paper['year']
    url = paper['url']
    # print(url)
    
    # 检查是否是 co-first author（根据作者列表中的标记或标题）
    co_first = 'co-first' in raw_title.lower() or 'cofirst' in raw_title.lower()
    if co_first:
        year_suffix = f"{year}, co-first author"
    else:
        year_suffix = year
    
    # 如果 venue 为空，尝试从 URL 推断
    if not venue:
        if 'arxiv' in url.lower():
            venue = 'ArXiv'
        elif 'aclanthology' in url.lower() or 'acl' in url.lower():
            # 尝试从 URL 提取更具体的 venue
            if 'findings' in url.lower():
                venue = 'ACL Findings'
            else:
                venue = 'ACL'
        elif 'uist' in url.lower():
            venue = 'UIST'
        elif 'iconip' in url.lower():
            venue = 'ICONIP'
        elif 'https://dl.acm.org/doi/abs/10.1145/3586183.3606816' in url.lower():
            venue = 'UIST'
        elif 'https://link.springer.com/chapter/10.1007/978-981-96-6951-6_12' in url.lower():
            venue = 'ICONIP'
        else:
            venue = 'Unknown'
    
    # 确保 venue 和 year 都不为空
    if not venue:
        venue = 'Unknown'
    if not year:
        year = 'Unknown'
    
    entry = f"""    {{
      title: '[{venue} {year}] {title}',
      authors: '{authors}',
      venue: '{venue}',
      year: '{year_suffix}',
      link: '{url}',
    }}"""
    
    return entry

def main():
    print("=" * 60)
    print("论文信息自动获取工具")
    print("=" * 60)
    
    # 确保 publications 目录存在
    PUBLICATIONS_DIR.mkdir(parents=True, exist_ok=True)
    
    # 获取论文
    papers = get_papers_from_scholar()
    
    if not papers:
        print("未找到论文，请检查 Google Scholar ID")
        return
    
    print(f"\n找到 {len(papers)} 篇论文")
    
    # 处理每篇论文
    formatted_entries = []
    for i, paper in enumerate(papers, 1):
        print(f"\n{'='*60}")
        print(f"论文 {i}: {paper['title']}")
        print(f"{'='*60}")
        
        # 从 figures 文件夹复制图片
        img_path = PUBLICATIONS_DIR / f"{i}.png"
        if not img_path.exists():
            copy_image_from_figures(paper['title'], img_path)
        else:
            print(f"  图片已存在: {img_path}")
        
        # 格式化条目
        entry = format_paper_entry(paper, i)
        formatted_entries.append(entry)
    
    # 生成输出
    output = "  papers: [\n" + ",\n".join(formatted_entries) + "\n  ],"
    
    # 保存到文件
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write(output)
    
    print(f"\n{'='*60}")
    print("完成！")
    print(f"{'='*60}")
    print(f"\n生成的论文列表已保存到: {OUTPUT_FILE}")
    print("\n请复制以下内容到 config.js 的 papers 字段：\n")
    print(output)

if __name__ == '__main__':
    main()

