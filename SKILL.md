---
name: math-lesson-deck
description: >-
  專為各章節「新課（新授課）」打造的互動視覺化教學簡報引擎與自動轉化技能（純前端、零建置、零 API 金鑰）。
  將數學教科書或章節 PDF，轉化為「一頁一核心、左講觀念引導、右看動態圖解、拖滑桿親手探究」的高中/國中數學新課簡報。
  觸發情境：當使用者說「做新課簡報」、「把這一章做成互動新課」、「章節新課投影片」、「把課本PDF轉成新課教學簡報」、
  「slide-spec-lesson」、「5E探究式簡報」、「教學簡報」、「新授課互動簡報」時觸發。
  內建新課 6 部曲動線（情境引入、動態探索、核心概念、反例辨析、階梯典例、隨堂檢測）、
  高階函數/切線/複數向量繪圖庫、階梯式提示（Thinking/Hints/Steps/Variant）、隨堂評量卡片（Quiz）與課堂授課教具列（雷射筆/畫筆/滿版放大）。
---

# 數學新課互動視覺化簡報框架 (math-lesson-deck / slide-spec-lesson)

一份新課簡報就是一個獨立資料夾，純前端架構，可直接用瀏覽器開或部署至靜態主機（Cloudflare Pages / Netlify / GitHub Pages）：

```
我的新課網站/
├── index.html      # 骨架（封面／目錄／舞台／底部控制列／授課教具列）
├── engine.js       # 新課導覽與渲染引擎（支援階梯式思考、提示、變式與 Quiz）  ← 共用
├── style.css       # 全套樣式（含 6 大頁型標籤、探究導引條、隨堂測驗樣式）   ← 共用
├── svg.js          # 高中動態函數、切線、割線、向量、複平面、微積分幾何庫   ← 共用
└── ch1.js ~ chN.js # 各章節投影片內容（新課 6 部曲探究動線）                  ← 核心編寫處
```

---

## 核心特色與教學架構

### 1. 標準雙欄自適應版面
* **左：概念欄**
  * 章節徽章帶頁型標籤（`type-hook`、`type-explore`、`type-concept`、`type-pitfall`、`type-example`、`type-practice`）。
  * 核心大標題（以探究問句或明確數學命題呈現）。
  * 探究任務導引條（`inquiry`，醒目提示學生拖動滑桿時的觀察重點）。
  * 核心定義/公式卡（MathJax 3 渲染）。
  * 階梯式例題（支援「💡 審題思路」、「🔑 啟發提示」、「顯示解答」、「🎯 變式拓展」分步展開）。
* **右：視覺欄**
  * 原生 SVG 高階數學圖形（支援任意連續函數、動態割線與切線、複平面 Argand 向量、黎曼和分割、微分增量三角形）。
  * 隨堂形成性評量（`SV.quiz`，支援課堂點擊選項即時判定對錯並顯示解析）。
  * 互動控制列（`ictrl`，帶數值 span `ival` 與 range 滑桿）。
  * 步驟推理器（`SV.stepper`，作圖/證明/消元法滑桿逐步演示）。

### 2. 授課現場專用功能
* **一頁一螢幕自動縮放**：內容過長時自動等比縮小，上課投影絕對免捲動。
* **授課教具列**：浮動工具列隨時啟用雷射筆（含拖尾）、5 色螢幕畫筆、橡皮擦、全螢幕切換。
* **黑板級滿版放大**：可將左欄例題或右欄圖解一鍵放大成整頁，字體與圖表等比放大，方便用畫筆直接在上面書寫講解。
* **深連結跳頁**：`#present` 直接進第一頁、`#p=15` 直接跳至特定頁面。

---

## 標準新課 6 部曲動線 (`type`)

每一小節（如 10.1 導數的概念）建議包含以下 6 頁投影片，構成完整的課堂認知閉環：

| 順序 | 頁型 (`type`) | 頁面名稱 | 核心任務與教學法 |
| :---: | :--- | :--- | :--- |
| **1** | `hook` | **情境引入** | 提出物理/幾何/生活問題，引發認知衝突與思考痛點（如：瞬時速度如何計算？） |
| **2** | `explore` | **動態探索** | 讓學生手動拖滑桿（如割線逼近切線），觀察變化趨勢並大膽猜想規律 |
| **3** | `concept` | **新知概念** | 從剛才探索中抽象出數學本質，給出符號記號與嚴謹定義式（$\lim_{\Delta x \to 0}\frac{\Delta y}{\Delta x}$） |
| **4** | `pitfall` | **概念辨析** | 透過反例（如尖點不可導）或易混淆點進行深度辨析，深化概念邊界 |
| **5** | `example` | **典例剖析** | 示範解題通法，提供審題路徑（`thinking`）、啟發提示（`hints`）、變式訓練（`variant`） |
| **6** | `practice` | **隨堂即練** | 課堂形成性評量（`SV.quiz`），即時反饋作答結果，強化記憶 |

---

## 標準作業流程 (SOP)

### 第一步：分析教材 PDF 與規劃章節動線
1. 讀取章節教材 PDF，梳理出：
   * 章、節名稱與課標目標。
   * 概念引導情境（Anchor Problem）。
   * 適合動態互動的探究點（如參數變化、極限逼近、向量疊加）。
   * 核心定義公式與典型例題。
2. 確定本章邊界（刻意不講什麼、不超綱）。

### 第二步：產生新課骨架
使用內建的 Python 生成工具一鍵建立專案資料夾與全套資產：

```bash
python scripts/new_lesson_deck.py --out 導數新課 \
    --title "高中數學 必修第四冊 · 導數的概念與幾何意義" \
    --eyebrow "普通高中教科書 · 數學新授課" \
    --cover-title "第十章 導數" \
    --sub "瞬時變化率 · 割線逼近切線 · 導數的幾何意義" \
    --home "導數新課" \
    --start-btn "開始探索 →" \
    --chapters "導數的概念與運算::10.1.1 瞬時變化率與導數,10.1.2 導數的幾何意義"
```

或使用 PDF 自動解析管線直接提取：
```bash
python scripts/pdf_to_lesson_deck.py --pdf "教材章節.pdf" --out "我的新課簡報"
```

### 第三步：撰寫各章投影片 (`chN.js`)
編輯生成的 `chN.js`。格式詳見 [`references/slide-spec-lesson.md`](references/slide-spec-lesson.md)，互動模式見 [`references/interaction-patterns-lesson.md`](references/interaction-patterns-lesson.md)，幾何函數庫見 [`references/svg-toolkit-lesson.md`](references/svg-toolkit-lesson.md)。

投影片物件範例：
```js
{
  sec: '10.1.2', secName: '導數的幾何意義',
  type: 'explore',
  title: '割線的極限位置即為切線，斜率即為導數',
  inquiry: '請拖動下方滑桿讓點 Q 逼近點 P，觀察割線與其斜率的變化！',
  points: [
    '當割點 \\(Q\\) 沿曲線逼近固定點 \\(P\\) 時，割線繞 \\(P\\) 轉動並趨向切線。',
    '<b>幾何意義</b>：導數 \\(f\'(x_0)\\) 就是切線的<b>斜率</b>。'
  ],
  visual: (h) => {
    h.innerHTML = `<div style="width:100%"><div id="fig"></div>
      <div class="ictrl"><label>割點 Q 橫坐標 ＝ <span class="ival" id="xv">2.5</span></label>
      <input type="range" id="xs" min="1.05" max="3.0" step="0.05" value="2.5"></div></div>`;
    const fn = x => 0.5 * x * x + 0.5;
    const x0 = 1;
    const draw = () => {
      const xq = +h.querySelector('#xs').value;
      const P = SV.plane({ x0: 45, y0: 25, w: 350, h: 220, xmin: -0.5, xmax: 3.5, ymin: -0.5, ymax: 5.5 });
      const curve = SV.func(P, fn, [0, 3.2], { color: C });
      const sec = SV.secant(P, fn, x0, xq, { color: RED });
      const tan = SV.tangent(P, fn, 1.0, x0, { color: GRN });
      h.querySelector('#fig').innerHTML = svg('0 0 440 275', P.defs + P.svg + curve + sec.svg + tan.svg);
    };
    h.querySelector('#xs').oninput = draw; draw();
  }
}
```

### 第四步：離線沙盒驗證 (極端值壓力測試)
每次修改後必須執行驗證：
```bash
node scripts/verify_lesson_deck.js 導數新課
```
* **無須瀏覽器**：在沙盒內真實執行每個 `visual(h)`。
* **自動遍歷所有滑桿的每一個數值**：確保拖到任何極值或小數步長均無 `NaN`、除以零或拋錯。
* 檢查 MathJax `\\(` 配對、viewBox 寬高比 $\ge 1.25$、禁用 `document.getElementById`。

### 第五步：本機預覽與課堂投影
```bash
python -m http.server 8890 --directory 導數新課
```
開啟瀏覽器訪問 `http://localhost:8890`，使用方向鍵 `←` `→` 翻頁、空白鍵下一頁，或側邊欄目錄快速切換。

---

## 新授課硬性規則

1. **一頁只講一個概念**：標題就是這頁要解決的核心問題或定理命題。
2. **動態探索必須有明確任務**：滑桿上方填寫 `inquiry`，引導學生「看什麼、找什麼規律」。
3. **禁用 `document.getElementById`**：視覺欄查找元素一律用 `h.querySelector('#id')`，避免跨頁 DOM 衝突。
4. **例題必須親算驗證**：例題中數值必須自行驗算無誤，並包含審題思考（`thinking`）與隨堂變式（`variant`）。
5. **SVG viewBox 寬高比 $\ge 1.25$**：寬度推薦 $400 \sim 450$、高度 $\le 300$。避免過高圖形導致版面自動過度等比縮小。
6. **改動後同步更新 `index.html` 的 `?v=` 版本號**：避免瀏覽器快取舊的 `chN.js` 導致改動未生效。
7. **全域數學方程式排版保證**：側欄目錄（TOC）、頂部麵包屑與投影片標題若含 `\(...\)` 數學式，引擎一律自動佇列排版為 SVG 方程式；核心公式卡片（`formula`）內建防彈性擠壓與防縱向捲軸，確保長公式完整呈現。
