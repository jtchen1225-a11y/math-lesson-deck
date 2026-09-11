/* ============ 第 2 單元　10.2 複數的運算與代數性質 ============
   教材來源：普通高中教科書 數學(B版) 必修第四冊 第十章
   ============================================================ */
window.DECK = window.DECK || [];
(function () {
  const C = '#059669'; // 主題色：祖母綠
  const RED = '#e11d48', GRN = '#059669', BLU = '#2563eb', VIO = '#7c3aed', AMB = '#d97706';

  function svg(vb, inner) {
    return `<div style="width:100%;text-align:center"><svg viewBox="${vb}" style="max-width:100%">${inner}</svg></div>`;
  }

  window.DECK.push({
    ch: 2,
    title: '複數的運算與代數性質',
    color: C,
    sections: ['10.2.1 複數的加法與減法', '10.2.2 複數的乘法與除法'],
    slides: [
      /* ---------- 10.2.1 複數的加法與減法 ---------- */
      {
        sec: '10.2.1', secName: '複數的加法與減法',
        type: 'hook',
        title: '虛數運算探索 — 實數運算律是否依然保持？',
        points: [
          '數系擴充的首要準則是：原有運算律必須全部保持。',
          '複數相加：實部與虛部分別相加即可。',
          '乘法分配律：\\((1+i)^2 = 1 + 2i + i^2 = 2i\\)。'
        ],
        visual: (h) => {
          h.innerHTML = SV.fbox([
            { label: '加法結合律與交換律', tex: 'z_1 + z_2 = z_2 + z_1', color: C, fill: '#f0fdf4', size: 16, note: '實部與虛部獨立滿足加法交換律' },
            { label: '乘法分配律驗證', tex: '(a+bi)(c+di) = ac + adi + bci + bdi^2', color: BLU, fill: '#eff6ff', size: 15, note: '關鍵代換：i² ＝ -1' },
            { label: '代數化簡結果', tex: '= (ac - bd) + (ad + bc)i', color: AMB, size: 16, note: '依然是一個形式嚴整的複數' }
          ]);
        },
        caption: '虛數的四則運算全面繼承了實數的交換律、結合律與分配律。'
      },
      {
        sec: '10.2.1', secName: '複數的加法與減法',
        type: 'explore',
        title: '動態向量合成 — 複數加減法的幾何意義',
        inquiry: '拖動滑桿調節 z₁ 與 z₂，觀察平行四邊形法則與兩點間距離！',
        points: [
          '加法 \\(z_1+z_2\\) 對應向量加法的<b>平行四邊形法則</b>。',
          '減法 \\(z_1-z_2\\) 對應從 \\(Z_2\\) 指向 \\(Z_1\\) 的向量。',
          '模長 \\(|z_1 - z_2|\\) 即為複平面上兩點之間的<b>歐氏距離</b>。'
        ],
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>z₁ 橫坐標 ＝ <span class="ival" id="x1v">2.0</span>　z₂ 橫坐標 ＝ <span class="ival" id="x2v">-1.0</span>　距離 |z₁-z₂| ＝ <span class="ival" id="dv">4.24</span></label>
            <div style="display:flex;gap:12px;margin-top:4px">
              <input type="range" id="x1s" min="-2" max="3" step="0.5" value="2" style="flex:1">
              <input type="range" id="x2s" min="-3" max="2" step="0.5" value="-1" style="flex:1">
            </div></div></div>`;
          const draw = () => {
            const x1 = +h.querySelector('#x1s').value, y1 = 2;
            const x2 = +h.querySelector('#x2s').value, y2 = -1;
            const sx = x1 + x2, sy = y1 + y2;
            const dist = Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
            h.querySelector('#x1v').textContent = x1.toFixed(1);
            h.querySelector('#x2v').textContent = x2.toFixed(1);
            h.querySelector('#dv').textContent = dist.toFixed(2);

            const P = SV.complexPlane({ x0: 50, y0: 25, w: 340, h: 215, xmin: -4, xmax: 4, ymin: -3, ymax: 4, step: 1 });
            const v1 = SV.vector(P, 0, 0, x1, y1, BLU, 'z₁', { lx: 8, ly: -6 });
            const v2 = SV.vector(P, 0, 0, x2, y2, AMB, 'z₂', { lx: 8, ly: 12 });
            const vsum = SV.vector(P, 0, 0, sx, sy, GRN, 'z₁+z₂', { lx: 10, ly: -4 });
            const p1 = SV.seg(P.X(x1), P.Y(y1), P.X(sx), P.Y(sy), '#94a3b8', 1.5, '3 3');
            const p2 = SV.seg(P.X(x2), P.Y(y2), P.X(sx), P.Y(sy), '#94a3b8', 1.5, '3 3');
            const diffLine = SV.seg(P.X(x2), P.Y(y2), P.X(x1), P.Y(y1), RED, 2.2, '4 3');
            h.querySelector('#fig').innerHTML = svg('0 0 440 275', P.defs + P.svg + p1 + p2 + diffLine + v1 + v2 + vsum);
          };
          h.querySelector('#x1s').oninput = draw;
          h.querySelector('#x2s').oninput = draw;
          draw();
        },
        caption: '綠色箭頭為和向量，紅色虛線連線長度即兩點距離 |z₁ - z₂|。'
      },
      /* ---------- 10.2.2 複數的乘法與除法 ---------- */
      {
        sec: '10.2.2', secName: '複數的乘法與除法',
        type: 'concept',
        title: '複數乘除法則與二次方程求根',
        formula: { label: '除法分母實數化', tex: '\\frac{a+bi}{c+di} = \\frac{(a+bi)(c-di)}{c^2+d^2} = \\frac{ac+bd}{c^2+d^2} + \\frac{bc-ad}{c^2+d^2}i' },
        points: [
          '<b>乘法法則</b>：按多項式乘法展開並代入 \\(i^2=-1\\)。',
          '重要恆等式：\\(z \\cdot \\bar{z} = a^2+b^2 = |z|^2\\) 為非負實數。',
          '<b>除法技巧</b>：分子分母同乘分母的<b>共軛複數</b>。',
          '實系數方程 \\(\\Delta < 0\\) 時，兩根為一對<b>共軛虛根</b>。'
        ],
        visual: (h) => {
          h.innerHTML = SV.fbox([
            { label: '共軛相乘模平方', tex: 'z \\cdot \\bar{z} = (a+bi)(a-bi) = a^2 + b^2 = |z|^2', color: C, fill: '#f0fdf4', size: 15 },
            { label: '分母實數化法寶', tex: '\\frac{1}{c+di} = \\frac{c-di}{c^2+d^2}', color: BLU, fill: '#eff6ff', size: 16 },
            { label: '實系數二次方程共軛虛根 (Δ < 0)', tex: 'x = \\frac{-b \\pm i\\sqrt{4ac-b^2}}{2a}', color: RED, size: 16, note: '虛根成對出現且互為共軛' }
          ]);
        },
        caption: '共軛複數是分母實數化與二次方程求根的橋樑。'
      },
      {
        sec: '10.2.2', secName: '複數的乘法與除法',
        type: 'pitfall',
        title: '易混辨析 — 虛數冪的週期性與根號運算陷阱',
        points: [
          '虛數單位冪呈 4 步週期：\\(i^1=i, i^2=-1, i^3=-i, i^4=1\\)。',
          '連續四項之和恆為零：\\(i^n + i^{n+1} + i^{n+2} + i^{n+3} = 0\\)。',
          '<b>嚴禁直接套用</b>：負數開方時 \\(\\sqrt{a}\\sqrt{b} \\neq \\sqrt{ab}\\)！'
        ],
        quiz: {
          q: '計算式子 √(-2) × √(-3) 的正確數值為？',
          options: [
            'A. √6',
            'B. -√6',
            'C. √6 i',
            'D. -√6 i'
          ],
          ans: 1,
          explain: '必須先化為虛數：√(-2) = √2 i，√(-3) = √3 i，相乘得 (√2 i)(√3 i) = √6 i² = -√6。若直接相乘會得出 √6 的典型錯誤！故選B。'
        },
        visual: (h) => {
          SV.quiz(h, {
            q: '計算式子 √(-2) × √(-3) 的正確數值為？',
            options: [
              'A. √6',
              'B. -√6',
              'C. √6 i',
              'D. -√6 i'
            ],
            ans: 1,
            explain: '必須先化為虛數：√(-2) = √2 i，√(-3) = √3 i，相乘得 (√2 i)(√3 i) = √6 i² = -√6。若直接相乘會得出 √6 的典型錯誤！故選B。'
          });
        },
        caption: '只有在非負實數範圍內，二次根號乘法法則方能自由拆合。'
      },
      {
        sec: '10.2.2', secName: '複數的乘法與除法',
        type: 'example',
        title: '典例剖析 — 複數除法化簡與方程求解',
        example: {
          q: '計算複數 \\(z = \\frac{1+3i}{1-i}\\) 的代數形式，並在複數範圍內解方程 \\(x^2 - 2x + 5 = 0\\)。',
          thinking: '除法分子分母同乘分母共軛 1+i；二次方程用配方法或求根公式。',
          hints: [
            '第一步：分母實數化，\\((1-i)(1+i) = 1^2 - i^2 = 2\\)',
            '第二步：分子展開，\\((1+3i)(1+i) = 1 + 4i + 3i^2 = -2 + 4i\\)',
            '第三步：配方解方程，\\((x-1)^2 = -4 = (2i)^2\\)'
          ],
          steps: [
            '化簡除法：\\(z = \\frac{(1+3i)(1+i)}{(1-i)(1+i)} = \\frac{-2+4i}{2} = -1 + 2i\\)',
            '解二次方程：\\((x-1)^2 = -4\\)',
            '兩側開方得：\\(x - 1 = \\pm 2i\\)',
            '求得兩根：\\(x = 1 + 2i\\) 或 \\(x = 1 - 2i\\)'
          ],
          ans: '\\(z = -1+2i\\)；方程解集為 \\(\\{1+2i, 1-2i\\}\\)',
          variant: {
            q: '【即堂變式】計算複數 \\(\\frac{2+i}{i}\\) 的代數形式。',
            ans: '分子分母同乘 \\(-i\\) 得 \\(\\frac{-2i-i^2}{1} = 1 - 2i\\)。'
          }
        },
        visual: (h) => {
          const P = SV.complexPlane({ x0: 50, y0: 25, w: 340, h: 215, xmin: -2, xmax: 4, ymin: -3, ymax: 3, step: 1 });
          const r1 = SV.dot(P.X(1), P.Y(2), RED, 5);
          const r2 = SV.dot(P.X(1), P.Y(-2), RED, 5);
          const v1 = SV.vlabel(P.X(1) + 10, P.Y(2) + 4, 'x₁ = 1 + 2i', RED, 13);
          const v2 = SV.vlabel(P.X(1) + 10, P.Y(-2) + 4, 'x₂ = 1 - 2i', RED, 13);
          const symm = SV.seg(P.X(1), P.Y(2), P.X(1), P.Y(-2), '#94a3b8', 1.6, '3 3');
          h.innerHTML = svg('0 0 440 270', P.defs + P.svg + symm + r1 + r2 + v1 + v2);
        },
        caption: '實系數二次方程的兩虛根互為共軛複數，幾何上關於實軸對稱。'
      },
      {
        sec: '10.2.2', secName: '複數的乘法與除法',
        type: 'practice',
        title: '隨堂檢測 — 複數模的性質與四則綜合運算',
        points: [
          '積的模等於模的積：\\(|z_1 z_2| = |z_1| \\cdot |z_2|\\)。',
          '商的模等於模的商：\\(|\\frac{z_1}{z_2}| = \\frac{|z_1|}{|z_2|}\\)。',
          '求模問題往往<b>無須化簡除法</b>，直接運用模性質最快捷！'
        ],
        quiz: {
          q: '設複數 z = (3+4i) / (1+√3 i)，則模長 |z| 的值為？',
          options: [
            'A. 5 / 2',
            'B. 5',
            'C. 7 / 4',
            'D. 25 / 4'
          ],
          ans: 0,
          explain: '利用商的模性質：|z| = |3+4i| / |1+√3 i| = √(3²+4²) / √(1²+(√3)²) = 5 / 2。選A。'
        },
        visual: (h) => {
          SV.quiz(h, {
            q: '設複數 z = (3+4i) / (1+√3 i)，則模長 |z| 的值為？',
            options: [
              'A. 5 / 2',
              'B. 5',
              'C. 7 / 4',
              'D. 25 / 4'
            ],
            ans: 0,
            explain: '利用商的模性質：|z| = |3+4i| / |1+√3 i| = √(3²+4²) / √(1²+(√3)²) = 5 / 2。選A。'
          });
        },
        caption: '靈活運用模的積商性質，免去展開分母實數化的繁複計算。'
      }
    ]
  });
})();
