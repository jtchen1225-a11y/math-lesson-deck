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
        title: '虛數乘法運算律動態檢驗儀',
        inquiry: '拖動實數 k，動態展開 (k+i)² 檢驗分配律與平方公式在虛數中是否成立！',
        points: [
          '數系擴充的首要準則是：原有乘法運算律必須全部保持。',
          '由乘法分配律展開：\\((k+i)^2 = k^2 + 2ki + i^2 = (k^2-1) + 2ki\\)。',
          '實部為 \\(k^2-1\\)，虛部為 \\(2k\\)，依然為嚴整複數。'
        ],
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>實數 k ＝ <span class="ival" id="kv">1.0</span>　(k+i)² ＝ <span class="ival" id="sqv">0.00 + 2.00i</span></label>
            <input type="range" id="ks" min="-2" max="2" step="0.5" value="1"></div></div>`;
          const draw = () => {
            const k = +h.querySelector('#ks').value;
            const re = k * k - 1;
            const im = 2 * k;
            h.querySelector('#kv').textContent = k.toFixed(1);
            h.querySelector('#sqv').textContent = `${re >= 0 ? re.toFixed(2) : re.toFixed(2)} ${im >= 0 ? '+' : ''}${im.toFixed(2)}i`;

            const P = SV.complexPlane({ x0: 50, y0: 25, w: 340, h: 215, xmin: -3, xmax: 4, ymin: -4, ymax: 4, step: 1 });
            const vOrig = SV.vector(P, 0, 0, k, 1, BLU, `k+i`, { fs: 12, ly: -6 });
            const vSq = SV.vector(P, 0, 0, re, im, RED, `(k+i)²`, { fs: 12, ly: 12 });
            const dot = SV.dot(P.X(re), P.Y(im), RED, 4.5);
            h.querySelector('#fig').innerHTML = svg('0 0 440 270', P.defs + P.svg + vOrig + vSq + dot);
          };
          h.querySelector('#ks').oninput = draw;
          draw();
        },
        caption: '藍色為初始複數 k+i，紅色為其平方展開後在複平面上的動態位置。'
      },
      {
        sec: '10.2.1', secName: '複數的加法與減法',
        type: 'explore',
        title: '複數加減向量合成與距離探究儀',
        inquiry: '拖動 z₁ 與 z₂，切換加法平行四邊形法則與減法兩點歐氏距離！',
        points: [
          '加法 \\(z_1+z_2\\) 對應向量加法的<b>平行四邊形法則</b>。',
          '減法 \\(z_1-z_2\\) 對應從 \\(Z_2\\) 指向 \\(Z_1\\) 的向量。',
          '模長 \\(|z_1 - z_2|\\) 即為複平面上兩點之間的<b>歐氏距離</b>。'
        ],
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl" style="gap:6px 14px">
              <label>z₁ 橫坐標 ＝ <span class="ival" id="x1v">2.0</span>　z₂ 橫坐標 ＝ <span class="ival" id="x2v">-1.0</span>　距離 |z₁-z₂| ＝ <span class="ival" id="dv">4.24</span></label>
              <div style="display:flex;gap:8px;width:100%">
                <input type="range" id="x1s" min="-2" max="3" step="0.5" value="2" style="flex:1">
                <input type="range" id="x2s" min="-3" max="2" step="0.5" value="-1" style="flex:1">
              </div>
              <div style="display:flex;gap:8px;margin-top:2px">
                <button class="ibtn" id="opAdd" style="font-size:12px;padding:3px 12px">加法平行四邊形</button>
                <button class="ibtn" id="opSub" style="font-size:12px;padding:3px 12px">減法兩點距離</button>
              </div>
            </div></div>`;
          let opMode = 'add';
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
            let layer = '';

            if (opMode === 'add') {
              const vsum = SV.vector(P, 0, 0, sx, sy, GRN, 'z₁+z₂', { lx: 10, ly: -4 });
              const p1 = SV.seg(P.X(x1), P.Y(y1), P.X(sx), P.Y(sy), '#94a3b8', 1.5, '3 3');
              const p2 = SV.seg(P.X(x2), P.Y(y2), P.X(sx), P.Y(sy), '#94a3b8', 1.5, '3 3');
              layer = p1 + p2 + vsum;
            } else {
              const diffLine = SV.seg(P.X(x2), P.Y(y2), P.X(x1), P.Y(y1), RED, 2.4, '4 3');
              const vdiff = SV.vector(P, 0, 0, x1 - x2, y1 - y2, RED, 'z₁-z₂', { lx: 10, ly: -4 });
              const distNote = SV.vlabel((P.X(x1) + P.X(x2)) / 2 + 10, (P.Y(y1) + P.Y(y2)) / 2, `d=${dist.toFixed(2)}`, RED, 13);
              layer = diffLine + vdiff + distNote;
            }

            h.querySelector('#fig').innerHTML = svg('0 0 440 275', P.defs + P.svg + layer + v1 + v2);
          };

          h.querySelector('#x1s').oninput = draw;
          h.querySelector('#x2s').oninput = draw;
          h.querySelector('#opAdd').onclick = () => { opMode = 'add'; draw(); };
          h.querySelector('#opSub').onclick = () => { opMode = 'sub'; draw(); };
          draw();
        },
        caption: '可切換平行四邊形法則展示向量相加，或連線展示兩點距離 |z₁ - z₂|。'
      },
      /* ---------- 10.2.2 複數的乘法與除法 ---------- */
      {
        sec: '10.2.2', secName: '複數的乘法與除法',
        type: 'concept',
        title: '二次方程共軛虛根動態求根儀',
        inquiry: '調節常數 q，觀察方程 x² - 2x + q = 0 的判別式 Δ 與共軛虛根分裂！',
        formula: { label: '除法分母實數化', tex: '\\frac{a+bi}{c+di} = \\frac{(a+bi)(c-di)}{c^2+d^2} = \\frac{ac+bd}{c^2+d^2} + \\frac{bc-ad}{c^2+d^2}i' },
        points: [
          '<b>乘法法則</b>：按多項式乘法展開並代入 \\(i^2=-1\\)。',
          '重要恆等式：\\(z \\cdot \\bar{z} = a^2+b^2 = |z|^2\\) 為非負實數。',
          '<b>除法技巧</b>：分子分母同乘分母的<b>共軛複數</b>。',
          '實系數方程 \\(\\Delta < 0\\) 時，兩根為一對<b>共軛虛根</b>。'
        ],
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>常數 q ＝ <span class="ival" id="qv">5.0</span>　判別式 Δ ＝ <span class="ival" id="deltav">-16.0</span></label>
            <input type="range" id="qs" min="-1" max="5" step="1" value="5"></div></div>`;
          const draw = () => {
            const q = +h.querySelector('#qs').value;
            const delta = 4 - 4 * q;
            h.querySelector('#qv').textContent = q.toFixed(1);
            h.querySelector('#deltav').textContent = delta.toFixed(1);

            const P = SV.complexPlane({ x0: 50, y0: 25, w: 340, h: 215, xmin: -2, xmax: 4, ymin: -3, ymax: 3, step: 1 });
            let rootsSvg = '';
            if (delta > 0) {
              const r1 = 1 + Math.sqrt(delta) / 2;
              const r2 = 1 - Math.sqrt(delta) / 2;
              rootsSvg += SV.dot(P.X(r1), P.Y(0), GRN, 5) + SV.dot(P.X(r2), P.Y(0), GRN, 5);
              rootsSvg += SV.vlabel(P.X(r1), P.Y(0) - 8, `x₁=${r1.toFixed(1)}`, GRN, 12, { anchor: 'middle' });
              rootsSvg += SV.vlabel(P.X(r2), P.Y(0) - 8, `x₂=${r2.toFixed(1)}`, GRN, 12, { anchor: 'middle' });
            } else if (delta === 0) {
              rootsSvg += SV.dot(P.X(1), P.Y(0), AMB, 5);
              rootsSvg += SV.vlabel(P.X(1), P.Y(0) - 8, '重根 x=1', AMB, 12, { anchor: 'middle' });
            } else {
              const im = Math.sqrt(-delta) / 2;
              rootsSvg += SV.dot(P.X(1), P.Y(im), RED, 5) + SV.dot(P.X(1), P.Y(-im), RED, 5);
              rootsSvg += SV.seg(P.X(1), P.Y(im), P.X(1), P.Y(-im), '#94a3b8', 1.6, '3 3');
              rootsSvg += SV.vlabel(P.X(1) + 8, P.Y(im) + 4, `1+${im.toFixed(1)}i`, RED, 12);
              rootsSvg += SV.vlabel(P.X(1) + 8, P.Y(-im) + 4, `1-${im.toFixed(1)}i`, RED, 12);
            }
            h.querySelector('#fig').innerHTML = svg('0 0 440 270', P.defs + P.svg + rootsSvg);
          };
          h.querySelector('#qs').oninput = draw;
          draw();
        },
        caption: '當 Δ < 0 時，兩實根垂直分裂脫離實軸，在複平面形成共軛虛根對。'
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
        title: '典例剖析 — 複數除法化簡與方程求解儀',
        inquiry: '拖動滑桿調節除數虛部，觀察分母乘以共軛複數實數化的動態過程！',
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
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>分母共軛乘積：|分母|² ＝ <span class="ival" id="denv">2.0</span>　商向量 z ＝ <span class="ival" id="ansv">-1.0 + 2.0i</span></label>
            <input type="range" id="ds" min="0.5" max="2.5" step="0.5" value="1"></div></div>`;
          const draw = () => {
            const d = +h.querySelector('#ds').value;
            const den = 1 + d * d;
            const re = (1 - 3 * d) / den;
            const im = (3 + d) / den;
            h.querySelector('#denv').textContent = den.toFixed(2);
            h.querySelector('#ansv').textContent = `${re.toFixed(1)} + ${im.toFixed(1)}i`;

            const P = SV.complexPlane({ x0: 50, y0: 25, w: 340, h: 215, xmin: -3, xmax: 3, ymin: -2, ymax: 4, step: 1 });
            const vNum = SV.vector(P, 0, 0, 1, 3, BLU, '分子 1+3i', { fs: 11, ly: -6 });
            const vDen = SV.vector(P, 0, 0, 1, -d, AMB, `分母 1-${d}i`, { fs: 11, ly: 12 });
            const vRes = SV.vector(P, 0, 0, re, im, RED, `商 z`, { fs: 12, ly: -8 });
            h.querySelector('#fig').innerHTML = svg('0 0 440 270', P.defs + P.svg + vNum + vDen + vRes);
          };
          h.querySelector('#ds').oninput = draw;
          draw();
        },
        caption: '動態展示除數在分母實數化下的幾何旋轉與模長壓縮效果。'
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
