/* =========================================================
   content-check.mjs — copy regression tests for the portfolio

   The site states facts about itself in prose ("forty tools", "eleven
   projects", "based in Cairo") while the facts themselves live in data.js.
   Prose and data drift apart silently. This script re-derives every claim
   from the data and fails loudly when they disagree.

   Run:  node tools/content-check.mjs
   ========================================================= */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (rel) => readFileSync(join(ROOT, rel), 'utf8');

/* ---------- load the browser scripts in a minimal fake DOM ---------- */
function loadBrowserScripts(files) {
  const win = {};
  const noop = () => {};
  const doc = {
    readyState: 'loading',          // keeps i18n.js from applying on load
    documentElement: { dataset: {}, lang: 'en', dir: 'ltr' },
    querySelector: () => null,
    querySelectorAll: () => [],
    addEventListener: noop,
    dispatchEvent: noop,
  };
  const storage = { getItem: () => null, setItem: noop, removeItem: noop };
  const loc = { search: '', href: 'https://example.test/' };

  for (const f of files) {
    new Function('window', 'document', 'localStorage', 'location', 'CustomEvent', read(f))
      (win, doc, storage, loc, class CustomEvent {});
  }
  return win;
}

const win  = loadBrowserScripts(['js/i18n.js', 'js/data.js']);
const I18N = win.I18N;
const DATA = win.PORTFOLIO_DATA;
const html = read('index.html');

/* ---------- tiny assertion harness ---------- */
const failures = [];
const check = (name, ok, detail = '') => {
  if (!ok) failures.push(`${name}${detail ? ` — ${detail}` : ''}`);
};

/* ---------- 1. dictionary parity ---------- */
{
  const en = Object.keys(I18N.en);
  const ar = Object.keys(I18N.ar);
  const missingAr = en.filter(k => !ar.includes(k));
  const missingEn = ar.filter(k => !en.includes(k));
  check('every EN key has an AR translation', !missingAr.length, missingAr.join(', '));
  check('every AR key has an EN original',    !missingEn.length, missingEn.join(', '));

  for (const [lang, dict] of Object.entries(I18N)) {
    for (const [k, v] of Object.entries(dict)) {
      check(`${lang}.${k} is a non-empty string`, typeof v === 'string' && v.trim().length > 0);
      // "|word|" wraps a span in <em> — an odd count means an unclosed marker
      check(`${lang}.${k} has balanced | markers`, (v.split('|').length - 1) % 2 === 0, v);
    }
  }
}

/* ---------- 2. every data-i18n key in the markup exists ---------- */
{
  const keys = [...html.matchAll(/data-i18n(?:-placeholder)?="([^"]+)"/g)].map(m => m[1]);
  const unknown = [...new Set(keys)].filter(k => !(k in I18N.en) || !(k in I18N.ar));
  check('every data-i18n key in index.html is translated', !unknown.length, unknown.join(', '));
}

/* ---------- 3. numeric claims match the data ---------- */
const toolCount    = DATA.skills.reduce((n, s) => n + s.tags.length, 0);
const categoryCount = DATA.skills.length;
const projectCount = DATA.projects.length;
const credCount    = DATA.certifications.length;

// spelled-out forms the copy is allowed to use, per count
const EN_WORD = { 6: 'six', 11: 'eleven', 39: 'thirty-nine' };
const AR_WORD = { 6: 'ست', 11: 'أحد عشر', 39: 'تسع وثلاثون' };
const AR_DIGIT = n => String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[+d]);

const word = (map, n, label) => {
  if (!(n in map)) failures.push(`no spelled-out form registered for ${label} = ${n} (add it to content-check.mjs)`);
  return map[n] || `«${n}»`;
};

const claims = [
  ['en', 'cap.body',      word(EN_WORD, toolCount, 'tool count')],
  ['en', 'cap.body',      word(EN_WORD, categoryCount, 'category count')],
  ['en', 'phase3.body',   word(EN_WORD, toolCount, 'tool count')],
  ['en', 'phase4.body',   word(EN_WORD, projectCount, 'project count')],
  ['en', 'avatar.badge2', String(projectCount)],
  ['ar', 'cap.body',      word(AR_WORD, toolCount, 'tool count')],
  ['ar', 'phase3.body',   word(AR_WORD, toolCount, 'tool count')],
  ['ar', 'phase4.body',   word(AR_WORD, projectCount, 'project count')],
  ['ar', 'avatar.badge2', AR_DIGIT(projectCount)],
];
for (const [lang, key, expected] of claims) {
  const value = I18N[lang][key] || '';
  check(`${lang}.${key} states "${expected}"`, value.toLowerCase().includes(expected.toLowerCase()), value);
}

// the About counters are hard-coded in the markup
{
  // read each counter by the label it sits next to, so a right number under the
  // wrong label still fails
  const counterFor = (labelKey) => {
    const li = html.split('<li>').find(chunk => chunk.includes(`data-i18n="${labelKey}"`));
    const m = li && li.match(/data-count="(\d+)"/);
    return m ? +m[1] : null;
  };
  check('about counter: projects matches data', counterFor('stat.projects') === projectCount,
    `markup says ${counterFor('stat.projects')}, data has ${projectCount}`);
  check('about counter: credentials matches data', counterFor('stat.creds') === credCount,
    `markup says ${counterFor('stat.creds')}, data has ${credCount}`);

  // "years on the job" must survive a recruiter subtracting the dates in the
  // experience timeline — so add the roles up instead of trusting the number.
  const MONTHS = { jan:0,feb:1,mar:2,apr:3,may:4,jun:5,jul:6,aug:7,sep:8,oct:9,nov:10,dec:11 };
  const stamp = (part, fallbackMonth) => {
    const m = part.trim().toLowerCase().match(/([a-z]{3,})?\s*(20\d{2})/);
    if (!m) return null;
    return { y: +m[2], m: m[1] ? (MONTHS[m[1].slice(0, 3)] ?? fallbackMonth) : fallbackMonth };
  };
  let months = 0;
  for (const role of DATA.experience) {
    const [from, to = from] = role.date.split(/[–—-]/);
    const a = stamp(from, 0);
    const b = /present|now|current|ongoing/i.test(to) ? { y: new Date().getFullYear(), m: new Date().getMonth() } : stamp(to, 11);
    if (a && b) months += (b.y - a.y) * 12 + (b.m - a.m) + 1;   // inclusive
  }
  const worked = Math.floor(months / 12);
  check('about counter: years matches the timeline', counterFor('stat.years') === worked,
    `markup claims ${counterFor('stat.years')}, but the roles in data.js add up to ${months} months (${worked} years)`);
}

/* ---------- 4. one home town, everywhere ---------- */
{
  const files = ['index.html', 'js/i18n.js', 'js/data.js', 'js/main.js', 'js/effects.js', 'README.md'];
  // comments aren't user-visible copy — blank them out but keep line numbers
  const blank = m => m.replace(/[^\n]/g, ' ');
  const stripComments = (src) => src
    .replace(/\/\*[\s\S]*?\*\//g, blank)
    .replace(/<!--[\s\S]*?-->/g, blank)
    .replace(/^\s*\/\/.*$/gm, blank);

  const strays = [];
  for (const f of files) {
    stripComments(read(f)).split('\n').forEach((line, i) => {
      if (!/\bCairo\b|القاهرة/.test(line)) return;
      // legitimate: the timezone identifier and the Arabic clock label
      if (/Africa\/Cairo|timeZone|بتوقيت القاهرة|Cairo timezone/.test(line)) return;
      strays.push(`${f}:${i + 1} ${line.trim().slice(0, 90)}`);
    });
  }
  check('no stray "Cairo" outside the timezone/clock', !strays.length, '\n    ' + strays.join('\n    '));
}

/* ---------- 5. credential statuses have labels in both languages ---------- */
{
  const statuses = [...new Set(DATA.certifications.map(c => c.status).filter(Boolean))];
  const missing = statuses.filter(s => !I18N.en[`cred.status.${s}`] || !I18N.ar[`cred.status.${s}`]);
  check('every credential status has a label', !missing.length, missing.join(', '));
}

/* ---------- 6. skill badges only credit real usage ---------- */
{
  // mirrors lookupTechCount() in main.js — word-set containment, not substring
  const words = s => new Set(String(s).toLowerCase().split(/[^a-z0-9+#.]+/i).filter(Boolean));
  const covers = (a, b) => [...b].every(w => a.has(w));
  const used = new Map();
  DATA.projects.forEach(p => (p.tech || []).forEach(t => {
    const k = t.toLowerCase().trim();
    used.set(k, (used.get(k) || 0) + 1);
  }));

  const javaProjects = DATA.projects.filter(p => (p.tech || []).some(t => /^java$/i.test(t)));
  let javaBadge = 0;
  for (const [k, v] of used) {
    if (covers(words('java'), words(k)) || covers(words(k), words('java'))) javaBadge = Math.max(javaBadge, v);
  }
  check('"Java" badge equals real Java usage', javaBadge === javaProjects.length,
    `badge would show ${javaBadge}, data has ${javaProjects.length}`);
}

/* ---------- 7. project media referenced by data.js exists ---------- */
{
  const missing = [];
  DATA.projects.forEach(p => (p.gallery || []).forEach(clip => {
    for (const f of [clip.video, clip.poster]) {
      if (!f) continue;
      try { readFileSync(join(ROOT, f)); } catch { missing.push(`${p.title}: ${f}`); }
    }
  }));
  check('every gallery video/poster file exists', !missing.length, missing.join(', '));
}

/* ---------- report ---------- */
if (failures.length) {
  console.error(`\n✗ ${failures.length} content check(s) failed:\n`);
  failures.forEach(f => console.error('  · ' + f));
  console.error('');
  process.exit(1);
}
console.log('✓ all content checks passed'
  + `  (${projectCount} projects · ${toolCount} tools in ${categoryCount} categories · ${credCount} credentials)`);
