# math-lesson-deck

> **新授課互動視覺化簡報框架** — 專為高中/國中各章節「新課（新授課）」打造的探究式網頁簡報引擎。
> 純前端、零建置、零 API 金鑰。支援直接作為 Claude Code / Antigravity / Codex Skill 呼叫使用。

---

## 什麼是 math-lesson-deck？

與考前「重點複習」直接給公式口訣不同，**新課（新授課）的本質在於概念建構**。學生需要從生活情境出發，透過親手拖動滑桿觀察動態幾何與函數的變化規律，在認知衝突中形成猜想，進而抽象出嚴謹的形式化定義。

`math-lesson-deck` 建立在成熟的極簡純前端簡報引擎之上，專門擴充了新課 6 部曲動線、高階數學動態繪圖庫與階梯式思維引導。

---

## 核心特色

- **新課 6 部曲探究動線**：
  - `hook`（情境引入）：拋出物理/生活問題與認知矛盾。
  - `explore`（動態探索）：帶有醒目「探究任務導引」，學生手動拖滑桿觀察臨界逼近。
  - `concept`（新知概念）：從探索中抽象出數學本質與定義公式（MathJax 3）。
  - `pitfall`（概念辨析）：透過反例（如尖點不可導）與邊界條件破除思維誤區。
  - `example`（典例剖析）：階梯式思考提示（審題思路 $\to$ 啟發提示 $\to$ 解題步驟 $\to$ 即堂變式）。
  - `practice`（隨堂即練）：隨堂評量即問即答，點擊選項即時判定對錯並顯示解析。
- **高階動態數學繪圖庫 (`svg.js`)**：
  - 任意連續函數曲線平滑繪製（`SV.func`）
  - 動態割線逼近與切線儀（`SV.secant`, `SV.tangent`）
  - 微分增量三角形（`SV.diffTriangle`，標記 $\Delta x, \Delta y$）
  - 複數 Argand 平面與向量運算（`SV.complexPlane`, `SV.vector`）
  - 定積分黎曼和矩形分割（`SV.riemann`）
  - 隨堂互動評量組件（`SV.quiz`）
- **投影授課專用引擎**：
  - **一頁一螢幕自動縮放**：內容過長自動等比縮小，授課投影絕不捲動。
  - **授課教具列**：雷射筆（含淡出拖尾）、5 色螢幕畫筆、橡皮擦、清除筆跡、全螢幕。
  - **黑板級滿版放大**：一鍵將圖解或例題放大成整頁，字體與圖表等比放大，方便用畫筆板書講解。
- **離線極端值壓力測試 (`verify_lesson_deck.js`)**：
  - **無須瀏覽器**：在沙盒內執行每張投影片的 `visual()`，**自動遍歷每個滑桿的每一個數值與步長**，抓出「拖到特定值才會崩潰」的除以零或 NaN 錯誤。

---

## 目錄結構

```
math-lesson-deck/
├── SKILL.md                          # Antigravity / Claude Code 技能規範
├── assets/                           # 核心共用引擎
│   ├── engine.js                     # 導覽與階梯式揭示引擎
│   ├── style.css                     # 樣式表（含 6 大頁型標籤、探究引導、Quiz）
│   ├── svg.js                        # 高中動態函數與幾何繪圖庫
│   └── index.template.html           # 投影片骨架模板
├── references/                       # 規範與手冊
│   ├── slide-spec-lesson.md          # 投影片格式規格全手冊
│   ├── interaction-patterns-lesson.md# 8 大課堂探究互動模式
│   └── svg-toolkit-lesson.md         # SV 工具庫完整 API 手冊
├── scripts/                          # 自動化工具
│   ├── new_lesson_deck.py            # 一鍵生成新課 6 部曲骨架
│   ├── verify_lesson_deck.js         # 離線沙盒與滑桿極值壓力測試
│   └── pdf_to_lesson_deck.py         # 教材章節 PDF 自動提取轉化工具
└── examples/
    └── ch-lesson-example.js          # 高中數學《導數的概念與幾何意義》完整示範
```

---

## 快速開始

### 1. 產生新課骨架
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

### 2. 編輯各章內容
編輯 `chN.js`。完整格式規格見 [`references/slide-spec-lesson.md`](references/slide-spec-lesson.md)，互動寫法見 [`references/interaction-patterns-lesson.md`](references/interaction-patterns-lesson.md)。

```js
{
  sec: '10.1.2', secName: '導數的幾何意義',
  type: 'explore',
  title: '割線的極限位置即為切線，斜率即為導數',
  inquiry: '請拖動下方滑桿讓點 Q 逼近點 P，觀察割線斜率的變化！',
  points: [
    '當割點 \\(Q\\) 沿曲線逼近固定點 \\(P\\) 時，割線繞 \\(P\\) 轉動並趨向切線。',
    '<b>幾何意義</b>：導數 \\(f\'(x_0)\\) 就是切線的<b>斜率</b>。'
  ],
  visual: (h) => {
    // 繪製動態割線與切線
  }
}
```

### 3. 離線嚴格驗證
```bash
node scripts/verify_lesson_deck.js 導數新課
```

### 4. 本機預覽
```bash
python -m http.server 8890 --directory 導數新課
```
開啟 `http://localhost:8890` 即可預覽。使用鍵盤 `←` `→` 翻頁、空白鍵下一頁。

---

## 安裝為 AI Agent 技能 (Skill)

### Claude Code
```bash
git clone https://github.com/mathruffian-dot/math-lesson-deck.git ~/.claude/skills/math-lesson-deck
```

### Google Antigravity
```bash
git clone https://github.com/mathruffian-dot/math-lesson-deck.git ~/.gemini/config/skills/math-lesson-deck
```

### OpenCode / Codex
```bash
git clone https://github.com/mathruffian-dot/math-lesson-deck.git ~/.codex/skills/math-lesson-deck
```

安裝後直接對 AI 說：**「幫我做這一章的新課簡報」**或**「把教科書 PDF 轉成新課互動投影片」**即可自動觸發！

---

## 授權
MIT License
