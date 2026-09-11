# 新課 SVG 工具庫手冊 (svg-toolkit-lesson)

`svg.js` 提供全域物件 `SV`，針對新授課高中數學（幾何、函數、向量、微積分）提供全套高階視覺化與互動元件。所有圖元皆直接回傳原生 SVG 字串片段。

---

## 1. 座標系統與包裝

* **坐標約定**：
  * 一般自繪與 `SV.plane` 輸出均為**螢幕座標**（左上角為原點，y 軸向下）。
  * `SV.func`、`SV.vector`、`SV.secant`、`SV.tangent`、`SV.diffTriangle`、`SV.riemann` 的輸入均為**標準數學座標**（y 向上，原點由 `plane` 決定），內部已自動轉換。
* **標準寬高比例包裝**：
  每個章節自備以下封裝函式，讓 SVG 能等比自適應欄位：
  ```js
  function svg(vb, inner) {
    return `<div style="width:100%;text-align:center"><svg viewBox="${vb}" style="max-width:100%">${inner}</svg></div>`;
  }
  ```

---

## 2. 坐標系與函數圖元

### `SV.plane(opt)`
生成標準平面直角坐標系。
* `opt` 參數：`{ x0: 45, y0: 25, w: 350, h: 225, xmin: -5, xmax: 5, ymin: -4, ymax: 4, step: 1, xLabel: 'x', yLabel: 'y' }`
* 回傳值：`{ svg, X, Y, xmin, xmax, ymin, ymax, defs }`
  * `P.defs`：坐標軸箭頭定義（請務必接在 SVG 開頭）
  * `P.X(mx)` / `P.Y(my)`：將數學坐標 $(mx, my)$ 轉為螢幕像素坐標。

### `SV.complexPlane(opt)`
複數專用平面（Argand 平面）。橫軸自動標記為 $\text{Re}$（實軸），縱軸標記為 $\text{Im}$（虛軸），虛軸刻度帶有 $i, 2i, -i$ 單位記號。

### `SV.func(P, fn, domain, opt)`
平滑繪製任意連續函數曲線。
* `P`：坐標平面物件
* `fn`：JS 數學函式，例如 `x => 0.5 * x * x - 2`、`x => Math.sin(x)`
* `domain`：繪圖區間 `[xmin, xmax]`，預設為 `[P.xmin, P.xmax]`
* `opt`：`{ color: '#2563eb', w: 2.4, steps: 120, dash: '' }`
* 自動處理離散斷點、超出畫布與 NaN，不會產生崩潰。

### `SV.vector(P, mx0, my0, mx1, my1, color, label, opt)`
繪製由 $(mx_0, my_0)$ 指向 $(mx_1, my_1)$ 的向量箭頭，常用於複數 $z=a+bi$ 向量表示或向量平移。

### `SV.secant(P, fn, x1, x2, opt)`
繪製過函數上兩點 $P_1(x_1, f(x_1))$ 與 $P_2(x_2, f(x_2))$ 的割線，並向兩側延伸至畫布邊緣。
* 回傳：`{ svg, slope, x1, y1, x2, y2 }`

### `SV.tangent(P, fn, dfn, x0, opt)`
在點 $(x_0, f(x_0))$ 處繪製切線。`dfn` 可傳入求導函式（如 `x => 2*x`）或直接傳入數值斜率 $k$。
* 回傳：`{ svg, slope, x0, y0 }`

### `SV.diffTriangle(P, x0, y0, dx, dy, opt)`
繪製直角三角形，展示自變量增量 $\Delta x$ 與因變量增量 $\Delta y$，帶虛線邊與文字標籤。

### `SV.riemann(P, fn, a, b, n, opt)`
定積分黎曼和分割長條矩形。
* `opt.method`：`'left'`（左端點）、`'right'`（右端點）、`'mid'`（中點）
* 回傳：`{ svg, sum, dx, n }`

---

## 3. 幾何基礎圖元

| 函式 | 說明 |
| :--- | :--- |
| `SV.seg(x1, y1, x2, y2, color, w, dash)` | 線段 |
| `SV.poly(points, fill, stroke, w)` | 多邊形（頂點陣列 `[[x,y], ...]`） |
| `SV.dot(x, y, color, r)` | 圓點標記 |
| `SV.vlabel(x, y, text, color, fs, opt)` | 頂點文字標籤 |
| `SV.angle(cx, cy, r, d0, d1, color, label, opt)` | 角弧＋角度度數標籤（數學角度，逆時針） |
| `SV.rightAngle(cx, cy, d0, d1, size, color)` | 直角記號 |
| `SV.ticks(x1, y1, x2, y2, n, color, len)` | 邊上相等記號刻度線 |

---

## 4. 教學互動元件

### `SV.fbox(rows, opt)`
MathJax 公式卡片排版。當沒有幾何圖時，使用結構化公式卡填充視覺欄。
```js
h.innerHTML = SV.fbox([
  { label: '定義式', tex: 'z = a + bi', color: C, fill: '#f8fafc', size: 20 },
  { label: '實部虛部', tex: 'a = \\mathrm{Re}(z),\\; b = \\mathrm{Im}(z)', color: GRN, size: 16 }
]);
```

### `SV.stepper(h, vb, steps, opt)`
步驟推理器。包含滑桿與進度展示，適用於作圖、證明、消元法等遞進過程。

### `SV.quiz(h, qData)`
課堂隨堂評量即問即答卡片。
```js
SV.quiz(h, {
  q: '已知複數 \\(z=1-i\\)，則它的模長 \\(|z|\\) 等於？',
  options: ['A. 0', 'B. 1', 'C. \\(\\sqrt{2}\\)', 'D. 2'],
  ans: 2,
  explain: '\\(|z|=\\sqrt{1^2+(-1)^2}=\\sqrt{2}\\)。'
});
```

### `window.MJ(el)`
在動態互動（如滑桿更新時替換了包含 LaTeX 公式內容）後，通知 MathJax 重新局部渲染該節點。
