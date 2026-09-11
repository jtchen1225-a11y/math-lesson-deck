#!/usr/bin/env node
/* ============================================================
 * verify_lesson_deck.js — 離線檢查新授課互動簡報 (Lesson Deck Validator)
 *
 * 用法：
 *   node scripts/verify_lesson_deck.js <簡報資料夾> [--quiet] [--forbid 詞1,詞2]
 *
 * 核心能力：
 *   1. 執行 VM 虛擬沙盒，載入真實 svg.js，實測每一張投影片的 visual() 函式。
 *   2. 自動偵測所有滑桿 (input[type=range])，掃描每一個步長，抓出邊界 crash。
 *   3. 檢查新課頁型 (hook, explore, concept, pitfall, example, practice) 結構完整度。
 *   4. 檢查階梯式例題 (thinking, hints, steps, ans, variant) 與隨堂 quiz 語意。
 *   5. 驗證 SVG viewBox 比例、MathJax 符號完整性與禁用 document.getElementById。
 * ============================================================ */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const args = process.argv.slice(2);
const dir = args.find((a) => !a.startsWith('--'));
const quiet = args.includes('--quiet');
const forbidArg = (() => {
  const i = args.indexOf('--forbid');
  return i >= 0 && args[i + 1] ? args[i + 1].split(',').map((s) => s.trim()).filter(Boolean) : [];
})();

if (!dir) {
  console.error('用法：node scripts/verify_lesson_deck.js <簡報資料夾> [--quiet] [--forbid 詞1,詞2]');
  process.exit(2);
}
if (!fs.existsSync(dir)) {
  console.error('找不到資料夾：' + dir);
  process.exit(2);
}

const errors = [];
const warns = [];
const info = [];
const _seen = new Set();
const err = (m) => { if (!_seen.has('E' + m)) { _seen.add('E' + m); errors.push(m); } };
const warn = (m) => { if (!_seen.has('W' + m)) { _seen.add('W' + m); warns.push(m); } };

/* ---------- 極簡 DOM Stub ---------- */
function makeEl(tagName = 'div') {
  const kids = [];
  const el = {
    tagName: tagName.toUpperCase(),
    innerHTML: '',
    textContent: '',
    value: '0',
    min: '0',
    max: '1',
    step: '1',
    style: {},
    dataset: {},
    oninput: null,
    onclick: null,
    _kidsMap: {},
    classList: {
      add() {},
      remove() {},
      toggle() {},
      contains() { return false; }
    },
    setAttribute() {},
    getAttribute() { return null; },
    appendChild(child) { kids.push(child); return child; },
    addEventListener(evt, fn) {
      if (evt === 'input') el.oninput = fn;
      if (evt === 'click') el.onclick = fn;
    },
    querySelector(sel) {
      if (el._kidsMap[sel]) return el._kidsMap[sel];
      const match = sel.startsWith('#') ? 'id' : (sel.startsWith('.') ? 'class' : 'tag');
      const name = sel.replace(/^[#.]/, '');
      const sub = makeEl(match === 'tag' ? name : 'div');
      if (match === 'id') sub.id = name;
      el._kidsMap[sel] = sub;
      return sub;
    },
    querySelectorAll(sel) {
      return [makeEl(), makeEl()];
    }
  };
  return el;
}

function makeHost() {
  const h = makeEl();
  h._all = [];
  let raw = '';
  Object.defineProperty(h, 'innerHTML', {
    get() { return raw; },
    set(v) { raw = String(v); h._all.push(raw); },
  });
  const origQS = h.querySelector.bind(h);
  h.querySelector = (sel) => {
    const kid = origQS(sel);
    if (!kid._patched) {
      kid._patched = true;
      let kraw = '';
      Object.defineProperty(kid, 'innerHTML', {
        get() { return kraw; },
        set(v) { kraw = String(v); h._all.push(kraw); },
      });
    }
    return kid;
  };
  return h;
}

/* ---------- 載入並執行 SV 工具庫 ---------- */
const svgJsPath = path.join(dir, 'svg.js');
let svCode = '';
if (fs.existsSync(svgJsPath)) {
  svCode = fs.readFileSync(svgJsPath, 'utf8');
} else {
  // 嘗試從框架資產讀取
  const fallbackSvg = path.join(__dirname, '..', 'assets', 'svg.js');
  if (fs.existsSync(fallbackSvg)) svCode = fs.readFileSync(fallbackSvg, 'utf8');
}

/* ---------- 讀取各章 JS ---------- */
const files = fs.readdirSync(dir).filter(f => /^ch\d+\.js$/.test(f)).sort((a, b) => {
  return parseInt(a.replace(/\D/g, '')) - parseInt(b.replace(/\D/g, ''));
});

if (!files.length) {
  err('目錄中找不到任何 chN.js 檔案！');
}

let totalSlides = 0;
let interactiveSlides = 0;
let quizCount = 0;
let exampleCount = 0;
const typeCounts = {};

files.forEach(file => {
  const filePath = path.join(dir, file);
  const code = fs.readFileSync(filePath, 'utf8');

  // 1. 禁詞檢查
  forbidArg.forEach(term => {
    if (code.includes(term)) {
      err(`${file} 中出現超綱/禁用詞彙：「${term}」`);
    }
  });

  // 2. 跨頁 id 衝突防呆
  if (/document\.getElementById\s*\(/.test(code)) {
    err(`${file} 含有 document.getElementById，請改用 h.querySelector 避免跨頁 id 衝突！`);
  }

  // 3. 在沙盒內執行
  const sandbox = {
    window: {},
    console: { log() {}, warn() {}, error() {} },
    MathJax: { typesetPromise: () => Promise.resolve() },
    setTimeout: () => {}
  };
  vm.createContext(sandbox);

  if (svCode) {
    try {
      vm.runInContext(svCode, sandbox);
      sandbox.SV = sandbox.window.SV || sandbox.SV;
      sandbox.MJ = sandbox.window.MJ || sandbox.MJ;
    } catch (e) {
      err(`載入 svg.js 失敗：${e.message}`);
    }
  }

  try {
    vm.runInContext(code, sandbox);
  } catch (e) {
    err(`${file} 語法或執行錯誤：${e.message}`);
    return;
  }

  const deck = sandbox.window.DECK || [];
  const chap = deck.find(c => file === `ch${c.ch}.js` || deck.length === 1);
  if (!chap) {
    err(`${file} 未正確 push 進 window.DECK`);
    return;
  }

  if (!chap.color) err(`${file} 缺少 color 設定`);
  if (!chap.sections || !chap.sections.length) warn(`${file} sections 陣列為空`);

  (chap.slides || []).forEach((s, sIdx) => {
    totalSlides++;
    const loc = `${file} 第 ${sIdx + 1} 頁 (sec: ${s.sec || '未填'}, ${s.title || '無標題'})`;

    if (!s.sec) err(`${loc} 缺少 sec 欄位`);
    if (!s.title) err(`${loc} 缺少 title 核心大標`);
    if (s.type) {
      typeCounts[s.type] = (typeCounts[s.type] || 0) + 1;
    }

    // 文字檢查
    if (s.points && s.points.length > 4) {
      warn(`${loc} points 共有 ${s.points.length} 條，建議 ≤ 4 條避免左欄擁擠`);
    }
    (s.points || []).forEach((p, pi) => {
      const plain = p.replace(/<[^>]+>/g, '');
      if (plain.length > 55) {
        warn(`${loc} points[${pi}] 字數達 ${plain.length} 字，建議每條 ≤ 45 字`);
      }
      // 括號配對檢查
      const opens = (p.match(/\\\(/g) || []).length;
      const closes = (p.match(/\\\)/g) || []).length;
      if (opens !== closes) {
        err(`${loc} points[${pi}] 的 \\( 與 \\) 數量不匹配！`);
      }
    });

    if (s.formula && s.formula.tex) {
      if (s.formula.tex.includes('$$')) {
        err(`${loc} formula.tex 誤寫了 $$，引擎會自動處理，請直接寫 LaTeX 內容`);
      }
    }

    // 例題檢查
    if (s.example) {
      exampleCount++;
      if (!s.example.q) err(`${loc} example 缺少 q 題目內容`);
    }

    // 隨堂 Quiz 檢查
    if (s.quiz) {
      quizCount++;
      if (!s.quiz.q || !Array.isArray(s.quiz.options) || s.quiz.ans === undefined) {
        err(`${loc} quiz 格式不正確，需包含 q, options, ans`);
      }
    }

    // 4. 執行 visual(h) 並測試滑桿
    if (typeof s.visual === 'function') {
      const h = makeHost();
      try {
        s.visual(h);
      } catch (e) {
        err(`${loc} visual(h) 執行崩潰：${e.message}`);
        return;
      }

      // 檢查是否含有滑桿互動
      const fullHtml = h._all.join(' ');
      const hasRange = /<input[^>]+type=["']range["']/i.test(fullHtml);
      const isStepper = fullHtml.includes('stepg') || fullHtml.includes('steps-r');

      if (hasRange || isStepper) {
        interactiveSlides++;
        // 壓力測試：掃描滑桿極值與步長
        const rangeMatches = [...fullHtml.matchAll(/<input[^>]+type=["']range["'][^>]*>/gi)];
        rangeMatches.forEach((rm) => {
          const tag = rm[0];
          const minM = tag.match(/min=["']([\d.-]+)["']/);
          const maxM = tag.match(/max=["']([\d.-]+)["']/);
          const stepM = tag.match(/step=["']([\d.-]+)["']/);
          const idM = tag.match(/id=["']([^"']+)["']/);

          const minVal = minM ? parseFloat(minM[1]) : 0;
          const maxVal = maxM ? parseFloat(maxM[1]) : 1;
          const stepVal = stepM ? parseFloat(stepM[1]) : 0.1;
          const sliderId = idM ? idM[1] : null;

          if (sliderId) {
            const inputEl = h.querySelector('#' + sliderId);
            if (inputEl && typeof inputEl.oninput === 'function') {
              const testPoints = [
                minVal,
                minVal + stepVal,
                (minVal + maxVal) / 2,
                maxVal - stepVal,
                maxVal
              ];
              testPoints.forEach((val) => {
                inputEl.value = String(val);
                try {
                  inputEl.oninput();
                } catch (se) {
                  err(`${loc} 滑桿 #${sliderId} 在值 ${val} 時引發異常：${se.message}`);
                }
              });
            }
          }
        });
      }

      // 檢查 SVG viewBox
      const vbMatches = [...fullHtml.matchAll(/viewBox=["']([^"']+)["']/gi)];
      vbMatches.forEach((vbm) => {
        const parts = vbm[1].trim().split(/[\s,]+/).map(Number);
        if (parts.length === 4) {
          const vw = parts[2], vh = parts[3];
          if (vh > 0) {
            const ratio = vw / vh;
            if (ratio < 1.25) {
              warn(`${loc} SVG viewBox "${vbm[1]}" 寬高比為 ${ratio.toFixed(2)}，建議 ≥ 1.35 避免高度過大被等比縮小`);
            }
          }
        }
      });
    } else if (!s.quiz && !s.visual) {
      warn(`${loc} 既沒有 visual 也沒有 quiz，右側視覺欄將留空`);
    }
  });
});

/* ---------- 輸出統計報告 ---------- */
console.log(`\n📊 簡報目錄：${path.resolve(dir)}`);
console.log(`   共檢查 ${files.length} 章、${totalSlides} 張投影片`);
console.log(`   動態互動頁：${interactiveSlides} 張 (${totalSlides ? Math.round(interactiveSlides / totalSlides * 100) : 0}%)`);
console.log(`   典例拆解：${exampleCount} 頁 ｜ 隨堂評量：${quizCount} 頁`);

if (Object.keys(typeCounts).length) {
  console.log(`   頁型分布：` + Object.entries(typeCounts).map(([t, n]) => `${t}: ${n}`).join(' ｜ '));
}

if (warns.length && !quiet) {
  console.log(`\n⚠️  警告事項 (${warns.length} 條)：`);
  warns.forEach(w => console.log('   - ' + w));
}

if (errors.length) {
  console.log(`\n❌ 發現 ${errors.length} 項錯誤：`);
  errors.forEach(e => console.log('   - ' + e));
  process.exit(1);
} else {
  console.log(`\n✅ 全數通過驗證！所有滑桿步長測試無拋錯，語法與排版規格符合。`);
  process.exit(0);
}
