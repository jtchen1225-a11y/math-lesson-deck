#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""new_deck.py — 產生一份新的互動複習簡報骨架。

用法範例：
  python scripts/new_deck.py --out 複習網站七 \
      --title "國中數學 七上 全冊複習" \
      --eyebrow "108 課綱國中數學 · 第 1 冊（七上）" \
      --cover-title "七上全冊複習" \
      --sub "整數的運算 · 分數的運算 · 一元一次方程式" \
      --home "七上複習" \
      --chapters "整數的運算::1-1 負數與數線,1-2 整數的加減" \
                 "分數的運算::2-1 因數與倍數,2-2 最大公因數"

每個 --chapters 項目格式： 章名:色碼:節1,節2,節3
（色碼留空會依章序自動套用內建配色）
"""
import argparse
import datetime
import os
import shutil
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
ASSETS = os.path.join(ROOT, 'assets')

# 章色順序（與參考實作一致，最多 6 章不重複）
PALETTE = ['#2563eb', '#7c3aed', '#059669', '#d97706', '#e11d48', '#0891b2']

CH_TEMPLATE = '''/* ============ 第 %(ch)d 章　%(title)s ============
   節次：%(seclist)s
   對應課綱代碼：（請填）
   課綱邊界：（請填「本章刻意不放」的內容，避免超綱）
   ============================================================ */
window.DECK = window.DECK || [];
(function () {
  const C = '%(color)s';
  const RED = '#e11d48', GRN = '#059669', BLU = '#2563eb', VIO = '#7c3aed', AMB = '#d97706';

  // 標準 SVG 包裝：一定要用這個，圖才會自適應欄寬
  function svg(vb, inner) {
    return `<div style="width:100%%;text-align:center"><svg viewBox="${vb}" style="max-width:100%%">${inner}</svg></div>`;
  }

  // 常用小工具：SVG 文字 / 圓角方塊
  const TX = (x, y, s, o = {}) =>
    `<text x="${x}" y="${y}" ${o.anchor ? `text-anchor="${o.anchor}"` : ''} font-size="${o.fs || 15}" font-weight="${o.fw || 800}" fill="${o.c || '#172033'}">${s}</text>`;
  const BOX = (x, y, w, h, o = {}) =>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.r || 12}" fill="${o.fill || '#fff'}" stroke="${o.stroke || '#dce3ee'}" stroke-width="${o.sw || 1.8}"/>`;

  window.DECK.push({
    ch: %(ch)d,
    title: '%(title)s',
    color: C,
    sections: %(sections)s,
    slides: [

      %(slides)s
    ]
  });
})();
'''

SLIDE_STATIC = '''{
        sec: '%(sec)s', secName: '%(secname)s',
        title: '請填：這一頁的單一重點（一句話，看得懂就記得住）',
        points: [
          '重點一（≤45 字，可用 <b>粗體</b>、<span class="k">關鍵詞</span>、行內數學 \\\\(a+b\\\\)）。',
          '重點二。',
          '重點三。'
        ],
        formula: { label: '公式標籤', tex: 'a^2+b^2=c^2' },
        visual: (h) => {
          h.innerHTML = svg('0 0 440 280', TX(220, 140, '請畫圖', { fs: 18, c: C, anchor: 'middle' }));
        },
        caption: '圖下方一行說明。',
        example: {
          q: '請填題目。',
          steps: ['第一步。', '第二步。'],
          ans: '答案'
        }
      }'''

SLIDE_SLIDER = '''{
        sec: '%(sec)s', secName: '%(secname)s',
        title: '請填：這一頁的單一重點（互動頁）',
        points: [
          '重點一。',
          '重點二。',
          '拖滑桿看○○怎麼變。'
        ],
        formula: { label: '公式標籤', tex: 'y=ax' },
        visual: (h) => {
          h.innerHTML = `<div style="width:100%%"><div id="fig"></div>
            <div class="ictrl"><label>參數 a ＝ <span class="ival" id="av">2</span></label>
            <input type="range" id="as" min="1" max="6" step="1" value="2"></div></div>`;
          const draw = () => {
            const a = +h.querySelector('#as').value;
            h.querySelector('#av').textContent = a;
            let s = TX(220, 40, `目前 a = ${a}`, { fs: 18, c: C, anchor: 'middle' });
            s += BOX(80, 70, 40 * a, 90, { fill: 'rgba(37,99,235,.12)', stroke: C });
            h.querySelector('#fig').innerHTML = svg('0 0 440 280', s);
          };
          h.querySelector('#as').oninput = draw; draw();
        },
        caption: '互動頁的圖下方說明。',
        example: {
          q: '請填題目。',
          steps: ['第一步。', '第二步。'],
          ans: '答案'
        }
      }'''


def parse_chapter(spec, idx):
    parts = spec.split(':')
    if len(parts) < 3:
        sys.exit('--chapters 格式錯誤：%s\n  應為  章名:色碼:節1,節2（色碼可留空）' % spec)
    title, color, secs = parts[0].strip(), parts[1].strip(), parts[2]
    if not color.startswith('#'):
        color = PALETTE[idx % len(PALETTE)]
    sections = [s.strip() for s in secs.split(',') if s.strip()]
    if not sections:
        sys.exit('--chapters「%s」沒有列出任何節次' % title)
    return title, color, sections


def main():
    # Windows 主控台預設可能是 cp950，直接 print 中文/emoji 會炸；強制走 UTF-8
    for stream in (sys.stdout, sys.stderr):
        try:
            stream.reconfigure(encoding='utf-8')
        except Exception:
            pass

    p = argparse.ArgumentParser(description='產生互動複習簡報骨架')
    p.add_argument('--out', required=True, help='輸出資料夾')
    p.add_argument('--title', required=True, help='瀏覽器分頁標題')
    p.add_argument('--eyebrow', default='', help='封面上方小字')
    p.add_argument('--cover-title', default='', help='封面大標')
    p.add_argument('--sub', default='', help='封面副標（各章以 · 分隔）')
    p.add_argument('--home', default='複習', help='左上角回封面按鈕文字')
    p.add_argument('--description', default='', help='meta description')
    p.add_argument('--chapters', nargs='+', required=True,
                   help='章名:色碼:節1,節2 （可給多個）')
    p.add_argument('--slides-per-section', type=int, default=2,
                   help='每節先產生幾張骨架（預設 2，靜態／互動交替）')
    a = p.parse_args()

    out = os.path.abspath(a.out)
    os.makedirs(out, exist_ok=True)
    for f in ('engine.js', 'style.css', 'svg.js'):
        shutil.copy(os.path.join(ASSETS, f), os.path.join(out, f))

    version = datetime.date.today().strftime('%Y%m%d')
    chapters = [parse_chapter(c, i) for i, c in enumerate(a.chapters)]

    for i, (title, color, sections) in enumerate(chapters, start=1):
        slides = []
        for sec in sections:
            code = sec.split()[0]                       # 「1-1 負數與數線」→「1-1」
            name = sec[len(code):].strip() or code
            for k in range(a.slides_per_section):
                tpl = SLIDE_SLIDER if k % 2 == 1 else SLIDE_STATIC
                slides.append(tpl % {'sec': code, 'secname': name})
        sections_js = '[' + ', '.join("'%s'" % s for s in sections) + ']'
        src = CH_TEMPLATE % {
            'ch': i, 'title': title, 'color': color,
            'sections': sections_js,
            'seclist': '、'.join(sections),
            'slides': ',\n\n      '.join(slides),
        }
        with open(os.path.join(out, 'ch%d.js' % i), 'w', encoding='utf-8', newline='\n') as fh:
            fh.write(src)

    tpl = open(os.path.join(ASSETS, 'index.template.html'), encoding='utf-8').read()
    scripts = '\n'.join('  <script src="ch%d.js?v=%s"></script>' % (i, version)
                        for i in range(1, len(chapters) + 1))
    html = (tpl.replace('{{TITLE}}', a.title)
               .replace('{{DESCRIPTION}}', a.description or a.title)
               .replace('{{EYEBROW}}', a.eyebrow)
               .replace('{{COVER_TITLE}}', a.cover_title or a.title)
               .replace('{{COVER_SUB}}', a.sub)
               .replace('{{HOME_LABEL}}', a.home)
               .replace('{{VERSION}}', version)
               .replace('{{CHAPTER_SCRIPTS}}', scripts))
    with open(os.path.join(out, 'index.html'), 'w', encoding='utf-8', newline='\n') as fh:
        fh.write(html)

    total = sum(len(s) for _, _, s in chapters) * a.slides_per_section
    print('✅ 已建立 %s' % out)
    print('   %d 章、%d 張骨架投影片（含章名頁共 %d 頁）'
          % (len(chapters), total, total + len(chapters)))
    print('   資源版本號 ?v=%s' % version)
    print()
    print('下一步：')
    print('  1. 編輯 %s/ch1.js …… 填入實際內容' % os.path.basename(out))
    print('  2. node scripts/verify_deck.js %s' % a.out)
    print('  3. python -m http.server 8890 --directory %s' % a.out)


if __name__ == '__main__':
    main()
