/* ============ 第 3 單元　10.3 複數的三角形式及其運算 ============
   教材來源：普通高中教科書 數學(B版) 必修第四冊 第十章
   ============================================================ */
window.DECK = window.DECK || [];
(function () {
  const C = '#7c3aed'; // 主題色：紫羅蘭
  const RED = '#e11d48', GRN = '#059669', BLU = '#2563eb', VIO = '#7c3aed', AMB = '#d97706';

  function svg(vb, inner) {
    return `<div style="width:100%;text-align:center"><svg viewBox="${vb}" style="max-width:100%">${inner}</svg></div>`;
  }

  window.DECK.push({
    ch: 3,
    title: '複數的三角形式及其運算',
    color: C,
    sections: ['10.3.1 複數的三角形式', '10.3.2 乘除運算的幾何意義'],
    slides: [
      /* ---------- 10.3.1 複數的三角形式 ---------- */
      {
        sec: '10.3.1', secName: '複數的三角形式',
        type: 'hook',
        title: '直角坐標與極坐標動態互化儀',
        inquiry: '拖動長度 r 與輻角 θ，動態觀察直角坐標 a, b 與極坐標 r, θ 的即時互化！',
        points: [
          '代數形式 \\(z=a+bi\\) 直觀表達了直角坐標分量。',
          '平面上的點亦能以距離原點之長度 \\(r\\) 與方向角 \\(\\theta\\) 標定。',
          '由三角函數：\\(a = r\\cos\\theta, \\; b = r\\sin\\theta\\)。'
        ],
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl" style="gap:6px 14px">
              <label>模長 r ＝ <span class="ival" id="rv">2.5</span>　輻角 θ ＝ <span class="ival" id="thv">60</span>°　z ＝ <span class="ival" id="algv">1.25 + 2.17i</span></label>
              <div style="display:flex;gap:8px;width:100%">
                <input type="range" id="rs" min="1.0" max="3.5" step="0.5" value="2.5" style="flex:1">
                <input type="range" id="ths" min="0" max="360" step="15" value="60" style="flex:1">
              </div>
            </div></div>`;
          const draw = () => {
            const r = +h.querySelector('#rs').value;
            const deg = +h.querySelector('#ths').value;
            const rad = deg * Math.PI / 180;
            const a = r * Math.cos(rad);
            const b = r * Math.sin(rad);
            h.querySelector('#rv').textContent = r.toFixed(1);
            h.querySelector('#thv').textContent = deg;
            h.querySelector('#algv').textContent = `${a.toFixed(2)} ${b >= 0 ? '+' : ''}${b.toFixed(2)}i`;

            const P = SV.complexPlane({ x0: 50, y0: 25, w: 340, h: 215, xmin: -4, xmax: 4, ymin: -4, ymax: 4, step: 1 });
            const ox = P.X(0), oy = P.Y(0), zx = P.X(a), zy = P.Y(b);
            const vec = SV.vector(P, 0, 0, a, b, C, `Z(${r},${deg}°)`, { fs: 12, ly: -6 });
            const base = SV.seg(ox, oy, zx, oy, BLU, 2.2);
            const height = SV.seg(zx, oy, zx, zy, GRN, 2.2, '3 3');
            const arc = SV.angle(ox, oy, 28, 0, deg, AMB, `${deg}°`, { fs: 11, fill: true });
            const circ = `<circle cx="${ox}" cy="${oy}" r="${(r * (340 / 8)).toFixed(1)}" fill="none" stroke="#cbd5e1" stroke-width="1.2" stroke-dasharray="3 3"/>`;
            h.querySelector('#fig').innerHTML = svg('0 0 440 275', P.defs + P.svg + circ + base + height + arc + vec);
          };
          h.querySelector('#rs').oninput = draw;
          h.querySelector('#ths').oninput = draw;
          draw();
        },
        caption: '藍線為實部投影 a = r·cosθ，綠線為虛部投影 b = r·sinθ。'
      },
      {
        sec: '10.3.1', secName: '複數的三角形式',
        type: 'explore',
        title: '複數乘法旋轉與伸縮探究儀',
        inquiry: '拖動輻角 θ 並切換乘數，親手驗證「模長相乘，輻角相加」的幾何變換！',
        points: [
          '<b>幾何本質</b>：複數相乘等於「<b>模長相乘，輻角相加</b>」。',
          '虛數單位 \\(i\\) 的三角形式為 \\(\\cos 90^\\circ + i\\sin 90^\\circ\\)。',
          '<b>重要推論</b>：任意複數乘以 \\(i\\)，相當於將其向量<b>逆時針旋轉 90°</b>！'
        ],
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl" style="gap:6px 12px">
              <label>初始角 θ ＝ <span class="ival" id="degv">30</span>°　旋轉後角 ＝ <span class="ival" id="rotv">120</span>°</label>
              <input type="range" id="degs" min="0" max="360" step="15" value="30">
              <div style="display:flex;gap:6px;margin-top:2px">
                <button class="ibtn" id="btnI" style="font-size:11.5px;padding:3px 9px">× i (旋轉90°)</button>
                <button class="ibtn" id="btnNeg" style="font-size:11.5px;padding:3px 9px">× (-1) (旋轉180°)</button>
                <button class="ibtn" id="btn45" style="font-size:11.5px;padding:3px 9px">× 1.2∠45° (伸長+轉)</button>
              </div>
            </div></div>`;
          let mulMode = 'i';
          const draw = () => {
            const deg = +h.querySelector('#degs').value;
            let addDeg = 90, scale = 1.0, mulName = 'z · i';
            if (mulMode === 'neg') { addDeg = 180; mulName = 'z · (-1)'; }
            else if (mulMode === '45') { addDeg = 45; scale = 1.2; mulName = 'z · 1.2∠45°'; }

            const rotDeg = (deg + addDeg) % 360;
            h.querySelector('#degv').textContent = deg;
            h.querySelector('#rotv').textContent = rotDeg;

            const P = SV.complexPlane({ x0: 50, y0: 25, w: 340, h: 215, xmin: -4, xmax: 4, ymin: -4, ymax: 4, step: 1 });
            const rad1 = deg * Math.PI / 180;
            const rad2 = rotDeg * Math.PI / 180;
            const r1 = 2.2, r2 = r1 * scale;
            const x1 = r1 * Math.cos(rad1), y1 = r1 * Math.sin(rad1);
            const x2 = r2 * Math.cos(rad2), y2 = r2 * Math.sin(rad2);

            const v1 = SV.vector(P, 0, 0, x1, y1, BLU, 'z', { lx: 8, ly: -6 });
            const v2 = SV.vector(P, 0, 0, x2, y2, RED, mulName, { lx: 8, ly: -6 });
            const rotArc = SV.angle(P.X(0), P.Y(0), 40, deg, deg + addDeg, AMB, `+${addDeg}°`, { fs: 11, fill: true });
            const track = `<circle cx="${P.X(0)}" cy="${P.Y(0)}" r="${(r1 * (340 / 8)).toFixed(1)}" fill="none" stroke="#cbd5e1" stroke-width="1.2" stroke-dasharray="3 3"/>`;
            h.querySelector('#fig').innerHTML = svg('0 0 440 275', P.defs + P.svg + track + rotArc + v1 + v2);
          };

          h.querySelector('#degs').oninput = draw;
          h.querySelector('#btnI').onclick = () => { mulMode = 'i'; draw(); };
          h.querySelector('#btnNeg').onclick = () => { mulMode = 'neg'; draw(); };
          h.querySelector('#btn45').onclick = () => { mulMode = '45'; draw(); };
          draw();
        },
        caption: '藍色為初始向量 z，紅色為乘以各複數後旋轉與伸縮的新向量。'
      },
      {
        sec: '10.3.1', secName: '複數的三角形式',
        type: 'concept',
        title: '棣莫弗定理與單位根正多邊形探究儀',
        inquiry: '調節次方 n，在單位圓上觀察 zⁿ ＝ 1 的 n 個單位根如何生成正多邊形！',
        formula: { label: '乘法幾何定理', tex: 'z_1 z_2 = r_1 r_2 \\left[\\cos(\\theta_1+\\theta_2) + i\\sin(\\theta_1+\\theta_2)\\right]' },
        points: [
          '<b>三角形式</b>：\\(z = r(\\cos\\theta + i\\sin\\theta)\\)，\\(r \\ge 0\\)。',
          '<b>輻角主值</b>：滿足 \\(0 \\le \\theta < 2\\pi\\) 的輻角記為 \\(\\arg z\\)。',
          '<b>除法幾何意義</b>：模長相除，輻角相減。',
          '<b>棣莫弗公式</b>：\\(z^n = r^n(\\cos n\\theta + i\\sin n\\theta)\\)。'
        ],
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>單位根次數 n ＝ <span class="ival" id="nv">3</span>　生成幾何圖形：<span class="ival" id="polyname">正三角形</span></label>
            <input type="range" id="ns" min="2" max="8" step="1" value="3"></div></div>`;
          const names = { 2: '對稱二點線段', 3: '正三角形', 4: '正方形', 5: '正五邊形', 6: '正六邊形', 7: '正七邊形', 8: '正八邊形' };
          const draw = () => {
            const n = +h.querySelector('#ns').value;
            h.querySelector('#nv').textContent = n;
            h.querySelector('#polyname').textContent = names[n] || `正 ${n} 邊形`;

            const P = SV.complexPlane({ x0: 50, y0: 25, w: 340, h: 215, xmin: -2, xmax: 2, ymin: -2, ymax: 2, step: 1 });
            const ox = P.X(0), oy = P.Y(0);
            const unitR = 1.0 * (340 / 4);
            let unitCirc = `<circle cx="${ox}" cy="${oy}" r="${unitR}" fill="none" stroke="#94a3b8" stroke-width="1.2" stroke-dasharray="3 3"/>`;

            const pts = [];
            let dotsSvg = '';
            for (let k = 0; k < n; k++) {
              const ang = 2 * Math.PI * k / n;
              const x = Math.cos(ang), y = Math.sin(ang);
              const px = P.X(x), py = P.Y(y);
              pts.push([px, py]);
              dotsSvg += SV.dot(px, py, RED, 4.5);
              dotsSvg += SV.seg(ox, oy, px, py, C, 1.4, '2 2');
              dotsSvg += SV.vlabel(px + (x >= 0 ? 8 : -18), py + (y >= 0 ? -6 : 14), `ω${k}`, RED, 11);
            }
            const polySvg = SV.poly(pts, 'rgba(124,58,237,0.12)', VIO, 2.2);
            h.querySelector('#fig').innerHTML = svg('0 0 440 270', P.defs + P.svg + unitCirc + polySvg + dotsSvg);
          };
          h.querySelector('#ns').oninput = draw;
          draw();
        },
        caption: '棣莫弗定理揭示：方程 zⁿ = 1 的 n 個複數根均勻分佈在單位圓上構成正 n 邊形！'
      },
      /* ---------- 10.3.2 乘除運算的幾何意義 ---------- */
      {
        sec: '10.3.2', secName: '乘除運算的幾何意義',
        type: 'pitfall',
        title: '易混辨析 — 三角形式的標準規範與符號陷阱',
        points: [
          '標準三角形式三要素：模長非負、中間為加號、角完全相同。',
          '負號處理：\\(-z = r[\\cos(\\theta+\\pi) + i\\sin(\\theta+\\pi)]\\)。',
          '共軛處理：\\(\\bar{z} = r[\\cos(-\\theta) + i\\sin(-\\theta)]\\)。'
        ],
        quiz: {
          q: '下列各式中，屬於複數標準三角形式的是哪一項？',
          options: [
            'A. -2 (cos(π/3) + i sin(π/3))',
            'B. 2 (cos(π/4) - i sin(π/4))',
            'C. 2 (sin(π/6) + i cos(π/6))',
            'D. 2 (cos(2π/3) + i sin(2π/3))'
          ],
          ans: 3,
          explain: 'A模長為負；B中間為減號；C實虛部sin與cos顛倒；只有D符合模長為正、中間加號、實部cos、虛部sin且角相同的標準三角形式！故選D。'
        },
        visual: (h) => {
          SV.quiz(h, {
            q: '下列各式中，屬於複數標準三角形式的是哪一項？',
            options: [
              'A. -2 (cos(π/3) + i sin(π/3))',
              'B. 2 (cos(π/4) - i sin(π/4))',
              'C. 2 (sin(π/6) + i cos(π/6))',
              'D. 2 (cos(2π/3) + i sin(2π/3))'
            ],
            ans: 3,
            explain: 'A模長為負；B中間為減號；C實虛部sin與cos顛倒；只有D符合模長為正、中間加號、實部cos、虛部sin且角相同的標準三角形式！故選D。'
          });
        },
        caption: '寫成三角形式時，切記利用誘導公式調整為「模正、中加、角同」。'
      },
      {
        sec: '10.3.2', secName: '乘除運算的幾何意義',
        type: 'example',
        title: '典例剖析 — 棣莫弗高次冪旋轉階梯儀',
        inquiry: '拖動冪次 k (1到6)，觀察複數 z=(1+√3 i) 每次旋轉 60° 最終落在正實軸 64！',
        example: {
          q: '將複數 \\(z = 1 + \\sqrt{3}i\\) 改寫為三角形式，並計算 \\(z^6\\) 的值。',
          thinking: '先計算模長 r=2 與輻角主值 θ=π/3，再套用棣莫弗公式。',
          hints: [
            '第一步：計算模長 \\(r = \\sqrt{1^2+(\\sqrt{3})^2} = 2\\)',
            '第二步：確定輻角 \\(\\cos\\theta = \\frac{1}{2}, \\sin\\theta = \\frac{\\sqrt{3}}{2} \\implies \\theta = \\frac{\\pi}{3}\\)',
            '第三步：套用公式 \\(z^6 = 2^6[\\cos(6 \\cdot \\frac{\\pi}{3}) + i\\sin(6 \\cdot \\frac{\\pi}{3})]\\)'
          ],
          steps: [
            '三角形式：\\(z = 2(\\cos\\frac{\\pi}{3} + i\\sin\\frac{\\pi}{3})\\)',
            '套用棣莫弗公式：\\(z^6 = 2^6 [\\cos(2\\pi) + i\\sin(2\\pi)]\\)',
            '代入三角值：\\(\\cos 2\\pi = 1, \\; \\sin 2\\pi = 0\\)',
            '求得最終結果：\\(z^6 = 64(1 + 0i) = 64\\)'
          ],
          ans: '\\(z = 2(\\cos\\frac{\\pi}{3} + i\\sin\\frac{\\pi}{3})\\)，\\(z^6 = 64\\)',
          variant: {
            q: '【即堂變式】將複數 \\(1-i\\) 改寫為標準三角形式。',
            ans: '\\(\\sqrt{2}(\\cos\\frac{7\\pi}{4} + i\\sin\\frac{7\\pi}{4})\\) 或 \\(\\sqrt{2}[\\cos(-\\frac{\\pi}{4}) + i\\sin(-\\frac{\\pi}{4})]\\)。'
          }
        },
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>當前冪次 z^k：k ＝ <span class="ival" id="kv">1</span>　累計旋轉角 ＝ <span class="ival" id="degk">60</span>°</label>
            <input type="range" id="ks" min="1" max="6" step="1" value="1"></div></div>`;
          const draw = () => {
            const k = +h.querySelector('#ks').value;
            const deg = (k * 60) % 360;
            h.querySelector('#kv').textContent = k;
            h.querySelector('#degk').textContent = k * 60;

            const P = SV.complexPlane({ x0: 50, y0: 25, w: 340, h: 215, xmin: -3, xmax: 3, ymin: -3, ymax: 3, step: 1 });
            const rad = deg * Math.PI / 180;
            const r = 2.2;
            const x = r * Math.cos(rad), y = r * Math.sin(rad);

            let allSteps = '';
            for (let j = 1; j <= k; j++) {
              const jrad = (j * 60) * Math.PI / 180;
              const jx = P.X(r * Math.cos(jrad)), jy = P.Y(r * Math.sin(jrad));
              allSteps += SV.dot(jx, jy, j === 6 ? GRN : (j === k ? RED : '#94a3b8'), j === k ? 5 : 3.5);
            }

            const vec = SV.vector(P, 0, 0, x, y, k === 6 ? GRN : RED, `z^${k}`, { fs: 12, ly: -6 });
            const arc = SV.angle(P.X(0), P.Y(0), 32, 0, k * 60, AMB, `${k * 60}°`, { fs: 11, fill: true });
            const track = `<circle cx="${P.X(0)}" cy="${P.Y(0)}" r="${(r * (340 / 6)).toFixed(1)}" fill="none" stroke="#cbd5e1" stroke-width="1.2" stroke-dasharray="3 3"/>`;
            const note = k === 6 ? SV.vlabel(P.X(2.2), P.Y(0) + 16, '第6次旋轉精準回實軸 (值=64)', GRN, 12, { anchor: 'middle' }) : '';

            h.querySelector('#fig').innerHTML = svg('0 0 440 270', P.defs + P.svg + track + arc + allSteps + vec + note);
          };
          h.querySelector('#ks').oninput = draw;
          draw();
        },
        caption: '每升高一次冪，向量逆時針旋轉 60°，當 k=6 時恰好旋轉 360° 回到正實軸。'
      },
      {
        sec: '10.3.2', secName: '乘除運算的幾何意義',
        type: 'practice',
        title: '隨堂檢測 — 向量旋轉與三角形式互化',
        points: [
          '逆時針旋轉 \\(\\alpha\\) 角，相當於乘以 \\(\\cos\\alpha + i\\sin\\alpha\\)。',
          '特別地，逆時針旋轉 \\(90^\\circ\\) 即乘以虛數單位 \\(i\\)。',
          '順時針旋轉 \\(\\alpha\\) 即乘以 \\(\\cos\\alpha - i\\sin\\alpha\\)。'
        ],
        quiz: {
          q: '將複數 z = 2i 對應的向量繞原點逆時針旋轉 90°，所得向量對應的複數為？',
          options: [
            'A. 2',
            'B. -2',
            'C. -2i',
            'D. 2 + 2i'
          ],
          ans: 1,
          explain: '逆時針旋轉 90° 相當於乘以虛數單位 i：2i × i = 2i² = 2(-1) = -2。選B。'
        },
        visual: (h) => {
          SV.quiz(h, {
            q: '將複數 z = 2i 對應的向量繞原點逆時針旋轉 90°，所得向量對應的複數為？',
            options: [
              'A. 2',
              'B. -2',
              'C. -2i',
              'D. 2 + 2i'
            ],
            ans: 1,
            explain: '逆時針旋轉 90° 相當於乘以虛數單位 i：2i × i = 2i² = 2(-1) = -2。選B。'
          });
        },
        caption: '旋轉變換的本質即複數乘法，極大簡化了解析幾何的剛體轉動。'
      }
    ]
  });
})();
