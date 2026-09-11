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
        title: '直角坐標到極坐標 — 長度與角度的新視角',
        points: [
          '代數形式 \\(z=a+bi\\) 直觀表達了直角坐標分量。',
          '平面上的點亦能以距離原點之長度 \\(r\\) 與方向角 \\(\\theta\\) 標定。',
          '由三角函數：\\(a = r\\cos\\theta, \\; b = r\\sin\\theta\\)。'
        ],
        visual: (h) => {
          const P = SV.complexPlane({ x0: 50, y0: 25, w: 340, h: 215, xmin: -1, xmax: 4, ymin: -1, ymax: 4, step: 1 });
          const r = 3, theta = Math.PI / 3;
          const a = r * Math.cos(theta), b = r * Math.sin(theta);
          const ox = P.X(0), oy = P.Y(0), zx = P.X(a), zy = P.Y(b);
          const vec = SV.vector(P, 0, 0, a, b, C, 'Z(r, θ)', { lx: 10, ly: -6 });
          const base = SV.seg(ox, oy, zx, oy, BLU, 2.2);
          const height = SV.seg(zx, oy, zx, zy, GRN, 2.2, '4 3');
          const arc = SV.angle(ox, oy, 32, 0, 60, AMB, 'θ=60°', { fs: 13, fill: true });
          const noteR = SV.vlabel((ox + zx) / 2 - 10, (oy + zy) / 2 - 10, 'r = |z|', C, 14);
          h.innerHTML = svg('0 0 440 270', P.defs + P.svg + base + height + arc + vec + noteR);
        },
        caption: '三角形式將複數的代數屬性與平面幾何極坐標深度融合。'
      },
      {
        sec: '10.3.1', secName: '複數的三角形式',
        type: 'explore',
        title: '動態旋轉與伸縮儀 — 複數乘法的幾何本質',
        inquiry: '拖動滑桿調節輻角 θ，觀察向量動態旋轉與乘以虛數單位 i 的幾何變換！',
        points: [
          '<b>幾何本質</b>：複數相乘等於「<b>模長相乘，輻角相加</b>」。',
          '虛數單位 \\(i\\) 的三角形式為 \\(\\cos 90^\\circ + i\\sin 90^\\circ\\)。',
          '<b>重要推論</b>：任意複數乘以 \\(i\\)，相當於將其向量<b>逆時針旋轉 90°</b>！'
        ],
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>輻角 θ ＝ <span class="ival" id="degv">45</span>°　旋轉後 (z·i) 輻角 ＝ <span class="ival" id="rotv">135</span>°</label>
            <input type="range" id="degs" min="0" max="360" step="15" value="45"></div></div>`;
          const draw = () => {
            const deg = +h.querySelector('#degs').value;
            const rotDeg = (deg + 90) % 360;
            h.querySelector('#degv').textContent = deg;
            h.querySelector('#rotv').textContent = rotDeg;

            const P = SV.complexPlane({ x0: 50, y0: 25, w: 340, h: 215, xmin: -3.5, xmax: 3.5, ymin: -3.5, ymax: 3.5, step: 1 });
            const rad1 = deg * Math.PI / 180;
            const rad2 = (deg + 90) * Math.PI / 180;
            const r = 2.4;
            const x1 = r * Math.cos(rad1), y1 = r * Math.sin(rad1);
            const x2 = r * Math.cos(rad2), y2 = r * Math.sin(rad2);

            const v1 = SV.vector(P, 0, 0, x1, y1, BLU, 'z', { lx: 8, ly: -6 });
            const v2 = SV.vector(P, 0, 0, x2, y2, RED, 'z·i (旋轉90°)', { lx: 8, ly: -6 });
            const rotArc = SV.angle(P.X(0), P.Y(0), 45, deg, deg + 90, AMB, '+90°', { fs: 12, fill: true });
            const track = `<circle cx="${P.X(0)}" cy="${P.Y(0)}" r="${(r * (340 / 7)).toFixed(1)}" fill="none" stroke="#cbd5e1" stroke-width="1.2" stroke-dasharray="3 3"/>`;
            h.querySelector('#fig').innerHTML = svg('0 0 440 275', P.defs + P.svg + track + rotArc + v1 + v2);
          };
          h.querySelector('#degs').oninput = draw;
          draw();
        },
        caption: '藍色為初始向量，紅色為乘以 i 後逆時針旋轉 90° 的新向量。'
      },
      {
        sec: '10.3.1', secName: '複數的三角形式',
        type: 'concept',
        title: '三角形式定理與棣莫弗公式',
        formula: { label: '乘法幾何定理', tex: 'z_1 z_2 = r_1 r_2 \\left[\\cos(\\theta_1+\\theta_2) + i\\sin(\\theta_1+\\theta_2)\\right]' },
        points: [
          '<b>三角形式</b>：\\(z = r(\\cos\\theta + i\\sin\\theta)\\)，\\(r \\ge 0\\)。',
          '<b>輻角主值</b>：滿足 \\(0 \\le \\theta < 2\\pi\\) 的輻角記為 \\(\\arg z\\)。',
          '<b>除法幾何意義</b>：模長相除，輻角相減。',
          '<b>棣莫弗公式</b>：\\(z^n = r^n(\\cos n\\theta + i\\sin n\\theta)\\)。'
        ],
        visual: (h) => {
          h.innerHTML = SV.fbox([
            { label: '標準三角形式', tex: 'z = r(\\cos\\theta + i\\sin\\theta) \\quad (r \\ge 0)', color: C, fill: '#f5f3ff', size: 16 },
            { label: '複數乘法：模相乘、角相加', tex: '|z_1 z_2| = r_1 r_2, \\quad \\arg(z_1 z_2) = \\theta_1 + \\theta_2', color: BLU, fill: '#eff6ff', size: 15 },
            { label: '複數除法：模相除、角相減', tex: '|z_1 / z_2| = r_1 / r_2, \\quad \\arg(z_1 / z_2) = \\theta_1 - \\theta_2', color: GRN, size: 15 },
            { label: '棣莫弗公式 (高次冪速算法則)', tex: 'z^n = r^n (\\cos n\\theta + i\\sin n\\theta)', color: RED, size: 16, note: '大幅簡化高次冪與開方運算' }
          ]);
        },
        caption: '三角形式將繁重的多項式乘除運算化為簡潔的幾何伸縮與旋轉。'
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
        title: '典例剖析 — 利用三角形式速算高次冪',
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
          const P = SV.complexPlane({ x0: 50, y0: 25, w: 340, h: 215, xmin: -1, xmax: 3, ymin: -1, ymax: 3, step: 1 });
          const zx = 1, zy = Math.sqrt(3);
          const v = SV.vector(P, 0, 0, zx, zy, C, 'z = 1 + √3 i', { lx: 10, ly: -6 });
          const arc = SV.angle(P.X(0), P.Y(0), 30, 0, 60, AMB, 'π/3', { fs: 13, fill: true });
          const circle = `<circle cx="${P.X(0)}" cy="${P.Y(0)}" r="${(2 * (340 / 4)).toFixed(1)}" fill="none" stroke="${GRN}" stroke-width="1.5" stroke-dasharray="4 3"/>`;
          const lbl = SV.vlabel(P.X(1.8), P.Y(2.2), 'r = 2', GRN, 14);
          h.innerHTML = svg('0 0 440 270', P.defs + P.svg + circle + arc + v + lbl);
        },
        caption: '利用幾何旋轉 6 次 60°，剛好完成整整一圈 360° 回到實軸正半軸。'
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
