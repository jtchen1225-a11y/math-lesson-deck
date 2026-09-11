/* ============ 第 1 單元　10.1 複數的概念與幾何意義 ============
   教材來源：普通高中教科書 數學(B版) 必修第四冊 第十章
   ============================================================ */
window.DECK = window.DECK || [];
(function () {
  const C = '#2563eb'; // 主題色：科技藍
  const RED = '#e11d48', GRN = '#059669', BLU = '#2563eb', VIO = '#7c3aed', AMB = '#d97706';

  function svg(vb, inner) {
    return `<div style="width:100%;text-align:center"><svg viewBox="${vb}" style="max-width:100%">${inner}</svg></div>`;
  }

  window.DECK.push({
    ch: 1,
    title: '複數的概念與幾何意義',
    color: C,
    sections: ['10.1.1 複數的概念', '10.1.2 複數的幾何意義'],
    slides: [
      /* ---------- 10.1.1 複數的概念 ---------- */
      {
        sec: '10.1.1', secName: '複數的概念',
        type: 'hook',
        title: '負數開方之謎 — 數系為何必須再次擴充？',
        points: [
          '實數範圍內，任何數的平方均為非負數。',
          '求解二次方程 \\(x^2=-1\\) 或卡爾丹公式遇到開負數平方根。',
          '為打破運算邊界，數學家大膽引入虛數單位 \\(i\\)。'
        ],
        visual: (h) => {
          const P = SV.plane({ x0: 45, y0: 25, w: 350, h: 215, xmin: -3, xmax: 3, ymin: -1, ymax: 5, step: 1 });
          const parabola = SV.func(P, x => x * x + 1, [-2.1, 2.1], { color: C, w: 2.8 });
          const vertex = SV.dot(P.X(0), P.Y(1), RED, 5);
          const lbl = SV.vlabel(P.X(0) + 12, P.Y(1) + 4, '頂點 (0,1)', RED, 13);
          const note = SV.vlabel(P.X(0), P.Y(-0.6), '曲線與 x 軸無交點 → 實數範圍無解', '#64748b', 12, { anchor: 'middle' });
          h.innerHTML = svg('0 0 440 270', P.defs + P.svg + parabola + vertex + lbl + note);
        },
        caption: '方程 x² + 1 = 0 在實數軸上無交點，呼喚全新數系誕生。'
      },
      {
        sec: '10.1.1', secName: '複數的概念',
        type: 'explore',
        title: '動態複平面 — 實部與虛部決定點與向量',
        inquiry: '拖動實部 a 與虛部 b 滑桿，觀察點 Z、向量與模長的動態變化！',
        points: [
          '複數 \\(z=a+bi\\) 與平面上的點 \\(Z(a,b)\\) 一一對應。',
          '複數 \\(z\\) 對應以原點為起點的向量 \\(\\vec{OZ}=(a,b)\\)。',
          '模長 \\(|z|=\\sqrt{a^2+b^2}\\) 即點 \\(Z\\) 到原點的距離。'
        ],
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>實部 a ＝ <span class="ival" id="av">2.0</span>　虛部 b ＝ <span class="ival" id="bv">2.0</span>　模長 |z| ＝ <span class="ival" id="mv">2.83</span></label>
            <div style="display:flex;gap:12px;margin-top:4px">
              <input type="range" id="as" min="-3" max="3" step="0.5" value="2" style="flex:1">
              <input type="range" id="bs" min="-3" max="3" step="0.5" value="2" style="flex:1">
            </div></div></div>`;
          const draw = () => {
            const a = +h.querySelector('#as').value;
            const b = +h.querySelector('#bs').value;
            const mod = Math.sqrt(a * a + b * b);
            h.querySelector('#av').textContent = a.toFixed(1);
            h.querySelector('#bv').textContent = b.toFixed(1);
            h.querySelector('#mv').textContent = mod.toFixed(2);

            const P = SV.complexPlane({ x0: 50, y0: 25, w: 340, h: 215, xmin: -4, xmax: 4, ymin: -4, ymax: 4, step: 1 });
            const zx = P.X(a), zy = P.Y(b), ox = P.X(0), oy = P.Y(0);
            const projX = SV.seg(zx, zy, zx, oy, '#94a3b8', 1.8, '4 3');
            const projY = SV.seg(zx, zy, ox, zy, '#94a3b8', 1.8, '4 3');
            const vec = SV.vector(P, 0, 0, a, b, C, `Z(${a}, ${b})`, { fs: 13 });
            const circle = `<circle cx="${ox}" cy="${oy}" r="${(mod * (340 / 8)).toFixed(1)}" fill="none" stroke="${AMB}" stroke-width="1.2" stroke-dasharray="3 3"/>`;
            h.querySelector('#fig').innerHTML = svg('0 0 440 275', P.defs + P.svg + circle + projX + projY + vec);
          };
          h.querySelector('#as').oninput = draw;
          h.querySelector('#bs').oninput = draw;
          draw();
        },
        caption: '虛軸代表虛部單位，琥珀色虛線圓代表相同模長的複數軌跡。'
      },
      {
        sec: '10.1.1', secName: '複數的概念',
        type: 'concept',
        title: '複數的形式化定義與數系結構',
        formula: { label: '複數代數形式', tex: 'z = a + bi \\quad (a, b \\in \\mathbb{R})' },
        points: [
          '\\(a\\) 為<b>實部</b> \\(\\mathrm{Re}\\)，\\(b\\) 為<b>虛部</b> \\(\\mathrm{Im}\\)。',
          '當 \\(b=0\\) 時 \\(z\\) 為實數；當 \\(b \\neq 0\\) 時 \\(z\\) 為虛數。',
          '當 \\(a=0\\) 且 \\(b \\neq 0\\) 時，\\(z\\) 稱為<b>純虛數</b>。',
          '共軛複數：\\(\\bar{z}=a-bi\\)，兩點關於實軸對稱。'
        ],
        visual: (h) => {
          h.innerHTML = SV.fbox([
            { label: '實數 (b = 0)', tex: 'z = a \\in \\mathbb{R}', color: GRN, fill: '#f0fdf4', size: 16, note: '實數集是複數集的真子集' },
            { label: '虛數 (b ≠ 0)', tex: 'z = a + bi \\quad (b \\neq 0)', color: C, fill: '#eff6ff', size: 16, note: '包含純虛數與非純虛數' },
            { label: '純虛數 (a = 0, b ≠ 0)', tex: 'z = bi \\quad (b \\neq 0)', color: VIO, fill: '#f5f3ff', size: 16, note: '點落在虛軸上且非原點' },
            { label: '共軛複數', tex: '\\bar{z} = a - bi \\implies |z| = |\\bar{z}|', color: AMB, size: 16, note: '實部相等、虛部互為相反數' }
          ]);
        },
        caption: '數系劃分結構清楚規範了實數、虛數與純虛數的充要條件。'
      },
      {
        sec: '10.1.1', secName: '複數的概念',
        type: 'pitfall',
        title: '概念辨析 — 複數能比大小嗎？純虛數陷阱',
        points: [
          '若兩複數不全是實數，<b>不能比較大小</b>（不可寫 \\(2+i > 1+i\\)）。',
          '虛數不能與 \\(0\\) 比大小，因此虛數<b>沒有正負之分</b>。',
          '「純虛數」的前提是：實部為 \\(0\\) <b>且</b>虛部不為 \\(0\\)！'
        ],
        quiz: {
          q: '下列關於複數的命題中，完全正確的是哪一項？',
          options: [
            'A. 若 z₁ = 3+2i, z₂ = 1+2i，則 z₁ > z₂',
            'B. 虛數單位 i 是一個大於 0 的正數',
            'C. 任意複數均由其唯一實部與虛部決定',
            'D. 實部為 0 的複數必定是純虛數'
          ],
          ans: 2,
          explain: '複數不可比較大小（A錯）；虛數無正負（B錯）；當實部虛部皆為0時是實數0而不是純虛數（D錯）。故選C。'
        },
        visual: (h) => {
          SV.quiz(h, {
            q: '下列關於複數的命題中，完全正確的是哪一項？',
            options: [
              'A. 若 z₁ = 3+2i, z₂ = 1+2i，則 z₁ > z₂',
              'B. 虛數單位 i 是一個大於 0 的正數',
              'C. 任意複數均由其唯一實部與虛部決定',
              'D. 實部為 0 的複數必定是純虛數'
            ],
            ans: 2,
            explain: '複數不可比較大小（A錯）；虛數無正負（B錯）；當實部虛部皆為0時是實數0而不是純虛數（D錯）。故選C。'
          });
        },
        caption: '虛數不能比大小是學習複數時最容易犯的直覺錯誤。'
      },
      /* ---------- 10.1.2 複數的幾何意義 ---------- */
      {
        sec: '10.1.2', secName: '複數的幾何意義',
        type: 'example',
        title: '典例剖析 — 參數討論求純虛數與模長',
        example: {
          q: '已知複數 \\(z = (m^2-1) + (m+1)i\\)（\\(m \\in \\mathbb{R}\\)），若 \\(z\\) 為純虛數，求實數 \\(m\\) 的值及模長 \\(|z|\\)。',
          thinking: '純虛數條件是「實部為 0 且虛部不為 0」，務必檢驗虛部非零！',
          hints: [
            '第一步：令實部 \\(m^2-1 = 0\\)，解得 \\(m=1\\) 或 \\(m=-1\\)',
            '第二步：檢驗虛部 \\(m+1 \\neq 0\\)，排除 \\(m=-1\\)',
            '第三步：將 \\(m=1\\) 代入計算模長 \\(|z|=|2i|\\)'
          ],
          steps: [
            '由實部為零：\\(m^2-1=0 \\implies m=1\\) 或 \\(m=-1\\)',
            '由虛部非零：\\(m+1 \\neq 0 \\implies m \\neq -1\\)',
            '綜合可得：\\(m = 1\\)',
            '此時 \\(z = 2i\\)，模長 \\(|z| = \\sqrt{0^2+2^2} = 2\\)'
          ],
          ans: '\\(m = 1\\)，模長 \\(|z| = 2\\)',
          variant: {
            q: '【即堂變式】若該複數 \\(z\\) 為實數，求實數 \\(m\\) 的值。',
            ans: '由虛部 \\(m+1=0\\) 得 \\(m=-1\\)（此時 \\(z=0\\) 為實數）。'
          }
        },
        visual: (h) => {
          const P = SV.complexPlane({ x0: 50, y0: 25, w: 340, h: 215, xmin: -3, xmax: 3, ymin: -1, ymax: 3, step: 1 });
          const dot = SV.dot(P.X(0), P.Y(2), RED, 5);
          const vec = SV.vector(P, 0, 0, 0, 2, C, 'Z(0,2)', { lx: 14, ly: 0 });
          const arc = `<circle cx="${P.X(0)}" cy="${P.Y(0)}" r="${(2 * (340 / 6)).toFixed(1)}" fill="none" stroke="${GRN}" stroke-width="1.8" stroke-dasharray="4 3"/>`;
          const note = SV.vlabel(P.X(1.5), P.Y(2.2), '軌跡 |z| = 2', GRN, 13);
          h.innerHTML = svg('0 0 440 270', P.defs + P.svg + arc + dot + vec + note);
        },
        caption: '純虛數 Z(0,2) 位於虛軸正半軸上，模長即為點到原點距離 2。'
      },
      {
        sec: '10.1.2', secName: '複數的幾何意義',
        type: 'practice',
        title: '隨堂檢測 — 複平面點的象限定位與共軛複數',
        points: [
          '點 \\(Z(a,b)\\) 的正負符號決定其在複平面所處象限。',
          '共軛複數 \\(\\bar{z} = a-bi\\) 關於實軸對稱。',
          '幾何軌跡：\\(|z|=r\\) 表示以原點為圓心、\\(r\\) 為半徑的圓。'
        ],
        quiz: {
          q: '已知複數 z = -3 + 4i，其共軛複數 z̄ 在複平面對應的點位於第幾象限？模長 |z| 為何？',
          options: [
            'A. 第二象限，模長為 5',
            'B. 第三象限，模長為 5',
            'C. 第三象限，模長為 7',
            'D. 第四象限，模長為 25'
          ],
          ans: 1,
          explain: '共軛複數為 z̄ = -3 - 4i，對應點 (-3, -4) 位於第三象限；模長 |z| = √((-3)²+4²) = 5。故選B。'
        },
        visual: (h) => {
          SV.quiz(h, {
            q: '已知複數 z = -3 + 4i，其共軛複數 z̄ 在複平面對應的點位於第幾象限？模長 |z| 為何？',
            options: [
              'A. 第二象限，模長為 5',
              'B. 第三象限，模長為 5',
              'C. 第三象限，模長為 7',
              'D. 第四象限，模長為 25'
            ],
            ans: 1,
            explain: '共軛複數為 z̄ = -3 - 4i，對應點 (-3, -4) 位於第三象限；模長 |z| = √((-3)²+4²) = 5。故選B。'
          });
        },
        caption: '掌握實軸對稱與模長距離定義，快速解讀複平面幾何位置。'
      }
    ]
  });
})();
