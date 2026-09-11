/* ============ 第 1 章　導數的概念與幾何意義 (示範章節) ============
   依高中數學新課標：10.1.1 瞬時變化率與導數、10.1.2 導數的幾何意義
   ============================================================ */
window.DECK = window.DECK || [];
(function () {
  const C = '#2563eb';
  const RED = '#e11d48', GRN = '#059669', BLU = '#2563eb', VIO = '#7c3aed', AMB = '#d97706';

  function svg(vb, inner) {
    return `<div style="width:100%;text-align:center"><svg viewBox="${vb}" style="max-width:100%">${inner}</svg></div>`;
  }

  window.DECK.push({
    ch: 1,
    title: '導數的概念與幾何意義',
    color: C,
    sections: ['10.1.1 瞬時變化率與導數', '10.1.2 導數的幾何意義'],
    slides: [
      /* ---------- 10.1.1 瞬時變化率與導數 ---------- */
      {
        sec: '10.1.1', secName: '瞬時變化率與導數',
        type: 'hook',
        title: '特定瞬間的速度該如何精準衡量？',
        points: [
          '平均速度反映一段時間內的總體快慢：\\(\\bar{v}=\\frac{\\Delta s}{\\Delta t}\\)。',
          '在某一具體時刻（如車輛碰撞前瞬間），物體的<b>瞬時速度</b>是多少？',
          '矛盾：當 \\(\\Delta t = 0\\) 時，分母為零，公式失去算術意義！'
        ],
        visual: (h) => {
          h.innerHTML = svg('0 0 440 270', `
            ${SV.plane({ x0: 50, y0: 30, w: 340, h: 200, xmin: 0, xmax: 5, ymin: 0, ymax: 25, step: 1, xLabel: 't(s)', yLabel: 's(m)' }).defs}
            ${SV.plane({ x0: 50, y0: 30, w: 340, h: 200, xmin: 0, xmax: 5, ymin: 0, ymax: 25, step: 1, xLabel: 't(s)', yLabel: 's(m)' }).svg}
            ${SV.func(SV.plane({ x0: 50, y0: 30, w: 340, h: 200, xmin: 0, xmax: 5, ymin: 0, ymax: 25 }), t => t * t, [0, 4.8], { color: C, w: 2.6 })}
            ${SV.dot(186, 174, RED, 5)}
            ${SV.vlabel(196, 170, 't=2時刻', RED, 13)}
          `);
        },
        caption: '高空自由落體：時間越縮短，平均速度越接近該時刻的真實快慢。'
      },
      {
        sec: '10.1.1', secName: '瞬時變化率與導數',
        type: 'explore',
        title: '時間間隔無限縮小，平均速度趨於穩定極限',
        inquiry: '請拖動滑桿縮減時間間隔 Δt，觀察平均速度 Δs/Δt 的數值收斂趨勢！',
        points: [
          '令位移公式為 \\(s(t)=t^2\\)，考察 \\(t_0=2\\) 時刻的運動。',
          '當 \\(\\Delta t\\) 從 1 秒、0.1 秒到 0.01 秒，平均速度逼向固定常數 \\(4\\)。',
          '這個極限值就是 \\(t=2\\) 時刻的<b>瞬時速度</b>。'
        ],
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>時間差 Δt ＝ <span class="ival" id="dtv">1.00</span> 秒　平均速度 ＝ <span class="ival" id="vv">5.00</span> m/s</label>
            <input type="range" id="dts" min="0.05" max="2.0" step="0.05" value="1.00"></div></div>`;
          const s = t => t * t;
          const t0 = 2;
          const draw = () => {
            const dt = +h.querySelector('#dts').value;
            const avgV = (s(t0 + dt) - s(t0)) / dt;
            h.querySelector('#dtv').textContent = dt.toFixed(2);
            h.querySelector('#vv').textContent = avgV.toFixed(2);

            const P = SV.plane({ x0: 50, y0: 25, w: 340, h: 215, xmin: 0, xmax: 5, ymin: 0, ymax: 20, step: 1, xLabel: 't', yLabel: 's' });
            const curve = SV.func(P, s, [0, 4.2], { color: C });
            const sec = SV.secant(P, s, t0, t0 + dt, { color: RED, label1: 'P(2,4)', label2: 'Q' });
            const tri = SV.diffTriangle(P, t0, s(t0), dt, s(t0 + dt) - s(t0));
            h.querySelector('#fig').innerHTML = svg('0 0 440 275', P.defs + P.svg + curve + sec.svg + tri);
          };
          h.querySelector('#dts').oninput = draw; draw();
        },
        caption: '極限思維：動態逼近中掌握確定不變的瞬時狀態。'
      },
      {
        sec: '10.1.1', secName: '瞬時變化率與導數',
        type: 'concept',
        title: '導數的形式化定義：差商在極限下的值',
        formula: { label: '導數定義式', tex: 'f\'(x_0) = \\lim_{\\Delta x \\to 0} \\frac{f(x_0+\\Delta x)-f(x_0)}{\\Delta x}' },
        points: [
          '<b>核心本質</b>：函數增量 \\(\\Delta y\\) 與自變量增量 \\(\\Delta x\\) 之比的極限。',
          '<b>記號體系</b>：記作 \\(f\'(x_0)\\) 或 \\(\\left.\\frac{\\mathrm{d}y}{\\mathrm{d}x}\\right|_{x=x_0}\\)。',
          '若該極限存在，則稱函數在點 \\(x_0\\) 處<b>可導</b>。'
        ],
        visual: (h) => {
          h.innerHTML = SV.fbox([
            { label: '自變量增量', tex: '\\Delta x = x - x_0', color: C, fill: '#eff6ff', size: 17 },
            { label: '函數增量', tex: '\\Delta y = f(x_0+\\Delta x) - f(x_0)', color: GRN, fill: '#f0fdf4', size: 17 },
            { label: '平均變化率', tex: '\\frac{\\Delta y}{\\Delta x} = \\frac{f(x_0+\\Delta x)-f(x_0)}{\\Delta x}', color: AMB, size: 18, note: '差商反映兩點間總體變化' }
          ]);
        },
        caption: '導數反映了因變量隨自變量變化的快慢程度。'
      },
      {
        sec: '10.1.1', secName: '瞬時變化率與導數',
        type: 'example',
        title: '用定義法求函數在給定點的導數',
        example: {
          q: '利用導數定義，求函數 \\(f(x)=x^2\\) 在 \\(x=1\\) 處的導數 \\(f\'(1)\\)。',
          thinking: '嚴格按照三步法：算增量 \\(\\Delta y\\) → 算差商 \\(\\frac{\\Delta y}{\\Delta x}\\) → 取極限。',
          hints: [
            '第一步：\\(\\Delta y = (1+\\Delta x)^2 - 1^2 = 2\\Delta x + (\\Delta x)^2\\)',
            '第二步：分子分母約去 \\(\\Delta x\\) 得 \\(2+\\Delta x\\)'
          ],
          steps: [
            '計算差商：\\(\\frac{f(1+\\Delta x)-f(1)}{\\Delta x} = \\frac{(1+\\Delta x)^2-1}{\\Delta x} = 2+\\Delta x\\)',
            '取極限：當 \\(\\Delta x \\to 0\\) 時，\\(\\lim_{\\Delta x \\to 0}(2+\\Delta x) = 2\\)',
            '得出結論：\\(f\'(1) = 2\\)'
          ],
          ans: '\\(f\'(1) = 2\\)',
          variant: {
            q: '【隨堂變式】求同一函數在 \\(x=3\\) 處的導數。',
            ans: '\\(f\'(3) = 6\\)'
          }
        },
        points: [
          '<b>定義法三部曲</b>：求增量 → 算比值 → 取極限。',
          '在約分之前，不可直接將 \\(\\Delta x = 0\\) 代入分母。'
        ],
        visual: (h) => {
          h.innerHTML = SV.fbox([
            { label: 'Step 1: 求差', tex: '\\Delta y = 2\\Delta x + (\\Delta x)^2', color: C, size: 16 },
            { label: 'Step 2: 算商', tex: '\\frac{\\Delta y}{\\Delta x} = 2 + \\Delta x', color: AMB, size: 16 },
            { label: 'Step 3: 取極限', tex: '\\lim_{\\Delta x \\to 0}(2 + \\Delta x) = 2', color: GRN, fill: '#f0fdf4', border: GRN, size: 19 }
          ]);
        },
        caption: '解題核心：先化簡代數式消除不定型，再求極限。'
      },

      /* ---------- 10.1.2 導數的幾何意義 ---------- */
      {
        sec: '10.1.2', secName: '導數的幾何意義',
        type: 'explore',
        title: '割線的極限位置即為切線，斜率即為導數',
        inquiry: '請拖動滑桿改變動點 Q 的位置，觀察割線 PQ 逼近切線的動態過程！',
        points: [
          '割線 \\(PQ\\) 的斜率是平均變化率：\\(k_{PQ} = \\frac{f(x)-f(x_0)}{x-x_0}\\)。',
          '當點 \\(Q\\) 沿曲線逼近點 \\(P\\) 時，割線繞 \\(P\\) 轉動並趨向切線。',
          '<b>幾何意義</b>：導數 \\(f\'(x_0)\\) 就是切線的<b>斜率</b>。'
        ],
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>割點 Q 橫坐標 ＝ <span class="ival" id="xv">2.5</span>　割線斜率 ＝ <span class="ival" id="ksv">3.50</span></label>
            <input type="range" id="xs" min="1.05" max="3.0" step="0.05" value="2.5"></div></div>`;
          const fn = x => 0.5 * x * x + 0.5;
          const x0 = 1;
          const draw = () => {
            const xq = +h.querySelector('#xs').value;
            const slope = (fn(xq) - fn(x0)) / (xq - x0);
            h.querySelector('#xv').textContent = xq.toFixed(2);
            h.querySelector('#ksv').textContent = slope.toFixed(2);

            const P = SV.plane({ x0: 45, y0: 25, w: 350, h: 220, xmin: -0.5, xmax: 3.5, ymin: -0.5, ymax: 5.5 });
            const curve = SV.func(P, fn, [0, 3.2], { color: C });
            const sec = SV.secant(P, fn, x0, xq, { color: RED, label1: 'P(1,1)', label2: 'Q' });
            const tan = SV.tangent(P, fn, 1.0, x0, { color: GRN, label: '切線(k=1.00)' });
            h.querySelector('#fig').innerHTML = svg('0 0 440 275', P.defs + P.svg + curve + sec.svg + tan.svg);
          };
          h.querySelector('#xs').oninput = draw; draw();
        },
        caption: '紅線為割線，綠線為極限切線。'
      },
      {
        sec: '10.1.2', secName: '導數的幾何意義',
        type: 'pitfall',
        title: '連續曲線在每一點都必然存在切線嗎？',
        points: [
          '<b>經典反例</b>：函數 \\(f(x)=|x|\\) 在 \\(x=0\\) 處連續。',
          '從右側逼近（\\(x>0\\)）割線斜率為 \\(+1\\)；從左側逼近為 \\(-1\\)。',
          '左右極限不相等，極限不存在，故在原點<b>不可導</b>！'
        ],
        visual: (h) => {
          SV.quiz(h, {
            q: '若曲線在點 \\(x_0\\) 處連續，下列說法正確的是？',
            options: [
              'A. 該點必有切線且切線斜率存在',
              'B. 該點不一定可導（圖形可能存在尖點折角）',
              'C. 該點必定不可導'
            ],
            ans: 1,
            explain: '連續只保證圖線沒有斷裂，但折角處（尖點）左右割線極限不同，不存在確定切線。'
          });
        },
        caption: '「可導必連續，連續不一定可導」是高考常考重點。'
      }
    ]
  });
})();
