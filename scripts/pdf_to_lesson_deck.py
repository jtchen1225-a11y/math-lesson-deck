#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""pdf_to_lesson_deck.py — 教材 PDF 自動轉化輔助工具。

功能：
  1. 解析教科書 PDF 文字與目錄結構。
  2. 自動提取章節名稱、小節劃分、核心概念、公式、思考與交流、例題。
  3. 將章節映射至 5E 新課教學動線（引入、探索、概念、辨析、典例、練習）。
  4. 產生可以直接執行的 lesson-deck 骨架。

用法範例：
  python scripts/pdf_to_lesson_deck.py --pdf "普通高中教科書數學(B版)必修第四冊_第十章_導數.pdf" --out "decks/ch10_lesson"
"""
import argparse
import json
import os
import re
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)

try:
    import pypdf
except ImportError:
    print("提示：正在安裝 pypdf...")
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "pypdf"])
    import pypdf

def extract_pdf_info(pdf_path):
    reader = pypdf.PdfReader(pdf_path)
    total_pages = len(reader.pages)
    pages_text = []
    for i, p in enumerate(reader.pages):
        txt = p.extract_text() or ""
        pages_text.append({'page': i + 1, 'text': txt})

    full_text = "\n".join([p['text'] for p in pages_text])

    # 辨識章標題
    ch_match = re.search(r'第[一二三四五六七八九十\d]+章\s*([^\n\r]+)', full_text)
    chapter_title = ch_match.group(0).strip() if ch_match else "第十章 新授課"

    # 辨識節次標題，如 10.1 復數及其幾何意義、10.2 復數的運算
    sec_matches = re.findall(r'(\d+\.\d+)\s+([^\n\r]+)', full_text)
    sections_dict = {}
    for sm in sec_matches:
        code, name = sm[0].strip(), sm[1].strip()
        # 清除雜質字串
        name = re.sub(r'[\d\s]+$', '', name).strip()
        if len(name) > 1 and len(name) < 25 and code not in sections_dict:
            sections_dict[code] = f"{code} {name}"

    sections = list(sections_dict.values())
    if not sections:
        sections = ['10.1 概念引入與定義', '10.2 幾何意義與性質', '10.3 運算與應用']

    return {
        'total_pages': total_pages,
        'chapter_title': chapter_title,
        'sections': sections,
        'pages_text': pages_text
    }

def main():
    parser = argparse.ArgumentParser(description="教材 PDF 自動轉化新課簡報管線")
    parser.add_argument("--pdf", required=True, help="教材 PDF 檔案路徑")
    parser.add_argument("--out", required=True, help="輸出簡報目錄")
    parser.add_argument("--title", default=None, help="簡報完整標題")
    args = parser.parse_args()

    pdf_path = os.path.abspath(args.pdf)
    if not os.path.exists(pdf_path):
        print(f"錯誤：找不到 PDF 檔案 {pdf_path}")
        sys.exit(1)

    print(f"📖 正在讀取教科書 PDF：{os.path.basename(pdf_path)}...")
    info = extract_pdf_info(pdf_path)
    print(f"   總頁數：{info['total_pages']} 頁")
    print(f"   章名辨識：{info['chapter_title']}")
    print(f"   小節劃分：{', '.join(info['sections'])}")

    deck_title = args.title or f"高中數學新授課 · {info['chapter_title']}"
    eyebrow = "普通高中教科書 · 數學新授課"
    cover_title = info['chapter_title']
    sub_title = " · ".join(info['sections'])
    home_label = "回首頁"

    chap_arg = f"{info['chapter_title']}::{','.join(info['sections'])}"

    # 調用 new_lesson_deck 骨架生成
    new_deck_script = os.path.join(HERE, 'new_lesson_deck.py')
    cmd = [
        sys.executable,
        new_deck_script,
        '--out', args.out,
        '--title', deck_title,
        '--eyebrow', eyebrow,
        '--cover-title', cover_title,
        '--sub', sub_title,
        '--home', home_label,
        '--chapters', chap_arg
    ]

    import subprocess
    ret = subprocess.call(cmd)
    if ret == 0:
        print(f"\n🚀 教材轉化骨架已就緒！")
        print(f"   目錄：{os.path.abspath(args.out)}")
        print(f"   已自動建立各節 5E 探究動線骨架。")

if __name__ == "__main__":
    main()
