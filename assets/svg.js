/* ============================================================
   svg.js — 新課互動幾何與函數工具庫 (lesson-deck SVG Toolkit)
   座標採「數學慣例」：y 向上為正；helper 內部自動翻轉成螢幕座標。
   擴展支援：高中函數繪製、切線/割線、向量/複平面、微分增量、微積分分割、即時評量。
   ============================================================ */
const SV = (() => {
  const RAD = Math.PI / 180;

  // 極座標 → 螢幕座標（y 向下）；deg 為數學角度（逆時針為正）
  const pt = (cx, cy, r, deg) => [cx + r * Math.cos(deg * RAD), cy - r * Math.sin(deg * RAD)];

  // 兩點連線角度（數學角度 0~360）
  const angleOf = (cx, cy, x, y) => {
    let d = Math.atan2(-(y - cy), x - cx) / RAD;
    return (d + 360) % 360;
  };

  // 以「取樣折線」畫角弧（避免 SVG arc 的 sweep 方向 bug）
  const arcPoints = (cx, cy, r, d0, d1, steps = 40) => {
    if (d1 < d0) d1 += 360;
    let s = '';
    for (let i = 0; i <= steps; i++) {
      const d = d0 + (d1 - d0) * (i / steps);
      const [x, y] = pt(cx, cy, r, d);
      s += `${x.toFixed(1)},${y.toFixed(1)} `;
    }
    return s.trim();
  };

  // 角弧 + 角度標記文字；color 顏色；label 文字（可含度數）
  const angle = (cx, cy, r, d0, d1, color, label, opt = {}) => {
    const pts = arcPoints(cx, cy, r, d0, d1);
    let dm = (d0 + ((d1 < d0 ? d1 + 360 : d1) - d0) / 2);
    const lr = r + (opt.lr || 20);
    const [lx, ly] = pt(cx, cy, lr, dm);
    let out = `<polyline points="${pts}" fill="none" stroke="${color}" stroke-width="${opt.w || 2.5}"/>`;
    if (opt.fill) {
      const [x0, y0] = pt(cx, cy, r, d0);
      const [x1, y1] = pt(cx, cy, r, d1);
      out = `<path d="M${cx},${cy} L${x0.toFixed(1)},${y0.toFixed(1)} A${r},${r} 0 0 0 ${x1.toFixed(1)},${y1.toFixed(1)} Z" fill="${color}" opacity="0.14"/>` + out;
    }
    if (label) out += `<text x="${lx.toFixed(1)}" y="${(ly + 5).toFixed(1)}" text-anchor="middle" class="lbl" font-size="${opt.fs || 16}" fill="${color}">${label}</text>`;
    return out;
  };

  // 直角小方框（在頂點 V，介於方向 d0、d1 之間）
  const rightAngle = (cx, cy, d0, d1, size = 14, color = '#657187') => {
    const [ax, ay] = pt(cx, cy, size, d0);
    const [bx, by] = pt(cx, cy, size, d1);
    const dx = (ax - cx) + (bx - cx), dy = (ay - cy) + (by - cy);
    return `<path d="M${ax.toFixed(1)},${ay.toFixed(1)} L${(cx + dx).toFixed(1)},${(cy + dy).toFixed(1)} L${bx.toFixed(1)},${by.toFixed(1)}" fill="none" stroke="${color}" stroke-width="2"/>`;
  };

  // 邊上的等邊刻度記號（tick），n 條；p、q 為端點，用於標「相等的邊」
  const ticks = (x1, y1, x2, y2, n = 1, color = '#e11d48', len = 7) => {
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
    const ang = Math.atan2(y2 - y1, x2 - x1);
    const nx = Math.cos(ang + Math.PI / 2), ny = Math.sin(ang + Math.PI / 2);
    const tx = Math.cos(ang), ty = Math.sin(ang);
    let out = '';
    const gap = 5;
    const start = -(n - 1) * gap / 2;
    for (let i = 0; i < n; i++) {
      const off = start + i * gap;
      const bx = mx + tx * off, by = my + ty * off;
      out += `<line x1="${(bx - nx * len).toFixed(1)}" y1="${(by - ny * len).toFixed(1)}" x2="${(bx + nx * len).toFixed(1)}" y2="${(by + ny * len).toFixed(1)}" stroke="${color}" stroke-width="${2.4}"/>`;
    }
    return out;
  };

  // 端點小圓點
  const dot = (x, y, color = '#172033', r = 4.5) =>
    `<circle cx="${x}" cy="${y}" r="${r}" fill="${color}"/>`;

  // 頂點／文字標籤
  const vlabel = (x, y, text, color = '#172033', fs = 17, opt = {}) =>
    `<text x="${x}" y="${y}" class="lbl" font-size="${fs}" ${opt.anchor ? `text-anchor="${opt.anchor}"` : ''} font-weight="${opt.fw || 700}" fill="${color}">${text}</text>`;

  // 線段
  const seg = (x1, y1, x2, y2, color = '#172033', w = 2.6, dash = '') =>
    `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${w}" ${dash ? `stroke-dasharray="${dash}"` : ''} stroke-linecap="round"/>`;

  // 多邊形（給頂點陣列 [[x,y],...]）
  const poly = (points, fill = 'rgba(37,99,235,0.08)', stroke = '#2563eb', w = 2.6) =>
    `<polygon points="${points.map(p => p.join(',')).join(' ')}" fill="${fill}" stroke="${stroke}" stroke-width="${w}" stroke-linejoin="round"/>`;

  // 箭頭定義（在 svg 開頭放一次）
  const arrowDefs = (color = '#2563eb', id = 'arrow') =>
    `<defs><marker id="${id}" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 Z" fill="${color}"/></marker></defs>`;

  // 坐標平面：回傳 {svg內容, X, Y, xmin, xmax, ymin, ymax, w, h, x0, y0}
  const plane = (opt = {}) => {
    const { x0 = 50, y0 = 30, w = 340, h = 240, xmin = -5, xmax = 5, ymin = -4, ymax = 4, step = 1, xLabel = 'x', yLabel = 'y', isComplex = false } = opt;
    const sx = w / (xmax - xmin), sy = h / (ymax - ymin);
    const X = mx => x0 + (mx - xmin) * sx;
    const Y = my => y0 + (ymax - my) * sy;
    let g = `<rect x="${x0}" y="${y0}" width="${w}" height="${h}" fill="#fff" stroke="none"/>`;
    // 格線
    for (let x = Math.ceil(xmin); x <= xmax; x += step) {
      const px = X(x);
      g += `<line x1="${px}" y1="${y0}" x2="${px}" y2="${y0 + h}" stroke="${x === 0 ? '#b0bccf' : '#edf2f9'}" stroke-width="${x === 0 ? 0 : 1}"/>`;
    }
    for (let y = Math.ceil(ymin); y <= ymax; y += step) {
      const py = Y(y);
      g += `<line x1="${x0}" y1="${py}" x2="${x0 + w}" y2="${py}" stroke="${y === 0 ? '#b0bccf' : '#edf2f9'}" stroke-width="${y === 0 ? 0 : 1}"/>`;
    }
    // 坐標軸
    const y0pos = Math.max(y0, Math.min(y0 + h, Y(0)));
    const x0pos = Math.max(x0, Math.min(x0 + w, X(0)));
    g += `<line x1="${x0}" y1="${y0pos}" x2="${x0 + w}" y2="${y0pos}" stroke="#475569" stroke-width="2" marker-end="url(#axArrow)"/>`;
    g += `<line x1="${x0pos}" y1="${y0 + h}" x2="${x0pos}" y2="${y0}" stroke="#475569" stroke-width="2" marker-end="url(#axArrow)"/>`;
    
    // 軸標籤
    const xl = isComplex ? 'Re' : xLabel;
    const yl = isComplex ? 'Im' : yLabel;
    g += `<text x="${x0 + w - 4}" y="${y0pos - 8}" text-anchor="end" font-weight="700" font-size="14" fill="#334155">${xl}</text>`;
    g += `<text x="${x0pos + 8}" y="${y0 + 14}" font-weight="700" font-size="14" fill="#334155">${yl}</text>`;

    // 刻度數字
    for (let x = Math.ceil(xmin); x <= xmax; x += step) {
      if (x === 0) continue;
      g += `<text x="${X(x)}" y="${Math.min(y0 + h - 4, y0pos + 15)}" text-anchor="middle" font-size="11" fill="#8c9baa">${x}</text>`;
    }
    for (let y = Math.ceil(ymin); y <= ymax; y += step) {
      if (y === 0) continue;
      const yTxt = isComplex ? (y === 1 ? 'i' : (y === -1 ? '-i' : `${y}i`)) : `${y}`;
      g += `<text x="${Math.max(x0 + 10, x0pos - 6)}" y="${Y(y) + 4}" text-anchor="end" font-size="11" fill="#8c9baa">${yTxt}</text>`;
    }
    g += `<text x="${x0pos - 7}" y="${y0pos + 14}" text-anchor="end" font-size="11" fill="#8c9baa">O</text>`;
    return {
      svg: g, X, Y, xmin, xmax, ymin, ymax, w, h, x0, y0,
      defs: `<defs><marker id="axArrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#475569"/></marker></defs>`
    };
  };

  // 複數平面（Argand 平面）捷徑
  const complexPlane = (opt = {}) => plane(Object.assign({ isComplex: true }, opt));

  // 繪製連續數學函數曲線：P 為 plane 物件，fn 為 f(x)，domain 為 [xmin, xmax]
  const func = (P, fn, domain = null, opt = {}) => {
    const xstart = domain ? domain[0] : P.xmin;
    const xend = domain ? domain[1] : P.xmax;
    const steps = opt.steps || 120;
    const dx = (xend - xstart) / steps;
    const color = opt.color || '#2563eb';
    const width = opt.w || 2.4;
    const dash = opt.dash || '';
    
    let paths = [];
    let cur = [];
    for (let i = 0; i <= steps; i++) {
      const mx = xstart + i * dx;
      let my;
      try {
        my = fn(mx);
      } catch (e) {
        my = NaN;
      }
      if (isNaN(my) || !isFinite(my) || my < P.ymin - 10 || my > P.ymax + 10) {
        if (cur.length > 1) paths.push(cur);
        cur = [];
      } else {
        cur.push([P.X(mx).toFixed(1), P.Y(my).toFixed(1)]);
      }
    }
    if (cur.length > 1) paths.push(cur);

    return paths.map(pts => 
      `<polyline points="${pts.map(p => p.join(',')).join(' ')}" fill="none" stroke="${color}" stroke-width="${width}" ${dash ? `stroke-dasharray="${dash}"` : ''} stroke-linecap="round" stroke-linejoin="round"/>`
    ).join('');
  };

  // 向量箭頭（起點與終點以數學坐標表示）：P 為 plane
  const vector = (P, mx0, my0, mx1, my1, color = '#2563eb', label = '', opt = {}) => {
    const x0 = P.X(mx0), y0 = P.Y(my0);
    const x1 = P.X(mx1), y1 = P.Y(my1);
    const markerId = 'vArr_' + color.replace('#', '');
    const def = `<defs><marker id="${markerId}" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="${color}"/></marker></defs>`;
    let s = def + `<line x1="${x0}" y1="${y0}" x2="${x1}" y2="${y1}" stroke="${color}" stroke-width="${opt.w || 2.5}" marker-end="url(#${markerId})" stroke-linecap="round"/>`;
    s += dot(x1, y1, color, 4);
    if (label) {
      const lx = (x0 + x1) / 2 + (opt.lx || 10);
      const ly = (y0 + y1) / 2 + (opt.ly || -8);
      s += `<text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" font-weight="700" font-size="${opt.fs || 14}" fill="${color}">${label}</text>`;
    }
    return s;
  };

  // 割線繪製：過曲線兩點 P1(x1, f(x1)), P2(x2, f(x2))，自動延伸線段
  const secant = (P, fn, x1, x2, opt = {}) => {
    const y1 = fn(x1), y2 = fn(x2);
    const slope = (y2 - y1) / (x2 - x1);
    const color = opt.color || '#e11d48';
    // 延伸至平面左右邊界
    const lx1 = P.xmin, ly1 = y1 + slope * (lx1 - x1);
    const lx2 = P.xmax, ly2 = y1 + slope * (lx2 - x1);
    
    let s = `<line x1="${P.X(lx1).toFixed(1)}" y1="${P.Y(ly1).toFixed(1)}" x2="${P.X(lx2).toFixed(1)}" y2="${P.Y(ly2).toFixed(1)}" stroke="${color}" stroke-width="${opt.w || 2}" stroke-dasharray="${opt.dash || '5 4'}"/>`;
    // 兩點與標籤
    s += dot(P.X(x1), P.Y(y1), color, 4.5);
    s += dot(P.X(x2), P.Y(y2), color, 4.5);
    if (opt.label1 !== false) s += vlabel(P.X(x1) - 14, P.Y(y1) - 8, opt.label1 || 'P', color, 14);
    if (opt.label2 !== false) s += vlabel(P.X(x2) + 8, P.Y(y2) - 8, opt.label2 || 'Q', color, 14);
    return { svg: s, slope, x1, y1, x2, y2 };
  };

  // 切線繪製：在點 P(x0, f(x0)) 處，斜率為 dfn(x0) 或給定 k
  const tangent = (P, fn, dfn, x0, opt = {}) => {
    const y0 = fn(x0);
    const k = typeof dfn === 'function' ? dfn(x0) : +dfn;
    const color = opt.color || '#059669';
    const lx1 = P.xmin, ly1 = y0 + k * (lx1 - x0);
    const lx2 = P.xmax, ly2 = y0 + k * (lx2 - x0);
    
    let s = `<line x1="${P.X(lx1).toFixed(1)}" y1="${P.Y(ly1).toFixed(1)}" x2="${P.X(lx2).toFixed(1)}" y2="${P.Y(ly2).toFixed(1)}" stroke="${color}" stroke-width="${opt.w || 2.4}"/>`;
    s += dot(P.X(x0), P.Y(y0), color, 5);
    if (opt.label !== false) s += vlabel(P.X(x0) + 8, P.Y(y0) - 8, opt.label || 'T', color, 14);
    return { svg: s, slope: k, x0, y0 };
  };

  // 差商/增量直角三角形（Δx, Δy）：P 為 plane
  const diffTriangle = (P, x0, y0, dx, dy, opt = {}) => {
    const px0 = P.X(x0), py0 = P.Y(y0);
    const px1 = P.X(x0 + dx), py1 = P.Y(y0 + dy);
    const color = opt.color || '#d97706';
    let s = '';
    // 水平段 Δx
    s += `<line x1="${px0}" y1="${py0}" x2="${px1}" y2="${py0}" stroke="${color}" stroke-width="1.8" stroke-dasharray="3 3"/>`;
    // 垂直段 Δy
    s += `<line x1="${px1}" y1="${py0}" x2="${px1}" y2="${py1}" stroke="${color}" stroke-width="1.8" stroke-dasharray="3 3"/>`;
    // 標籤
    s += `<text x="${(px0 + px1) / 2}" y="${py0 + 14}" text-anchor="middle" font-size="12" font-weight="700" fill="${color}">Δx=${dx > 0 ? '+' : ''}${dx.toFixed(2)}</text>`;
    s += `<text x="${px1 + 6}" y="${(py0 + py1) / 2}" font-size="12" font-weight="700" fill="${color}">Δy=${dy > 0 ? '+' : ''}${dy.toFixed(2)}</text>`;
    return s;
  };

  // 黎曼和分割矩形（定積分/面積探索）
  const riemann = (P, fn, a, b, n, opt = {}) => {
    const dx = (b - a) / n;
    const color = opt.color || 'rgba(37,99,235,0.2)';
    const stroke = opt.stroke || '#2563eb';
    const method = opt.method || 'left'; // left | right | mid
    let rects = '';
    let sum = 0;
    for (let i = 0; i < n; i++) {
      const xLeft = a + i * dx;
      const xRight = xLeft + dx;
      let xSample = xLeft;
      if (method === 'right') xSample = xRight;
      else if (method === 'mid') xSample = (xLeft + xRight) / 2;
      const h = fn(xSample);
      sum += h * dx;

      const px0 = P.X(xLeft);
      const px1 = P.X(xRight);
      const rw = Math.abs(px1 - px0);
      const pyTop = P.Y(Math.max(0, h));
      const pyBase = P.Y(0);
      const rh = Math.abs(pyBase - pyTop);
      const rx = Math.min(px0, px1);
      const ry = h >= 0 ? pyTop : pyBase;
      rects += `<rect x="${rx.toFixed(1)}" y="${ry.toFixed(1)}" width="${rw.toFixed(1)}" height="${rh.toFixed(1)}" fill="${color}" stroke="${stroke}" stroke-width="1"/>`;
    }
    return { svg: rects, sum, dx, n };
  };

  // MathJax 公式卡（HTML）
  const fbox = (rows, opt = {}) => {
    return `<div style="width:100%;display:flex;flex-direction:column;gap:${opt.gap || 12}px;align-items:center;justify-content:center">` +
      rows.map(r => {
        const ac = r.color || '#2563eb';
        return `<div style="width:${r.w || opt.w || '90%'};background:${r.fill || '#fff'};border:1.5px solid ${r.border || '#dce3ee'};border-radius:14px;padding:${r.pad || '11px 16px'};text-align:center;box-shadow:0 4px 14px rgba(30,42,68,.06)">` +
          (r.label ? `<div style="font-size:12px;font-weight:900;letter-spacing:.04em;color:${ac};margin-bottom:3px">${r.label}</div>` : '') +
          `<div style="font-size:${r.size || 17}px;color:#172033">\\(${r.tex}\\)</div>` +
          (r.note ? `<div style="font-size:12.5px;color:#657187;margin-top:4px">${r.note}</div>` : '') +
          `</div>`;
      }).join('') + `</div>`;
  };

  // 步驟講解器
  const stepper = (h, vb, steps, opt = {}) => {
    const acc = opt.acc !== false;
    const N = steps.length;
    h.innerHTML = `<div style="width:100%;text-align:center">
      <svg viewBox="${vb}" style="max-width:100%"><g class="stepg"></g></svg>
      <div class="ictrl">
        <div class="step-txt"></div>
        <label>步驟 <span class="ival stepv">1</span> / ${N}　<span class="step-hint">→ 拖滑桿逐步探究</span></label>
        <input class="steps-r" type="range" min="0" max="${N}" step="0.01" value="1">
      </div></div>`;
    const g = h.querySelector('.stepg'), txt = h.querySelector('.step-txt'),
      vEl = h.querySelector('.stepv'), sl = h.querySelector('.steps-r');
    const draw = () => {
      const v = +sl.value;
      const i = Math.max(0, Math.min(N - 1, Math.ceil(v) - 1));
      const k = Math.max(0, Math.min(1, v - i));
      vEl.textContent = i + 1;
      txt.innerHTML = `<b>步驟 ${i + 1}</b>｜${steps[i].t || ''}`;
      let s = '';
      if (acc) for (let j = 0; j < i; j++) { if (steps[j].d) s += steps[j].d(1); }
      if (steps[i].d) s += steps[i].d(k);
      g.innerHTML = s;
    };
    sl.oninput = draw; draw();
  };

  // 隨堂形成性評量卡片（課堂互動選擇題 / 概念辨析）
  const quiz = (h, qData) => {
    const { q, options, ans, explain } = qData;
    const quizId = 'qz_' + Math.random().toString(36).slice(2, 7);
    h.innerHTML = `
      <div class="quiz-card" id="${quizId}" style="width:92%;margin:0 auto;background:#fff;border-radius:14px;padding:16px 20px;box-shadow:0 4px 16px rgba(0,0,0,0.06);border:1.5px solid #e2e8f0">
        <div style="font-size:13px;font-weight:900;color:#059669;letter-spacing:0.05em;margin-bottom:8px">📝 隨堂即問即答 · 概念檢測</div>
        <div style="font-size:16px;font-weight:700;color:#1e293b;line-height:1.5;margin-bottom:14px">${q}</div>
        <div class="quiz-options" style="display:flex;flex-direction:column;gap:8px">
          ${options.map((opt, idx) => `
            <button class="quiz-opt-btn" data-idx="${idx}" style="text-align:left;padding:10px 14px;border-radius:8px;border:1.5px solid #cbd5e1;background:#f8fafc;font-size:15px;cursor:pointer;transition:all .18s;color:#334155">
              ${opt}
            </button>
          `).join('')}
        </div>
        <div class="quiz-feedback" style="display:none;margin-top:14px;padding:12px 14px;border-radius:8px;font-size:14px;line-height:1.5"></div>
      </div>
    `;
    const box = h.querySelector(`#${quizId}`);
    const btns = box.querySelectorAll('.quiz-opt-btn');
    const fb = box.querySelector('.quiz-feedback');

    btns.forEach(btn => {
      btn.onclick = () => {
        const chosen = +btn.dataset.idx;
        const isRight = chosen === ans;
        btns.forEach(b => {
          b.disabled = true;
          const idx = +b.dataset.idx;
          if (idx === ans) {
            b.style.background = '#dcfce7';
            b.style.borderColor = '#16a34a';
            b.style.color = '#15803d';
            b.style.fontWeight = 'bold';
          } else if (idx === chosen) {
            b.style.background = '#fee2e2';
            b.style.borderColor = '#dc2626';
            b.style.color = '#b91c1c';
          }
        });
        fb.style.display = 'block';
        if (isRight) {
          fb.style.background = '#f0fdf4';
          fb.style.color = '#166534';
          fb.style.border = '1px solid #86efac';
          fb.innerHTML = `<b>🎉 回答正確！</b><div style="margin-top:4px">${explain || ''}</div>`;
        } else {
          fb.style.background = '#fef2f2';
          fb.style.color = '#991b1b';
          fb.style.border = '1px solid #fca5a5';
          fb.innerHTML = `<b>💡 再想想看：</b><div style="margin-top:4px">${explain || ''}</div>`;
        }
        if (window.MJ) window.MJ(box);
      };
    });
    if (window.MJ) window.MJ(box);
  };

  return {
    pt, angleOf, arcPoints, angle, rightAngle, ticks, dot, vlabel, seg, poly,
    arrowDefs, plane, complexPlane, func, vector, secant, tangent, diffTriangle,
    riemann, fbox, stepper, quiz, RAD
  };
})();

// 互動視覺更新後，重新排版該區塊的 MathJax
window.MJ = (el) => {
  if (window.MathJax && MathJax.typesetPromise) {
    MathJax.typesetPromise(el ? [el] : undefined).catch(() => {});
  }
};
