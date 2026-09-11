#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""new_lesson_deck.py — 產生一份專為「新授課」設計的互動數學簡報骨架。

包含新課標準 5E / 探究動線骨架（引入 → 探索 → 概念 → 辨析 → 典例 → 練習 → 小結）。

用法範例：
  python scripts/new_lesson_deck.py --out 導數新課 \
      --title "高中數學 必修第四冊 · 導數的概念與幾何意義" \
      --eyebrow "普通高中教科書 · 數學新授課" \
      --cover-title "第十章 導數" \
      --sub "瞬時變化率 · 割線逼近切線 · 導數的幾何意義" \
      --home "導數新課" \
      --start-btn "開始探索 →" \
      --chapters "導數的概念與運算::10.1.1 瞬時變化率與導數,10.1.2 導數的幾何意義"
"""
import argparse
import datetime
import os
import shutil
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
ASSETS = os.path.join(ROOT, 'assets')

PALETTE = ['#2563eb', '#7c3aed', '#059669', '#d97706', '#e11d48', '#0891b2']

CH_TEMPLATE = '''/* ============ 第 %(ch)d 章　%(title)s (新授課) ============
   節次：%(seclist)s
   教學理念：情境引入 → 動態探索 → 概念抽象 → 反例辨析 → 階梯典例 → 即堂檢測
   ============================================================ */
window.DECK = window.DECK || [];
(function () {
  const C = '%(color)s';
  const RED = '#e11d48', GRN = '#059669', BLU = '#2563eb', VIO = '#7c3aed', AMB = '#d97706';

  function svg(vb, inner) {
    return `<div style="width:100%%;text-align:center"><svg viewBox="${vb}" style="max-width:100%%">${inner}</svg></div>`;
  }

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

SLIDE_HOOK = '''      {
        sec: '%(sec)s', secName: '%(secname)s',
        type: 'hook',
        title: '情境引入：核心問題引導',
        points: [
          '從實際生活或幾何情境出發，拋出思考痛點。',
          '觀察已知工具的局限性，引導對新概念的渴望。'
        ],
        visual: (h) => {
          h.innerHTML = svg('0 0 440 280', `
            ${BOX(30, 25, 380, 230, { fill: '#f8fafc', stroke: C })}
            ${TX(220, 135, '💡 生活 / 物理 / 幾何情境情境圖', { fs: 17, c: C, anchor: 'middle' })}
            ${TX(220, 168, '提出核心矛盾：特定瞬間的狀態如何量化？', { fs: 13.5, c: '#64748b', anchor: 'middle', fw: 600 })}
          `);
        },
        caption: '請思考：現有工具是否足以精確刻畫這一動態變化？'
      },'''

SLIDE_EXPLORE = '''      {
        sec: '%(sec)s', secName: '%(secname)s',
        type: 'explore',
        title: '動態探索：觀察趨勢，形成猜想',
        inquiry: '請拖動下方滑桿調整參數，仔細觀察右側圖形與數值的逼近變化！',
        points: [
          '動態觀察：當自變量逐漸靠近目標值時，圖形呈現何種規律？',
          '大膽猜想：臨界極限狀態下的數值特徵是什麼？'
        ],
        visual: (h) => {
          h.innerHTML = `<div style="width:100%%"><div id="fig"></div>
            <div class="ictrl"><label>參數 t ＝ <span class="ival" id="tv">1.0</span></label>
            <input type="range" id="ts" min="0.1" max="2.0" step="0.05" value="1.0"></div></div>`;
          const draw = () => {
            const t = +h.querySelector('#ts').value;
            h.querySelector('#tv').textContent = t.toFixed(2);
            const P = SV.plane({ x0: 45, y0: 25, w: 350, h: 220, xmin: -3, xmax: 3, ymin: -2, ymax: 5 });
            const curve = SV.func(P, x => 0.5 * x * x + 1, null, { color: C });
            const pDot = SV.dot(P.X(t), P.Y(0.5 * t * t + 1), RED, 5);
            h.querySelector('#fig').innerHTML = svg('0 0 440 280', P.defs + P.svg + curve + pDot);
          };
          h.querySelector('#ts').oninput = draw; draw();
        },
        caption: '透過滑桿手動逼近，體驗動態到靜態、有限到無限的轉化。'
      },'''

SLIDE_CONCEPT = '''      {
        sec: '%(sec)s', secName: '%(secname)s',
        type: 'concept',
        title: '新知概念：形式化定義與本質剖析',
        formula: { label: '核心定義', tex: 'f\\\'(x_0) = \\\\lim_{\\\\Delta x \\\\to 0} \\\\frac{f(x_0+\\\\Delta x)-f(x_0)}{\\\\Delta x}' },
        points: [
          '<b>實質意涵</b>：增量之比在極限狀態下的確定常數。',
          '<b>符號記法</b>：\\(f\\\'(x_0)\\) 或 \\(\\left.\\\\frac{\\\\mathrm{d}y}{\\\\mathrm{d}x}\\\\right|_{x=x_0}\\)。',
          '<b>幾何直觀</b>：切線的斜率反映曲線在該點的傾斜程度。'
        ],
        visual: (h) => {
          h.innerHTML = SV.fbox([
            { label: '符號定義', tex: 'y\\\' = f\\\'(x)', color: C, fill: '#f0fdf4', border: '#86efac', size: 20 },
            { label: '關鍵特徵', tex: '\\\\Delta x \\\\to 0 \\\\implies \\\\text{割線} \\\\to \\\\text{切線}', color: RED, size: 16, note: '極限存在時方可稱為可導' }
          ]);
        },
        caption: '牢記：導數本質上是一個特殊的「極限值」。'
      },'''

SLIDE_PITFALL = '''      {
        sec: '%(sec)s', secName: '%(secname)s',
        type: 'pitfall',
        title: '概念辨析：反例剖析與易混點澄清',
        points: [
          '<b>常見迷思</b>：連續的曲線在每一點都一定可以作切線嗎？',
          '<b>反例證明</b>：尖點（如 \\(y=|x|\\) 在原點）左右斜率不一致，不可導！',
          '<b>結論辨析</b>：可導必連續，但連續不一定可導。'
        ],
        visual: (h) => {
          SV.quiz(h, {
            q: '若函數 \\(f(x)\\) 在 \\(x=x_0\\) 處連續，則該點是否必然可導？',
            options: ['A. 必然可導', 'B. 不一定可導（可能存在尖點）', 'C. 必然不可導'],
            ans: 1,
            explain: '正確！典型反例為 \\(f(x)=|x|\\)，在 \\(x=0\\) 連續但左右極限不同，不可導。'
          });
        },
        caption: '概念辨析是數學思維嚴謹性的試金石。'
      },'''

SLIDE_EXAMPLE = '''      {
        sec: '%(sec)s', secName: '%(secname)s',
        type: 'example',
        title: '典例精析：解題通法與思維階梯',
        example: {
          q: '求曲線 \\(f(x)=x^2+1\\) 在點 \\(P(1,2)\\) 處的切線方程。',
          thinking: '先由定義或求導公式求得切線斜率 \\(k=f\\\'(1)\\)，再由點斜式寫出直線方程。',
          hints: [
            '第一步：計算差商 \\(\\frac{f(1+\\\\Delta x)-f(1)}{\\\\Delta x}\\)',
            '第二步：令 \\(\\Delta x \\\\to 0\\) 求得斜率 \\(k\\)'
          ],
          steps: [
            '求導數：\\(f\\\'(x) = 2x \\\\implies k = f\\\'(1) = 2\\)',
            '代入點斜式：\\(y - 2 = 2(x - 1)\\)',
            '整理得一般式：\\(2x - y = 0\\)'
          ],
          ans: '\\(2x - y = 0\\)',
          variant: {
            q: '【隨堂變式】求同一曲線在 \\(x=-1\\) 處的切線方程。',
            ans: '\\(2x + y + 1 = 0\\)'
          }
        },
        points: [
          '<b>通性通法</b>：先求斜率 \\(k=f\\\'(x_0)\\)，再套點斜式。',
          '<b>審題關鍵</b>：分清「在某點的切線」與「過某點的切線」。'
        ],
        visual: (h) => {
          const P = SV.plane({ x0: 45, y0: 25, w: 350, h: 230, xmin: -2, xmax: 3, ymin: -1, ymax: 6 });
          const curve = SV.func(P, x => x * x + 1, null, { color: C });
          const tan = SV.tangent(P, x => x * x + 1, x => 2 * x, 1, { color: GRN, label: '切線: 2x-y=0' });
          h.innerHTML = svg('0 0 440 280', P.defs + P.svg + curve + tan.svg);
        },
        caption: '圖中綠色直線即為切點處的切線。'
      },'''

SLIDE_PRACTICE = '''      {
        sec: '%(sec)s', secName: '%(secname)s',
        type: 'practice',
        title: '課堂練習：知識遷移與即堂檢測',
        points: [
          '自主獨立完成，檢驗新課知識掌握深度。',
          '體會從具體計算上升到規律總結的過程。'
        ],
        visual: (h) => {
          SV.quiz(h, {
            q: '若曲線 \\(y=x^3\\) 在點 \\(P\\) 處的切線斜率為 \\(3\\)，則點 \\(P\\) 的坐標為？',
            options: ['A. (1, 1)', 'B. (-1, -1)', 'C. (1, 1) 或 (-1, -1)', 'D. (0, 0)'],
            ans: 2,
            explain: '求導得 \\(y\\\'=3x^2=3 \\\\implies x=\\\\pm 1\\)，代入原曲線得 \\(P(1,1)\\) 或 \\((-1,-1)\\)。'
          });
        },
        caption: '完成作答後點擊選項即可立即查看解析。'
      },'''

def parse_args():
    p = argparse.ArgumentParser(description='產生一份新的新授課互動簡報骨架。')
    p.add_argument('--out', required=True, help='輸出資料夾路徑')
    p.add_argument('--title', required=True, help='簡報完整標題（HTML <title>）')
    p.add_argument('--eyebrow', default='高中數學新授課', help='封面小字眉標')
    p.add_argument('--cover-title', required=True, help='封面主標題')
    p.add_argument('--sub', default='', help='封面副標題')
    p.add_argument('--home', default='新課首頁', help='頂部列「回封面」按鈕文字')
    p.add_argument('--start-btn', default='開始探索 →', help='封面開始按鈕文字')
    p.add_argument('--chapters', nargs='+', required=True,
                   help='章節清單，每項格式：章名:色碼:節1,節2（色碼可空）')
    return p.parse_args()

def main():
    args = parse_args()
    out = os.path.abspath(args.out)
    os.makedirs(out, exist_ok=True)

    # 複製資產
    for f in ('style.css', 'engine.js', 'svg.js'):
        shutil.copy2(os.path.join(ASSETS, f), os.path.join(out, f))

    today = datetime.date.today().strftime('%Y%m%d')
    ch_scripts = []
    total_slides = 0

    for ci, chap_raw in enumerate(args.chapters, 1):
        parts = chap_raw.split(':')
        title = parts[0].strip()
        color = parts[1].strip() if len(parts) > 1 and parts[1].strip() else PALETTE[(ci - 1) % len(PALETTE)]
        secs_str = parts[2].strip() if len(parts) > 2 else ''
        secs = [s.strip() for s in secs_str.split(',') if s.strip()] or [f'{ci}-1 第一節']

        slides_code = []
        for sec in secs:
            sp = sec.split(' ', 1)
            secnum = sp[0]
            secname = sp[1] if len(sp) > 1 else ''
            ctx = {'sec': secnum, 'secname': secname}

            # 產生新課 6 部曲骨架
            slides_code.append(SLIDE_HOOK % ctx)
            slides_code.append(SLIDE_EXPLORE % ctx)
            slides_code.append(SLIDE_CONCEPT % ctx)
            slides_code.append(SLIDE_PITFALL % ctx)
            slides_code.append(SLIDE_EXAMPLE % ctx)
            slides_code.append(SLIDE_PRACTICE % ctx)
            total_slides += 6

        ch_code = CH_TEMPLATE % {
            'ch': ci,
            'title': title,
            'color': color,
            'seclist': '、'.join(secs),
            'sections': str(secs),
            'slides': '\n'.join(slides_code)
        }

        ch_file = f'ch{ci}.js'
        with open(os.path.join(out, ch_file), 'w', encoding='utf-8') as f:
            f.write(ch_code)

        ch_scripts.append(f'  <script src="{ch_file}?v={today}"></script>')

    # 填 index.html
    with open(os.path.join(ASSETS, 'index.template.html'), 'r', encoding='utf-8') as f:
        tpl = f.read()

    rendered = tpl \
        .replace('{{TITLE}}', args.title) \
        .replace('{{DESCRIPTION}}', f'{args.title} — 高中數學新課互動探究簡報') \
        .replace('{{EYEBROW}}', args.eyebrow) \
        .replace('{{COVER_TITLE}}', args.cover_title) \
        .replace('{{COVER_SUB}}', args.sub) \
        .replace('{{HOME_LABEL}}', args.home) \
        .replace('{{START_BTN}}', args.start_btn) \
        .replace('{{VERSION}}', today) \
        .replace('{{CHAPTER_SCRIPTS}}', '\n'.join(ch_scripts))

    with open(os.path.join(out, 'index.html'), 'w', encoding='utf-8') as f:
        f.write(rendered)

    print(f"✅ 已成功建立新授課互動簡報：{out}")
    print(f"   共 {len(args.chapters)} 章、{total_slides} 張投影片骨架")
    print(f"   包含：情境引入、動態探索、核心概念、反例辨析、階梯典例、隨堂練習")
    print(f"   版本號：?v={today}")
    print(f"\n下一步：")
    print(f"  1. 編輯各章 chN.js 填入課本實際探究函數與例題")
    print(f"  2. node scripts/verify_lesson_deck.js {os.path.basename(out)}")
    print(f"  3. python -m http.server 8890 --directory {os.path.basename(out)}")

if __name__ == '__main__':
    main()
