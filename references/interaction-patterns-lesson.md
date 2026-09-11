# 新課互動模式手冊 (Interaction Patterns for Lesson Decks)

在新授課中，**互動不是拿來「拖著玩」的裝飾，而是學生建立幾何直觀與發現數學規律的思維支架**。
每個互動頁都應設定清晰的「探究任務 (`inquiry`)」，讓學生帶著問題拖動滑桿。

---

## 模式 1：割線極限逼近儀 (Secant to Tangent)

* **適用章節**：導數的概念、瞬時速度、圓的切線、弧長逼近。
* **思維目標**：直觀體驗「動態割線 $\to$ 極限切線」的過程，理解導數是割線斜率的極限。
* **實作要領**：
  * 固定切點 $P(x_0, f(x_0))$，滑桿控制動點 $Q$ 的坐標差值 $\Delta x$。
  * 當 $\Delta x \to 0$ 時，割線自動過渡為紅色切線，斜率數值即時跳動顯示。

```js
visual: (h) => {
  h.innerHTML = `<div style="width:100%"><div id="fig"></div>
    <div class="ictrl"><label>增量 Δx ＝ <span class="ival" id="dxv">1.50</span>　割線斜率 k ＝ <span class="ival" id="kv">3.50</span></label>
    <input type="range" id="dxs" min="0.05" max="2.0" step="0.05" value="1.5"></div></div>`;
  const fn = x => 0.5 * x * x + 0.5;
  const x0 = 1;
  const draw = () => {
    const dx = +h.querySelector('#dxs').value;
    const slope = (fn(x0 + dx) - fn(x0)) / dx;
    h.querySelector('#dxv').textContent = dx.toFixed(2);
    h.querySelector('#kv').textContent = slope.toFixed(2);

    const P = SV.plane({ x0: 45, y0: 25, w: 350, h: 225, xmin: -1, xmax: 4, ymin: -0.5, ymax: 6 });
    const curve = SV.func(P, fn, null, { color: C });
    const sec = SV.secant(P, fn, x0, x0 + dx, { color: RED, label1: 'P(1,1)', label2: 'Q' });
    const tan = SV.tangent(P, fn, 1, x0, { color: GRN, label: '切線 (k=1.00)' });
    const tri = SV.diffTriangle(P, x0, fn(x0), dx, fn(x0 + dx) - fn(x0));
    h.querySelector('#fig').innerHTML = svg('0 0 440 280', P.defs + P.svg + curve + sec.svg + tan.svg + tri);
  };
  h.querySelector('#dxs').oninput = draw; draw();
}
```

---

## 模式 2：曲線滑動切線儀 (Sliding Tangent Visualizer)

* **適用章節**：導數的幾何意義、函數單調性與極值、凹凸性。
* **思維目標**：觀察切線斜率 $f'(x)$ 隨切點位置移動的正負與平緩變化，建立「導函數」的概念。
* **實作要領**：
  * 滑桿控制切點位置 $x$，即時繪製切線並顯示 $k = f'(x)$。
  * 結合顏色提示：斜率大於 0 顯示綠色（遞增），等於 0 顯示金色（極值點），小於 0 顯示紅色（遞減）。

```js
visual: (h) => {
  h.innerHTML = `<div style="width:100%"><div id="fig"></div>
    <div class="ictrl"><label>切點 x₀ ＝ <span class="ival" id="xv">0.0</span>　切線斜率 f'(x₀) ＝ <span class="ival" id="kv">0.0</span></label>
    <input type="range" id="xs" min="-2.2" max="2.2" step="0.1" value="0"></div></div>`;
  const fn = x => x * x * x / 3 - x;
  const dfn = x => x * x - 1;
  const draw = () => {
    const x0 = +h.querySelector('#xs').value;
    const k = dfn(x0);
    h.querySelector('#xv').textContent = x0.toFixed(1);
    h.querySelector('#kv').textContent = k.toFixed(2);

    const P = SV.plane({ x0: 45, y0: 25, w: 350, h: 225, xmin: -3, xmax: 3, ymin: -2.5, ymax: 2.5 });
    const curve = SV.func(P, fn, null, { color: C });
    const tanColor = Math.abs(k) < 0.15 ? AMB : (k > 0 ? GRN : RED);
    const tan = SV.tangent(P, fn, k, x0, { color: tanColor, label: `k=${k.toFixed(2)}` });
    h.querySelector('#fig').innerHTML = svg('0 0 440 280', P.defs + P.svg + curve + tan.svg);
  };
  h.querySelector('#xs').oninput = draw; draw();
}
```

---

## 模式 3：複平面向量幾何儀 (Complex Plane & Argand Diagram)

* **適用章節**：複數的幾何意義、複數模長、複數加減法的平行四邊形法則。
* **思維目標**：建立「複數 $\leftrightarrow$ 複平面點 $\leftrightarrow$ 平面向量」的一一對應，理解幾何運算。
* **實作要領**：
  * 雙滑桿控制實部 $a$ 與虛部 $b$。
  * 即時計算模長 $|z| = \sqrt{a^2+b^2}$，連線直角三角形標記實部與虛部。

```js
visual: (h) => {
  h.innerHTML = `<div style="width:100%"><div id="fig"></div>
    <div class="ictrl"><label>實部 a ＝ <span class="ival" id="av">3</span></label>
    <input type="range" id="as" min="-4" max="4" step="1" value="3">
    <label>虛部 b ＝ <span class="ival" id="bv">2</span>　|z| ＝ <span class="ival" id="modv">3.61</span></label>
    <input type="range" id="bs" min="-3" max="3" step="1" value="2"></div></div>`;
  const draw = () => {
    const a = +h.querySelector('#as').value;
    const b = +h.querySelector('#bs').value;
    const mod = Math.sqrt(a * a + b * b);
    h.querySelector('#av').textContent = a;
    h.querySelector('#bv').textContent = b;
    h.querySelector('#modv').textContent = mod.toFixed(2);

    const P = SV.complexPlane({ x0: 45, y0: 25, w: 350, h: 220, xmin: -5, xmax: 5, ymin: -4, ymax: 4 });
    const vec = SV.vector(P, 0, 0, a, b, C, `z=${a}${b>=0?'+':''}${b}i`);
    // 直角三角形輔助線
    const aux = SV.seg(P.X(a), P.Y(0), P.X(a), P.Y(b), '#94a3b8', 1.5, '4 3') +
                SV.seg(P.X(0), P.Y(0), P.X(a), P.Y(0), '#94a3b8', 1.5, '4 3');
    h.querySelector('#fig').innerHTML = svg('0 0 440 280', P.defs + P.svg + aux + vec);
  };
  h.querySelector('#as').oninput = draw;
  h.querySelector('#bs').oninput = draw;
  draw();
}
```

---

## 模式 4：反例與非可導點探索儀 (Counterexample Explorer)

* **適用章節**：概念辨析、連續性與可導性關係、尖點與不連續點。
* **思維目標**：讓學生親眼看見當自變量從左側與右側逼近時，割線斜率極限不相等（如 $-1 \ne +1$），徹底破除「連續即必定可導」的常見錯誤。

---

## 模式 5：定積分黎曼和分割儀 (Riemann Sum Dissection)

* **適用章節**：定積分的概念、微積分基本定理、曲邊梯形面積。
* **思維目標**：拖動分割等分數 $n$（從 4 增加到 50），看著矩形面積和逐漸貼合平滑曲線，直觀感受「以直代曲、無限逼近」的微積分靈魂。

```js
visual: (h) => {
  h.innerHTML = `<div style="width:100%"><div id="fig"></div>
    <div class="ictrl"><label>分割等分數 n ＝ <span class="ival" id="nv">6</span>　矩形面積和 ＝ <span class="ival" id="sv">2.33</span></label>
    <input type="range" id="ns" min="2" max="30" step="1" value="6"></div></div>`;
  const fn = x => 0.5 * x * x;
  const draw = () => {
    const n = +h.querySelector('#ns').value;
    const P = SV.plane({ x0: 45, y0: 25, w: 350, h: 220, xmin: -0.5, xmax: 3.5, ymin: -0.5, ymax: 5 });
    const r = SV.riemann(P, fn, 0, 3, n, { color: 'rgba(37,99,235,0.22)', stroke: C });
    const curve = SV.func(P, fn, [0, 3.2], { color: '#0f172a', w: 2.6 });
    h.querySelector('#nv').textContent = n;
    h.querySelector('#sv').textContent = r.sum.toFixed(3);
    h.querySelector('#fig').innerHTML = svg('0 0 440 280', P.defs + P.svg + r.svg + curve);
  };
  h.querySelector('#ns').oninput = draw; draw();
}
```

---

## 模式 6：課堂即時形成性評量 (Formative Assessment Quiz)

* **適用章節**：各小節結尾、概念辨析頁、隨堂練習頁。
* **思維目標**：上課時老師投影請全班作答，點擊選項後立即顯示綠色（正確）或紅色（錯誤），並彈出精要解析，營造高互動課堂氛圍。

```js
visual: (h) => {
  SV.quiz(h, {
    q: '已知複數 \\(z=a+bi\\)（\\(a,b\\in\\mathbb{R}\\)），若 \\(|z|=0\\)，則必須滿足什麼條件？',
    options: [
      'A. \\(a=0\\) 且 \\(b=0\\)',
      'B. \\(a=0\\) 或 \\(b=0\\)',
      'C. \\(a^2=b^2\\)'
    ],
    ans: 0,
    explain: '\\(|z|=\\sqrt{a^2+b^2}=0\\)，因為實數平方和為 0，所以必須 \\(a=0\\) 且 \\(b=0\\)。'
  });
}
```
