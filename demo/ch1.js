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
        title: '負數開方與數系擴充探究儀',
        inquiry: '拖動滑桿調節常數 c，觀察方程 x² + c = 0 的解由實根轉化為虛根！',
        points: [
          '實數範圍內，非負數平方為非負，負數無法開平方。',
          '當 \\(c \\le 0\\) 時，拋物線與 \\(x\\) 軸相交，具備實數根。',
          '當 \\(c > 0\\) 時，拋物線脫離實軸，在虛軸上誕生共軛虛根。'
        ],
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>常數 c ＝ <span class="ival" id="cv">1.0</span>　方程狀態：<span class="ival" id="st">虛軸共軛根 ±1.00i</span></label>
            <input type="range" id="cs" min="-3" max="3" step="0.5" value="1"></div></div>`;
          const draw = () => {
            const c = +h.querySelector('#cs').value;
            h.querySelector('#cv').textContent = c.toFixed(1);
            const stEl = h.querySelector('#st');
            const P = SV.plane({ x0: 45, y0: 25, w: 350, h: 215, xmin: -3, xmax: 3, ymin: -3, ymax: 5, step: 1, xLabel: 'x', yLabel: 'y' });
            const curve = SV.func(P, x => x * x + c, [-2.4, 2.4], { color: C, w: 2.6 });
            let extras = '';
            if (c < 0) {
              const r = Math.sqrt(-c);
              stEl.textContent = `實根 x = ±${r.toFixed(2)}`;
              extras += SV.dot(P.X(r), P.Y(0), GRN, 5) + SV.dot(P.X(-r), P.Y(0), GRN, 5);
              extras += SV.vlabel(P.X(r), P.Y(0) - 10, `+${r.toFixed(1)}`, GRN, 12, { anchor: 'middle' });
              extras += SV.vlabel(P.X(-r), P.Y(0) - 10, `-${r.toFixed(1)}`, GRN, 12, { anchor: 'middle' });
            } else if (c === 0) {
              stEl.textContent = '重根 x = 0';
              extras += SV.dot(P.X(0), P.Y(0), AMB, 5);
            } else {
              const ir = Math.sqrt(c);
              stEl.textContent = `虛根 x = ±${ir.toFixed(2)}i (虛軸)`;
              extras += SV.dot(P.X(0), P.Y(ir), RED, 5) + SV.dot(P.X(0), P.Y(-ir), RED, 5);
              extras += SV.vlabel(P.X(0) + 8, P.Y(ir) + 4, `+${ir.toFixed(1)}i`, RED, 12);
              extras += SV.vlabel(P.X(0) + 8, P.Y(-ir) + 4, `-${ir.toFixed(1)}i`, RED, 12);
              extras += SV.seg(P.X(0), P.Y(-ir), P.X(0), P.Y(ir), RED, 1.8, '3 3');
            }
            h.querySelector('#fig').innerHTML = svg('0 0 440 270', P.defs + P.svg + curve + extras);
          };
          h.querySelector('#cs').oninput = draw;
          draw();
        },
        caption: '紅色虛線點展示實數方程無解時，在複數域虛軸上自然顯現的共軛根。'
      },
      {
        sec: '10.1.1', secName: '複數的概念',
        type: 'explore',
        title: '複平面動態幾何與軌跡探究儀',
        inquiry: '拖動實部 a 與虛部 b，切換不同幾何視角探究點、向量與軌跡！',
        points: [
          '複數 \\(z=a+bi\\) 與點 \\(Z(a,b)\\) 及向量 \\(\\vec{OZ}\\) 一一對應。',
          '共軛複數 \\(\\bar{z}=a-bi\\) 與 \\(z\\) 永遠關於實軸對稱。',
          '方程 \\(|z|=r\\) 的幾何圖形是以原點為圓心、\\(r\\) 為半徑的圓。'
        ],
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl" style="gap:6px 14px">
              <label>實部 a ＝ <span class="ival" id="av">2.0</span>　虛部 b ＝ <span class="ival" id="bv">2.0</span>　模長 |z| ＝ <span class="ival" id="mv">2.83</span></label>
              <div style="display:flex;gap:8px;width:100%">
                <input type="range" id="as" min="-3" max="3" step="0.5" value="2" style="flex:1">
                <input type="range" id="bs" min="-3" max="3" step="0.5" value="2" style="flex:1">
              </div>
              <div style="display:flex;gap:6px;margin-top:2px">
                <button class="ibtn" id="mVec" style="font-size:11.5px;padding:3px 9px">點與向量</button>
                <button class="ibtn" id="mConj" style="font-size:11.5px;padding:3px 9px">共軛對稱</button>
                <button class="ibtn" id="mCircle" style="font-size:11.5px;padding:3px 9px">同模圓軌跡</button>
                <button class="ibtn" id="mRing" style="font-size:11.5px;padding:3px 9px">圓環區域</button>
              </div>
            </div></div>`;
          let mode = 'all';
          const draw = () => {
            const a = +h.querySelector('#as').value;
            const b = +h.querySelector('#bs').value;
            const mod = Math.sqrt(a * a + b * b);
            h.querySelector('#av').textContent = a.toFixed(1);
            h.querySelector('#bv').textContent = b.toFixed(1);
            h.querySelector('#mv').textContent = mod.toFixed(2);

            const P = SV.complexPlane({ x0: 50, y0: 25, w: 340, h: 215, xmin: -4, xmax: 4, ymin: -4, ymax: 4, step: 1 });
            const zx = P.X(a), zy = P.Y(b), ox = P.X(0), oy = P.Y(0);
            let layer = '';

            if (mode === 'ring') {
              const r1 = 1.5 * (340 / 8), r2 = 3.0 * (340 / 8);
              layer += `<circle cx="${ox}" cy="${oy}" r="${r2}" fill="rgba(37,99,235,0.12)" stroke="${C}" stroke-width="1.6"/>`;
              layer += `<circle cx="${ox}" cy="${oy}" r="${r1}" fill="#fff" stroke="${RED}" stroke-width="1.6" stroke-dasharray="4 3"/>`;
              layer += SV.vlabel(P.X(1.8), P.Y(2.2), '1.5 < |z| ≤ 3', C, 12);
            } else if (mode === 'circle' || mode === 'all') {
              layer += `<circle cx="${ox}" cy="${oy}" r="${(mod * (340 / 8)).toFixed(1)}" fill="rgba(217,119,6,0.06)" stroke="${AMB}" stroke-width="1.5" stroke-dasharray="4 3"/>`;
            }

            if (mode === 'conj' || mode === 'all') {
              const czx = P.X(a), czy = P.Y(-b);
              layer += SV.vector(P, 0, 0, a, -b, GRN, `z̄(${a},${-b})`, { fs: 12, ly: 14 });
              layer += SV.seg(zx, zy, czx, czy, '#94a3b8', 1.4, '3 3');
            }

            const projX = SV.seg(zx, zy, zx, oy, '#94a3b8', 1.6, '3 3');
            const projY = SV.seg(zx, zy, ox, zy, '#94a3b8', 1.6, '3 3');
            const vec = SV.vector(P, 0, 0, a, b, C, `Z(${a}, ${b})`, { fs: 13, ly: -8 });

            h.querySelector('#fig').innerHTML = svg('0 0 440 275', P.defs + P.svg + layer + projX + projY + vec);
          };

          h.querySelector('#as').oninput = draw;
          h.querySelector('#bs').oninput = draw;
          h.querySelector('#mVec').onclick = () => { mode = 'vec'; draw(); };
          h.querySelector('#mConj').onclick = () => { mode = 'conj'; draw(); };
          h.querySelector('#mCircle').onclick = () => { mode = 'circle'; draw(); };
          h.querySelector('#mRing').onclick = () => { mode = 'ring'; draw(); };
          draw();
        },
        caption: '支援點選按鈕切換共軛對稱、同模圓軌跡與教材 10.1.2 節圓環區域。'
      },
      {
        sec: '10.1.1', secName: '複數的概念',
        type: 'concept',
        title: '複數形式化定義與動態分類機',
        inquiry: '調節 a 與 b，實時檢測當前複數所屬分類與共軛特徵！',
        formula: { label: '複數代數形式', tex: 'z = a + bi \\quad (a, b \\in \\mathbb{R})' },
        points: [
          '\\(a\\) 為<b>實部</b> \\(\\mathrm{Re}\\)，\\(b\\) 為<b>虛部</b> \\(\\mathrm{Im}\\)。',
          '當 \\(b=0\\) 時 \\(z\\) 為實數；當 \\(b \\neq 0\\) 時 \\(z\\) 為虛數。',
          '當 \\(a=0\\) 且 \\(b \\neq 0\\) 時，\\(z\\) 稱為<b>純虛數</b>。',
          '共軛複數：\\(\\bar{z}=a-bi\\)，兩點關於實軸對稱。'
        ],
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div id="fbox"></div>
            <div class="ictrl"><label>微調：a ＝ <span class="ival" id="ca">0.0</span>　b ＝ <span class="ival" id="cb">2.0</span>　類別：<span class="ival" id="cat">純虛數</span></label>
            <div style="display:flex;gap:10px;width:100%">
              <input type="range" id="cas" min="-2" max="2" step="1" value="0" style="flex:1">
              <input type="range" id="cbs" min="-2" max="2" step="1" value="2" style="flex:1">
            </div></div></div>`;
          const draw = () => {
            const a = +h.querySelector('#cas').value;
            const b = +h.querySelector('#cbs').value;
            h.querySelector('#ca').textContent = a.toFixed(1);
            h.querySelector('#cb').textContent = b.toFixed(1);

            let cat = '一般虛數', tagColor = C;
            if (b === 0) { cat = '實數 (b=0)'; tagColor = GRN; }
            else if (a === 0 && b !== 0) { cat = '純虛數 (a=0, b≠0)'; tagColor = VIO; }
            h.querySelector('#cat').textContent = cat;
            h.querySelector('#cat').style.color = tagColor;

            h.querySelector('#fbox').innerHTML = SV.fbox([
              { label: '當前數式', tex: `z = ${a} + (${b})i`, color: tagColor, fill: '#f8fafc', size: 18, note: `當前判定：${cat}` },
              { label: '實部與虛部', tex: `\\mathrm{Re}(z)=${a}, \\; \\mathrm{Im}(z)=${b}`, color: C, size: 15 },
              { label: '共軛複數', tex: `\\bar{z} = ${a} - (${b})i`, color: AMB, size: 15 }
            ]);
            if (window.MJ) window.MJ(h.querySelector('#fbox'));
          };
          h.querySelector('#cas').oninput = draw;
          h.querySelector('#cbs').oninput = draw;
          draw();
        },
        caption: '動態滑桿即時判定複數的三大分類：實數、虛數與純虛數。'
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
        title: '典例剖析 — 參數討論求純虛數動態儀',
        inquiry: '拖動參數 m，動態觀察點 Z 在複平面的位置移動與純虛數成立條件！',
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
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>參數 m ＝ <span class="ival" id="mv">1.0</span>　點 Z 坐標：<span class="ival" id="zv">(0.0, 2.0)</span></label>
            <input type="range" id="ms" min="-2" max="2" step="0.5" value="1"></div></div>`;
          const draw = () => {
            const m = +h.querySelector('#ms').value;
            const re = m * m - 1;
            const im = m + 1;
            h.querySelector('#mv').textContent = m.toFixed(1);
            h.querySelector('#zv').textContent = `(${re.toFixed(1)}, ${im.toFixed(1)})`;

            const P = SV.complexPlane({ x0: 50, y0: 25, w: 340, h: 215, xmin: -2, xmax: 4, ymin: -1, ymax: 4, step: 1 });
            let statusNote = '';
            let dotCol = C;
            if (m === 1) {
              statusNote = SV.vlabel(P.X(0) + 12, P.Y(2) - 6, 'm=1 純虛數 Z(0,2)', RED, 13);
              dotCol = RED;
            } else if (m === -1) {
              statusNote = SV.vlabel(P.X(0) + 12, P.Y(0) + 14, 'm=-1 原點(實數0，排除)', AMB, 12);
              dotCol = AMB;
            }

            const vec = SV.vector(P, 0, 0, re, im, dotCol, `Z(${re.toFixed(1)},${im.toFixed(1)})`, { fs: 12 });
            const circle = m === 1 ? `<circle cx="${P.X(0)}" cy="${P.Y(0)}" r="${(2 * (340 / 6)).toFixed(1)}" fill="none" stroke="${GRN}" stroke-width="1.8" stroke-dasharray="4 3"/>` : '';
            h.querySelector('#fig').innerHTML = svg('0 0 440 270', P.defs + P.svg + circle + vec + statusNote);
          };
          h.querySelector('#ms').oninput = draw;
          draw();
        },
        caption: '拖動 m 至 1 時點剛好落入虛軸 (0,2)，拖至 -1 落在原點為實數 0。'
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
