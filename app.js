"use strict";
/* Inglés de Trabajo · PWA (vanilla JS). Datos en data.js
   Módulo de checo de supervivencia (A0–A1). El campo `en` es el texto
   del idioma que se estudia (inglés o checo). */
const KEY = "ingles-trabajo-v1";
const BLANK = { xp: 0, days: {}, known: {}, sents: {}, goal: 50, lvl: "B1", lang: "en" };

function store() { try { return window.localStorage || null; } catch (e) { return null; } }
function load() {
  try {
    const s = store(); const raw = s && s.getItem(KEY);
    const data = raw ? Object.assign({}, BLANK, JSON.parse(raw)) : Object.assign({}, BLANK);
    if (data.lang !== "en" && data.lang !== "cs") data.lang = "en";
    if (!LEVELS.includes(data.lvl)) data.lvl = "B1";
    if (!data.known || typeof data.known !== "object") data.known = {};
    if (!data.sents || typeof data.sents !== "object") data.sents = {};
    if (!data.days || typeof data.days !== "object") data.days = {};
    if (typeof data.xp !== "number") data.xp = 0;
    return data;
  } catch (e) { return Object.assign({}, BLANK); }
}
function canPersist() { try { const s = store(); s.setItem(KEY + ":t", "1"); s.removeItem(KEY + ":t"); return true; } catch (e) { return false; } }
function persist() { try { store().setItem(KEY, JSON.stringify(save)); } catch (e) {} }
/* Un solo <audio> reutilizado: en iOS Safari el play() tiene que
   arrancar desde el toque del usuario, y crear un Audio nuevo a veces falla. */
let sharedAudio = null;
function getSharedAudio() {
  if (!sharedAudio) {
    sharedAudio = document.getElementById("tts-player") || new Audio();
    sharedAudio.setAttribute("playsinline", "");
    sharedAudio.setAttribute("webkit-playsinline", "");
    sharedAudio.playsInline = true;
    sharedAudio.preload = "auto";
    if (!sharedAudio.isConnected) document.body.appendChild(sharedAudio);
  }
  return sharedAudio;
}
function pickFemaleVoice(lang) {
  if (!("speechSynthesis" in window)) return null;
  const voices = speechSynthesis.getVoices() || [];
  const isEn = /^en/i.test(lang);
  const names = isEn
    ? [/samantha/i, /ava\s*\(.*premium/i, /ava\s*\(.*enhanced/i, /\bava\b/i, /aria/i, /jenny/i, /allison/i, /zoe/i, /nicky/i, /susan/i, /victoria/i, /karen/i, /moira/i, /tessa/i, /fiona/i, /salli/i, /female/i]
    : [/zuzana/i, /vlasta/i, /female/i];
  const langRe = isEn ? /^en/i : /^cs/i;
  const exactRe = isEn ? /^en[-_]US/i : /^cs[-_]CZ/i;
  const pool = voices.filter(v => langRe.test(v.lang));
  for (const re of names) {
    const hit = pool.find(v => re.test(v.name));
    if (hit) return hit;
  }
  return pool.find(v => exactRe.test(v.lang)) || pool[0] || null;
}
function speakFallback(t) {
  try {
    if (!t || !("speechSynthesis" in window)) return;
    const want = isCs() ? "cs-CZ" : "en-US";
    const u = new SpeechSynthesisUtterance(t);
    u.lang = want;
    u.rate = 0.9;
    const v = pickFemaleVoice(want);
    if (v) u.voice = v;
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
  } catch (e) {}
}
function audioSrc(id, kind) {
  const lang = isCs() ? "cs" : "en";
  const suffix = kind === "ex" ? "-ex" : kind === "s" ? "-s" : "";
  return `audio/${lang}/${encodeURIComponent(id)}${suffix}.mp3`;
}
let speakGen = 0;
function speak(t, id, kind) {
  if (!t) return;
  try { if ("speechSynthesis" in window) speechSynthesis.cancel(); } catch (e) {}
  if (!id) { speakFallback(t); return; }
  const el = getSharedAudio();
  const gen = ++speakGen;
  const src = audioSrc(id, kind);
  try { el.pause(); } catch (e) {}
  el.onerror = null;
  el.onplaying = null;
  /* Solo caemos a speechSynthesis si el MP3 no existe de verdad (404/403).
     AbortError (cambio de src, Range interrumpido) y errores transitorios
     no deben disparar la voz robótica del sistema, ni superponerse al MP3. */
  let usedFallback = false;
  const fallbackIfMissing = () => {
    if (gen !== speakGen || usedFallback) return;
    fetch(src).then(r => {
      if (gen !== speakGen || usedFallback) return;
      if (r.status === 404 || r.status === 403) {
        usedFallback = true;
        speakFallback(t);
      }
    }).catch(() => {});
  };
  el.onplaying = () => {
    if (gen !== speakGen) return;
    try { if ("speechSynthesis" in window) speechSynthesis.cancel(); } catch (e) {}
  };
  el.onerror = fallbackIfMissing;
  el.src = src;
  const p = el.play();
  if (p && p.catch) p.catch(err => {
    if (gen !== speakGen) return;
    if (err && err.name === "AbortError") return;
    fallbackIfMissing();
  });
}
const pad = n => String(n).padStart(2, "0");
const keyOf = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const parseKey = k => { const p = k.split("-").map(Number); return new Date(p[0], p[1] - 1, p[2]); };
function streaks(days, today) {
  const active = k => (days[k] || 0) > 0;
  let cur = 0, d = today;
  if (!active(keyOf(d))) d = addDays(d, -1);
  while (active(keyOf(d))) { cur++; d = addDays(d, -1); }
  const keys = Object.keys(days).filter(active).sort();
  let best = 0, run = 0, prev = null;
  keys.forEach(k => { if (prev && keyOf(addDays(prev, 1)) === k) run++; else run = 1; if (run > best) best = run; prev = parseKey(k); });
  return { cur, best: Math.max(best, cur) };
}
function hash(s) { let h = 7; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 100003; return h; }
function shuffle(arr, seed) {
  const a = arr.slice(); let s = (seed * 9301 + 49297) % 233280;
  for (let i = a.length - 1; i > 0; i--) { s = (s * 9301 + 49297) % 233280; const j = Math.floor((s / 233280) * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

let save = load();
const canSave = canPersist();
// Escribe campos nuevos (p. ej. lang) sin tocar el progreso ya guardado.
persist();
const ui = { tab: "inicio", th: "todos", vMode: "tarjetas", sMode: "estudiar",
  fc: { idx: 0, flipped: false, pending: false },
  quiz: null, // {qs, qi, picked, score, done}
  st: { idx: 0, reveal: false, rated: false, id: null },
  wr: { idx: 0, res: null, id: null },
  ch: { idx: 0, picked: null, id: null },
  ord: { idx: 0, pick: [], res: null, id: null },
  sFailedOnly: false };
function resetSub() {
  ui.fc = { idx: 0, flipped: false, pending: ui.fc.pending };
  ui.quiz = null;
  ui.st = { idx: 0, reveal: false, rated: false, id: null };
  ui.wr = { idx: 0, res: null, id: null };
  ui.ch = { idx: 0, picked: null, id: null };
  ui.ord = { idx: 0, pick: [], res: null, id: null };
}

function isCs() { return save.lang === "cs"; }
function langName() { return isCs() ? "checo" : "inglés"; }
function brandName() { return isCs() ? "Checo de Supervivencia" : "Inglés de Trabajo"; }
function thLabelOf(t) { return (isCs() ? CS_TH_LABEL : TH_LABEL)[t]; }
const wordsAll = () => isCs() ? CS_ALL_WORDS.slice() : ALL_WORDS.filter(w => w.lvl === save.lvl);
const sentsAll = () => isCs() ? CS_ALL_SENTS.slice() : ALL_SENTS.filter(s => s.lvl === save.lvl);
const curWords = () => ui.th === "todos" ? wordsAll() : wordsAll().filter(w => w.th === ui.th);
const curSents = () => ui.th === "todos" ? sentsAll() : sentsAll().filter(s => s.th === ui.th);
function setLang(v) {
  if (v !== "en" && v !== "cs") return;
  save.lang = v; persist(); ui.th = "todos"; ui.sFailedOnly = false; resetSub();
}

let toastTimer;
function toast(msg) {
  const el = document.getElementById("toast"); if (!el) return;
  el.textContent = msg; el.classList.add("show"); clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove("show"), 1400);
}
function gain(n) {
  const before = save.days[keyOf(new Date())] || 0;
  const k = keyOf(new Date());
  save = Object.assign({}, save, { xp: save.xp + n, days: Object.assign({}, save.days, { [k]: before + n }) });
  persist(); toast(`+${n} XP`);
  if (before < save.goal && before + n >= save.goal) setTimeout(() => toast("¡Meta del día cumplida! 🎉"), 1500);
}
function markWord(id, k) { const was = !!save.known[id]; save.known = Object.assign({}, save.known, { [id]: k }); gain(k ? (was ? 1 : 5) : 2); }
const MASTER_BOX = 5;
const BOX_DAYS = { 1: 1, 2: 3, 3: 7, 4: 14, 5: 14 };
function sentRec(id) {
  const p = save.sents[id];
  if (p === true) return { box: MASTER_BOX, due: "1970-01-01", reps: 1, lapses: 0 };
  if (p && typeof p === "object") return p;
  return null;
}
function isSentMastered(id) {
  const r = sentRec(id);
  return !!(r && r.box >= MASTER_BOX);
}
function isSentFailed(id) {
  const r = sentRec(id);
  return !!(r && r.grade === "again");
}
function sentStats(list) {
  let mastered = 0, learning = 0, neu = 0;
  for (const s of list) {
    const r = sentRec(s.id);
    if (!r) neu++;
    else if (r.box >= MASTER_BOX) mastered++;
    else learning++;
  }
  return { mastered, learning, neu };
}
function gradeSent(id, grade, xpFirst) {
  const today = keyOf(new Date());
  const prev = sentRec(id);
  const r = prev ? Object.assign({}, prev) : { box: 0, reps: 0, lapses: 0 };
  if (grade === "again") {
    r.box = 1;
    r.due = today;
    r.lapses = (r.lapses || 0) + 1;
  } else if (grade === "hard") {
    r.box = prev && r.box > 1 ? Math.max(1, r.box - 1) : 1;
    r.due = keyOf(addDays(new Date(), 1));
  } else {
    r.box = Math.min(MASTER_BOX, (r.box || 0) + 1);
    r.due = keyOf(addDays(new Date(), BOX_DAYS[r.box] || 1));
  }
  r.reps = (r.reps || 0) + 1;
  r.last = today;
  r.grade = grade;
  save.sents = Object.assign({}, save.sents, { [id]: r });
  persist();
  const firstGood = !prev || prev.grade === "again" || (prev.box || 0) < 2;
  if (grade === "good") gain(firstGood ? (xpFirst || 10) : 2);
  else if (grade === "hard") gain(!prev || prev.grade === "again" ? 5 : 1);
}
function sentOk(id, n) { gradeSent(id, "good", n); }

function foldMarks(s) {
  return String(s)
    .replace(/[\u2018\u2019\u02BC\u00B4`]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/\u2026/g, "...")
    .replace(/\u00A0/g, " ");
}
function expandContractions(s) {
  let t = s;
  t = t.replace(/\bwon't\b/g, "will not");
  t = t.replace(/\bcan't\b/g, "cannot");
  t = t.replace(/\bshan't\b/g, "shall not");
  t = t.replace(/\bain't\b/g, "is not");
  t = t.replace(/\blet's\b/g, "let us");
  t = t.replace(/\bo'clock\b/g, "oclock");
  t = t.replace(/\bi'm\b/g, "i am");
  t = t.replace(/\b([a-z]+)'re\b/g, "$1 are");
  t = t.replace(/\b([a-z]+)'ve\b/g, "$1 have");
  t = t.replace(/\b([a-z]+)'ll\b/g, "$1 will");
  t = t.replace(/\b([a-z]+)'d\b/g, "$1 would");
  t = t.replace(/\b([a-z]+)n't\b/g, "$1 not");
  t = t.replace(/\b([a-z]+)'s\b/g, "$1 is");
  t = t.replace(/\bcan not\b/g, "cannot");
  const bare = { dont:"do not", doesnt:"does not", didnt:"did not", isnt:"is not", arent:"are not",
    wasnt:"was not", werent:"were not", shouldnt:"should not", wouldnt:"would not", couldnt:"could not",
    mustnt:"must not", wont:"will not", cant:"cannot", aint:"is not", shant:"shall not",
    im:"i am", ive:"i have", youve:"you have", weve:"we have", theyve:"they have",
    youre:"you are", theyre:"they are", thats:"that is", whats:"what is",
    wheres:"where is", theres:"there is", heres:"here is", hows:"how is", whos:"who is" };
  t = t.replace(/\b([a-z]+)\b/g, (m) => bare[m] || m);
  t = t.replace(/\bcan not\b/g, "cannot");
  return t;
}
function normSent(s) {
  let t = foldMarks(s).toLowerCase().normalize("NFC");
  t = expandContractions(t);
  t = t.replace(/[^a-z0-9áéíóúýàèìòùäëïöüçñčďěňřšťžů\s]/g, " ");
  t = t.replace(/\s+/g, " ").trim();
  t = t.replace(/\bcan not\b/g, "cannot");
  return t;
}
function sentAnswers(s) {
  const arr = [s.en];
  if (Array.isArray(s.alts)) arr.push.apply(arr, s.alts);
  if (s.alt) arr.push(s.alt);
  return arr;
}
function levenshtein(a, b) {
  const n = a.length, m = b.length;
  if (!n) return m; if (!m) return n;
  let prev = new Array(m + 1), cur = new Array(m + 1);
  for (let j = 0; j <= m; j++) prev[j] = j;
  for (let i = 1; i <= n; i++) {
    cur[0] = i;
    for (let j = 1; j <= m; j++) {
      cur[j] = a[i - 1] === b[j - 1] ? prev[j - 1] : 1 + Math.min(prev[j], cur[j - 1], prev[j - 1]);
    }
    [prev, cur] = [cur, prev];
  }
  return prev[m];
}
function tokens(s) { return normSent(s).split(" ").filter(Boolean); }
function diffWords(typed, expected) {
  const a = tokens(typed), b = tokens(expected);
  const n = a.length, m = b.length;
  const dp = Array.from({ length: n + 1 }, () => new Array(m + 1));
  for (let i = 0; i <= n; i++) dp[i][0] = i;
  for (let j = 0; j <= m; j++) dp[0][j] = j;
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  const parts = [];
  let i = n, j = m;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) { parts.push({ t: "ok", w: b[j - 1] }); i--; j--; }
    else if (i > 0 && j > 0 && dp[i][j] === dp[i - 1][j - 1] + 1) { parts.push({ t: "bad", w: a[i - 1], e: b[j - 1] }); i--; j--; }
    else if (j > 0 && (i === 0 || dp[i][j] === dp[i][j - 1] + 1)) { parts.push({ t: "miss", w: b[j - 1] }); j--; }
    else { parts.push({ t: "extra", w: a[i - 1] }); i--; }
  }
  parts.reverse();
  return { dist: dp[n][m], parts, aLen: n, bLen: m };
}
function renderDiff(parts) {
  return parts.map(p => {
    if (p.t === "ok") return `<span class="dw ok">${esc(p.w)}</span>`;
    if (p.t === "bad") return `<span class="dw bad" title="Se esperaba: ${esc(p.e)}">${esc(p.w)}</span>`;
    if (p.t === "miss") return `<span class="dw miss">${esc(p.w)}</span>`;
    return `<span class="dw extra">${esc(p.w)}</span>`;
  }).join(" ");
}
function judgeTyped(typed, s) {
  const answers = sentAnswers(s);
  const nt = normSent(typed);
  if (!nt) return { kind: "bad", expected: s.en, typed, parts: [], empty: true };
  let best = null;
  for (const ans of answers) {
    const na = normSent(ans);
    if (na === nt) return { kind: "ok", expected: ans, typed };
    const d = diffWords(typed, ans);
    const lev = levenshtein(nt, na);
    if (!best || lev < best.lev || (lev === best.lev && d.dist < best.d.dist)) best = { ans, d, lev, na };
  }
  const maxLev = Math.max(2, Math.floor(best.na.length * 0.15));
  const wordAlmost = best.d.dist <= 1 && best.d.bLen >= 2;
  const kind = (best.lev <= maxLev || wordAlmost) ? "almost" : "bad";
  return { kind, expected: best.ans, typed, parts: best.d.parts };
}
function sortSents(sents) {
  const today = keyOf(new Date());
  return sents.map((s, i) => {
    const r = sentRec(s.id);
    let p = 3;
    if (!r) p = 2;
    else if (r.grade === "again") p = 0;
    else if (!r.due || r.due <= today) p = 1;
    else if (r.box >= MASTER_BOX) p = 4;
    else p = 3;
    return { s, i, p };
  }).sort((a, b) => a.p - b.p || a.i - b.i).map(x => x.s);
}
function practiceSents(sents) {
  let list = sortSents(sents);
  if (ui.sFailedOnly) list = list.filter(s => isSentFailed(s.id));
  return list;
}
function sentById(id, pool) {
  if (!id) return null;
  if (pool) {
    const hit = pool.find(s => s.id === id);
    if (hit) return hit;
  }
  return sentsAll().find(s => s.id === id) || null;
}
/* Fija la oración en pantalla. Si no, al calificar el SRS reordena el mazo
   y el mismo índice apunta a otra frase: parece que saltó y quedó mal. */
function currentPractice(sents, state) {
  const deck = practiceSents(sents);
  if (state.id) {
    const s = sentById(state.id, sents) || sentById(state.id, deck);
    if (s) return { deck, s, num: state.num || 1, total: state.total || Math.max(deck.length, 1) };
  }
  const list = (state.skipId && deck.length > 1) ? deck.filter(x => x.id !== state.skipId) : deck;
  const pickFrom = list.length ? list : deck;
  if (!pickFrom.length) return { deck, s: null, num: 0, total: 0 };
  const s = pickFrom[0];
  state.id = s.id;
  state.skipId = null;
  state.num = Math.max(1, deck.findIndex(x => x.id === s.id) + 1);
  state.total = deck.length;
  return { deck, s, num: state.num, total: state.total };
}
function advancePractice(state, extra) {
  const skipId = state.id;
  Object.keys(state).forEach(k => { delete state[k]; });
  Object.assign(state, extra || {}, { id: null, skipId });
}
function viewSentStats(all) {
  const st = sentStats(all);
  return `<p class="small center sent-stats"><span class="ok">Dominadas ${st.mastered}</span> · En curso ${st.learning} · Nuevas ${st.neu}</p>
  <label class="tog"><input type="checkbox" data-act="failedOnly" ${ui.sFailedOnly ? "checked" : ""}> Repasar falladas</label>`;
}
function emptyDeckMsg() {
  return `<div class="card center"><div style="font-size:40px">${ui.sFailedOnly ? "🎯" : "💬"}</div><h3>${ui.sFailedOnly ? "No tienes oraciones falladas en esta selección" : "No hay oraciones en esta selección"}</h3><p class="small">${ui.sFailedOnly ? "Quita “Repasar falladas” para seguir practicando." : "Prueba otro tema o nivel."}</p></div>`;
}


/* ---------- vistas ---------- */
const bar = (pct, cls = "") => `<div class="bar ${cls}"><div style="width:${Math.max(0, Math.min(100, pct))}%"></div></div>`;
const spk = (t, id, kind) => `<button type="button" class="spk" data-act="speak" data-t="${esc(t)}" data-id="${esc(id || "")}" data-kind="${esc(kind || "")}" aria-label="Escuchar">🔊 Escuchar</button>`;
const pron = item => item && item.pron ? `<div class="w-pron">${esc(item.pron)}</div>` : "";
function seg(name, opts, val) {
  return `<div class="seg">${opts.map(([v, l]) => `<button class="${v === val ? "on" : ""}" data-act="seg" data-k="${name}" data-v="${v}">${l}</button>`).join("")}</div>`;
}
function themeOptions() {
  const opt = (v, l) => `<option value="${v}" ${v === ui.th ? "selected" : ""}>${l}</option>`;
  if (!isCs()) {
    return opt("todos", "Todos los temas") + THEMES.map(t => opt(t, TH_LABEL[t])).join("");
  }
  const surv = ["saludos", "numeros", "transporte", "compras", "vivienda", "trabajo", "emergencias"];
  const curso = ["curso-1", "curso-2", "curso-3", "curso-4", "curso-5", "curso-6", "curso-7"];
  return opt("todos", "Todos los temas") +
    `<optgroup label="Supervivencia">${surv.map(t => opt(t, CS_TH_LABEL[t])).join("")}</optgroup>` +
    `<optgroup label="Mi curso (Czech Unlocked)">${curso.map(t => opt(t, CS_TH_LABEL[t])).join("")}</optgroup>`;
}
function pickers() {
  const lvl = isCs()
    ? `<p class="small">Nivel: A0–A1 · Supervivencia y tu curso Czech Unlocked · pistas de pronunciación en español</p>`
    : seg("lvl", LEVELS.map(l => [l, LVL_LABEL[l]]), save.lvl);
  return lvl + `<label class="sel">Tema <select data-act="theme">${themeOptions()}</select></label>`;
}

function csStats() {
  const w = CS_ALL_WORDS, s = CS_ALL_SENTS;
  const kw = w.filter(x => save.known[x.id]).length, ks = s.filter(x => isSentMastered(x.id)).length;
  return { kw, tw: w.length, ks, ts: s.length, pct: Math.round((kw + ks) / (w.length + s.length) * 100) };
}

function viewInicio() {
  const now = new Date(), todayKey = keyOf(now), todayXp = save.days[todayKey] || 0, st = streaks(save.days, now);
  const goalPct = Math.min(100, Math.round(todayXp / save.goal * 100)), goalMet = todayXp >= save.goal;
  const cal = []; for (let i = 29; i >= 0; i--) { const d = addDays(now, -i); const k = keyOf(d); cal.push({ k, n: d.getDate(), xp: save.days[k] || 0 }); }
  const practiced = cal.filter(c => c.xp > 0).length;
  const lvlStats = LEVELS.map(l => {
    const w = ALL_WORDS.filter(x => x.lvl === l), s = ALL_SENTS.filter(x => x.lvl === l);
    const kw = w.filter(x => save.known[x.id]).length, ks = s.filter(x => isSentMastered(x.id)).length;
    return { l, kw, tw: w.length, ks, ts: s.length, pct: Math.round((kw + ks) / (w.length + s.length) * 100) };
  });
  const cs = csStats();
  const heroTitle = isCs()
    ? (st.cur > 0 ? `¡Racha de ${st.cur} día${st.cur === 1 ? "" : "s"}!` : "Ahoj! Empieza tu checo hoy")
    : (st.cur > 0 ? `¡Racha de ${st.cur} día${st.cur === 1 ? "" : "s"}!` : "¡Empieza tu racha hoy!");
  const heroP = todayXp > 0 ? "Hoy ya practicaste. ¡Sigue así!" : st.cur > 0 ? "Practica hoy para no perder tu racha." : (isCs() ? "Haz unas tarjetas de checo para encender el fuego." : "Haz unas tarjetas para encender el fuego.");
  return `
  <section class="card hero">
    <div class="flame ${st.cur > 0 ? "lit" : ""}">🔥<b>${st.cur}</b></div>
    <div class="hero-txt">
      <h2>${heroTitle}</h2>
      <p>${heroP}</p>
      ${bar(goalPct, "gold")}
      <p class="small">${todayXp} / ${save.goal} XP hoy · ${goalMet ? "¡Meta del día cumplida! 🎉" : `Te faltan ${save.goal - todayXp} XP`}</p>
    </div>
  </section>
  ${isCs() ? `<p class="hint"><b>Checo de supervivencia (A0–A1)</b> para tu llegada a Chequia, más el vocabulario de <b>Mi curso (Czech Unlocked)</b>. Las pistas se leen como en español. Además: <b>sh</b> como en show, <b>j</b> como jota, <b>rzh</b> es la ř checa, <b>c</b> suena ts, <b>ň</b> como ñ, <b>y</b> suena i, <b>ě</b> suena ye (o nye después de n o m).</p>` : ""}
  <div class="row2">
    <button class="big green" data-act="tab" data-v="vocab">📚 Practicar vocabulario</button>
    <button class="big blue" data-act="tab" data-v="frases">💬 Practicar oraciones</button>
  </div>
  <section class="metrics">
    <div class="m"><b>${save.xp}</b><span>XP total</span></div>
    <div class="m"><b>🔥 ${st.cur}</b><span>Racha actual</span></div>
    <div class="m"><b>🏆 ${st.best}</b><span>Mejor racha</span></div>
    <div class="m"><b>${practiced}/30</b><span>Días practicados</span></div>
  </section>
  <section class="card"><h3>Últimos 30 días</h3>
    <div class="cal">${cal.map(c => `<div class="day ${c.xp >= save.goal ? "full" : c.xp > 0 ? "some" : ""} ${c.k === todayKey ? "today" : ""}" title="${c.k}: ${c.xp} XP">${c.n}</div>`).join("")}</div>
    <p class="small">Color fuerte: cumpliste la meta diaria. Color suave: practicaste, pero no llegaste a la meta. El borde marca hoy.</p>
  </section>
  <section class="card"><h3>Tu progreso</h3>
    <div class="lvl ${isCs() ? "cur" : ""}">
      <div class="lvl-h"><b>Checo · A0–A1 Supervivencia${isCs() ? " · activo" : ""}</b><span>${cs.pct}%</span></div>
      ${bar(cs.pct)}
      <div class="small">Palabras ${cs.kw}/${cs.tw} · Frases ${cs.ks}/${cs.ts}</div>
      ${!isCs() ? `<button class="btn" data-act="lang" data-v="cs">Practicar checo</button>` : ""}
    </div>
    ${lvlStats.map(x => `<div class="lvl ${!isCs() && x.l === save.lvl ? "cur" : ""}">
      <div class="lvl-h"><b>Inglés · ${LVL_LABEL[x.l]}${!isCs() && x.l === save.lvl ? " · activo" : ""}</b><span>${x.pct}%</span></div>
      ${bar(x.pct)}
      <div class="small">Palabras ${x.kw}/${x.tw} · Frases ${x.ks}/${x.ts}</div>
      ${isCs() || x.l !== save.lvl ? `<button class="btn" data-act="setlvl" data-v="${x.l}">Practicar inglés ${x.l}</button>` : ""}
    </div>`).join("")}
    <p class="small">${isCs()
      ? "La racha y el XP son compartidos entre inglés y checo. Tu progreso de inglés se conserva al cambiar de idioma."
      : "Tu resultado EF SET: 45 (B1). Pasa al siguiente nivel cuando domines cerca del 70% del actual. Tu meta para trabajar en Chequia es B2 (51+). El checo de supervivencia te va a servir el primer día, aunque el inglés sea tu herramienta principal."}</p>
  </section>
  <section class="card"><h3>Ajustes</h3>
    <label class="sel">Meta diaria <select data-act="goal">
      ${[[30, "30 XP · suave (unos 5 minutos)"], [50, "50 XP · normal (unos 10 minutos)"], [100, "100 XP · intenso (unos 20 minutos)"]].map(([v, l]) => `<option value="${v}" ${v === save.goal ? "selected" : ""}>${l}</option>`).join("")}
    </select></label>
    <p class="small" id="persist-msg">${canSave ? "✅ Tu progreso se guarda automáticamente en este dispositivo." : "⚠️ Este navegador no permite guardar el progreso. Usa “Exportar” como respaldo."}</p>
    <div class="row-btns">
      <button class="btn" data-act="export">⬇️ Exportar progreso</button>
      <button class="btn" data-act="import">⬆️ Importar progreso</button>
      <input type="file" id="imp" accept="application/json,.json" hidden>
    </div>
    <button class="btn danger" data-act="reset">Reiniciar todo el progreso</button>
  </section>`;
}

function viewFlash(words) {
  const f = ui.fc, known = save.known;
  const deck = f.pending ? words.filter(w => !known[w.id]) : words;
  const kc = words.filter(w => known[w.id]).length;
  const w = deck.length ? deck[f.idx % deck.length] : null;
  let h = `<div class="fc-top"><span class="small">${kc} de ${words.length} palabras aprendidas</span>
    <label class="tog"><input type="checkbox" data-act="pending" ${f.pending ? "checked" : ""}> Solo pendientes</label></div>${bar(kc / words.length * 100)}`;
  if (!w) return h + `<div class="card center"><div style="font-size:40px">🎉</div><h3>¡Dominaste todas las palabras de esta selección!</h3><p class="small">Apaga “Solo pendientes” para repasarlas, o prueba otro tema o nivel.</p></div>`;
  h += `<div class="flash ${f.flipped ? "back" : ""}" data-act="flip" role="button" tabindex="0">
    <span class="small">${thLabelOf(w.th)} · ${f.idx % deck.length + 1}/${deck.length}</span>
    ${!f.flipped ? `<div class="w-en">${esc(w.en)}</div>${pron(w)}${spk(w.en, w.id)}<span class="small">Toca la tarjeta para ver el significado</span>`
      : `<div class="w-es">${esc(w.es)}</div>${pron(w)}<div class="w-ex">“${esc(w.ex)}”</div>${w.exes ? `<div class="small">${esc(w.exes)}</div>` : ""}${spk(w.ex, w.id, "ex")}`}
  </div>
  <div class="row2"><button class="big red" data-act="mark" data-v="0">Repasar de nuevo</button><button class="big green" data-act="mark" data-v="1">Lo sé ✓</button></div>
  ${known[w.id] ? `<p class="small ok center">Ya marcaste esta palabra como aprendida</p>` : ""}`;
  return h;
}

function startQuiz(pool, bank) {
  const total = Math.min(8, pool.length), seed = Math.floor(Math.random() * 100000);
  const qs = shuffle(pool, seed).slice(0, total).map((w, i) => {
    const dir = i % 2 === 0 ? "en-es" : "es-en"; const text = x => dir === "en-es" ? x.es : x.en;
    const wrong = [];
    for (const c of shuffle(bank.filter(b => b.id !== w.id), seed + i)) { const t = text(c); if (t !== text(w) && !wrong.includes(t)) wrong.push(t); if (wrong.length === 3) break; }
    const options = shuffle([text(w), ...wrong], seed + i * 7);
    return { w, dir, options, ans: options.indexOf(text(w)) };
  });
  ui.quiz = { qs, qi: 0, picked: null, score: 0, done: false };
}
function viewQuiz() {
  const z = ui.quiz;
  if (!z) return `<div class="card center"><div style="font-size:40px">🧠</div><h3>Quiz de 8 preguntas</h3><p class="small">+10 XP por respuesta correcta y bonus de +10 XP si aciertas casi todas.</p><button class="big green" data-act="quizstart">Empezar quiz</button></div>`;
  if (z.done) { const great = z.score >= Math.ceil(z.qs.length * 0.75);
    return `<div class="card center"><div style="font-size:40px">${great ? "🏆" : "💪"}</div><h3>${z.score} de ${z.qs.length} correctas</h3><p class="small">${great ? "¡Excelente! Ganaste el bonus de +10 XP." : "Buen intento. Repite el quiz para afirmar las palabras."}</p><button class="big green" data-act="quizstart">Otro quiz</button></div>`; }
  const q = z.qs[z.qi];
  return `${bar(z.qi / z.qs.length * 100)}
  <p class="small">Pregunta ${z.qi + 1} de ${z.qs.length} · ${q.dir === "en-es" ? "¿Qué significa en español?" : `¿Cómo se dice en ${langName()}?`}</p>
  <div class="card center"><div class="w-en">${esc(q.dir === "en-es" ? q.w.en : q.w.es)}</div>${q.dir === "en-es" ? `${pron(q.w)}${spk(q.w.en, q.w.id)}` : ""}</div>
  <div class="opts">${q.options.map((o, i) => { const s = z.picked === null ? "" : i === q.ans ? "right" : i === z.picked ? "wrong" : "dim";
    return `<button class="opt ${s}" data-act="qpick" data-v="${i}" ${z.picked !== null ? "disabled" : ""}>${esc(o)}</button>`; }).join("")}</div>
  ${z.picked !== null ? `<div class="feedback ${z.picked === q.ans ? "good" : "bad"}"><b>${z.picked === q.ans ? "¡Correcto! +10 XP" : `Era: ${esc(q.options[q.ans])}`}</b><button class="big ${z.picked === q.ans ? "green" : "red"}" data-act="qnext">${z.qi + 1 >= z.qs.length ? "Ver resultado" : "Siguiente"}</button></div>` : ""}`;
}

function viewStudy(sents) {
  const { s, num, total } = currentPractice(sents, ui.st);
  const c = ui.st;
  if (!s) return viewSentStats(sentsAll()) + emptyDeckMsg();
  let body;
  if (!c.reveal) {
    body = `<div class="card center sent-prompt">
      <p class="small">¿Cómo se dice en ${langName()}?</p>
      <div class="s-es">${esc(s.es)}</div>
      <p class="small muted">Piénsala y luego revela la respuesta</p>
    </div>
    <button class="big blue" data-act="sreveal">Ver respuesta</button>`;
  } else {
    body = `<div class="card center sent-prompt">
      <p class="small">¿Cómo se dice en ${langName()}?</p>
      <div class="s-es">${esc(s.es)}</div>
      <div class="s-en">${esc(s.en)}</div>
      ${pron(s)}${spk(s.en, s.id, "s")}
    </div>`;
    if (!c.rated) {
      body += `<div class="rate-btns">
        <button class="big red" data-act="srate" data-v="again">No la sabía</button>
        <button class="big gold" data-act="srate" data-v="hard">Más o menos</button>
        <button class="big green" data-act="srate" data-v="good">La sabía</button>
      </div>`;
    } else {
      const msg = c.rated === "good" ? "La sabías ✓" : c.rated === "hard" ? "Más o menos · la repasaremos" : "A repasar";
      const cls = c.rated === "good" ? "good" : c.rated === "hard" ? "mid" : "bad";
      body += `<div class="feedback ${cls}"><b>${msg}</b><button class="big green" data-act="snext">Siguiente</button></div>`;
    }
  }
  return `${viewSentStats(sentsAll())}
  <p class="small">Frase ${num} de ${total} · ${thLabelOf(s.th)}</p>
  ${body}`;
}
function viewWrite(sents) {
  const { s, num, total } = currentPractice(sents, ui.wr);
  const w = ui.wr;
  if (!s) return viewSentStats(sentsAll()) + emptyDeckMsg();
  const ph = isCs() ? "Escribe la oración en checo…" : "Escribe la oración en inglés…";
  let body = `<div class="card center sent-prompt">
    <p class="small">Escribe esta oración en ${langName()}</p>
    <div class="s-es">${esc(s.es)}</div>
  </div>`;
  if (!w.res) {
    body += `<label class="sel sent-lab" for="sent-input">Tu respuesta
      <textarea id="sent-input" class="sent-input" rows="3" lang="${isCs() ? "cs" : "en"}" autocapitalize="off" autocomplete="off" autocorrect="off" spellcheck="false" enterkeyhint="done" placeholder="${esc(ph)}"></textarea>
    </label>
    <button class="big green" data-act="wcheck">Comprobar</button>`;
  } else {
    const r = w.res;
    const title = r.empty ? "Escribe la oración para comprobarla" : r.kind === "ok" ? "¡Correcto!" : r.kind === "almost" ? "Casi correcto" : "Incorrecto";
    const cls = r.kind === "ok" ? "good" : r.kind === "almost" ? "mid" : "bad";
    const diff = r.parts && r.parts.length ? `<div class="diff-line">${renderDiff(r.parts)}</div><p class="small">En verde lo correcto, en rojo lo que falló y subrayado lo que faltaba.</p>` : "";
    body += `<div class="feedback ${cls}">
      <b>${title}</b>
      ${r.kind !== "ok" && !r.empty ? `<div class="your-ans small">Escribiste: ${esc(r.typed)}</div>${diff}` : ""}
      ${r.empty ? `<button class="big gray" data-act="wretry">Volver a escribir</button>` : `<div class="s-en">${esc(r.expected)}</div>${pron(s)}${spk(s.en, s.id, "s")}<button class="big ${r.kind === "bad" ? "red" : "green"}" data-act="wnext">Siguiente</button>`}
    </div>`;
  }
  return `${viewSentStats(sentsAll())}
  <p class="small">Frase ${num} de ${total} · ${thLabelOf(s.th)}</p>
  ${body}`;
}

function chooseOpts(s, bank) {
  const wrong = shuffle(bank.filter(b => b.id !== s.id), hash(s.id)).slice(0, 2).map(b => b.en);
  return shuffle([s.en, ...wrong], hash(s.id) + 3);
}
function viewChoose(sents, bank) {
  const { s, num, total } = currentPractice(sents, ui.ch);
  if (!s) return viewSentStats(sentsAll()) + emptyDeckMsg();
  const c = ui.ch, options = chooseOpts(s, bank), ans = options.indexOf(s.en);
  return `${viewSentStats(sentsAll())}<p class="small">Frase ${num} de ${total} · ${thLabelOf(s.th)}</p>
  <div class="card center"><p class="small">¿Cómo se dice en ${langName()}?</p><div class="s-es">${esc(s.es)}</div></div>
  <div class="opts">${options.map((o, i) => { const st = c.picked === null ? "" : i === ans ? "right" : i === c.picked ? "wrong" : "dim";
    return `<button class="opt ${st}" data-act="cpick" data-v="${i}" data-ans="${ans}" data-id="${s.id}" ${c.picked !== null ? "disabled" : ""}>${esc(o)}</button>`; }).join("")}</div>
  ${c.picked !== null ? `<div class="feedback ${c.picked === ans ? "good" : "bad"}"><b>${c.picked === ans ? "¡Correcto!" : "Casi. La correcta está en verde."}</b>${pron(s)}${spk(s.en, s.id, "s")}<button class="big ${c.picked === ans ? "green" : "red"}" data-act="cnext">Siguiente</button></div>` : ""}`;
}
function orderWords(s) {
  const w = s.en.split(" "); let order = shuffle(w.map((_, i) => i), hash(s.id));
  if (order.every((v, i) => v === i)) order = order.reverse();
  return order.map(i => w[i]);
}
function viewOrder(sents) {
  const { s, num, total } = currentPractice(sents, ui.ord);
  if (!s) return viewSentStats(sentsAll()) + emptyDeckMsg();
  const o = ui.ord, words = orderWords(s);
  return `${viewSentStats(sentsAll())}<p class="small">Frase ${num} de ${total} · ${thLabelOf(s.th)}</p>
  <div class="card center"><p class="small">Ordena las palabras para traducir:</p><div class="s-es">${esc(s.es)}</div></div>
  <div class="answer ${o.res || ""}">${o.pick.length ? o.pick.map((i, j) => `<button class="chip" data-act="unpick" data-v="${j}" ${o.res ? "disabled" : ""}>${esc(words[i])}</button>`).join("") : `<span class="small muted">Toca las palabras en orden…</span>`}</div>
  <div class="bank">${words.map((w, i) => `<button class="chip ${o.pick.includes(i) ? "used" : ""}" data-act="opick" data-v="${i}" ${o.pick.includes(i) || o.res ? "disabled" : ""}>${esc(w)}</button>`).join("")}</div>
  ${o.res ? `<div class="feedback ${o.res === "ok" ? "good" : "bad"}"><b>${o.res === "ok" ? "¡Perfecto!" : `Correcta: ${esc(s.en)}`}</b>${pron(s)}${spk(s.en, s.id, "s")}<button class="big ${o.res === "ok" ? "green" : "red"}" data-act="onext">Siguiente</button></div>`
    : `<div class="row2"><button class="big gray" data-act="oclear">Borrar</button><button class="big green" data-act="ocheck" data-id="${s.id}" ${o.pick.length !== words.length ? "disabled" : ""}>Comprobar</button></div>`}`;
}

function render() {
  const now = new Date(), todayXp = save.days[keyOf(now)] || 0, st = streaks(save.days, now);
  document.getElementById("hdr-streak").textContent = `🔥 ${st.cur}`;
  document.getElementById("hdr-xp").textContent = `⚡ ${todayXp}/${save.goal}`;
  document.getElementById("hdr-lvl").textContent = isCs() ? "A1" : save.lvl;
  document.getElementById("hdr-brand").textContent = brandName();
  document.title = brandName();
  document.querySelectorAll("#lang-switch button").forEach(b => b.classList.toggle("on", b.dataset.v === save.lang));
  document.querySelectorAll("nav button").forEach(b => b.classList.toggle("on", b.dataset.v === ui.tab));
  let h = "";
  if (ui.tab === "inicio") h = viewInicio();
  else if (ui.tab === "vocab") {
    h = `<h2 class="title">Vocabulario</h2>${pickers()}${seg("vMode", [["tarjetas", "Tarjetas"], ["quiz", "Quiz"]], ui.vMode)}`;
    h += ui.vMode === "tarjetas" ? viewFlash(curWords()) : viewQuiz();
  } else {
    h = `<h2 class="title">Oraciones útiles</h2>${pickers()}${seg("sMode", [["estudiar", "Estudiar"], ["escribir", "Escribir"], ["elegir", "Elegir"], ["ordenar", "Ordenar"]], ui.sMode)}`;
    const ss = curSents();
    h += ui.sMode === "estudiar" ? viewStudy(ss) : ui.sMode === "escribir" ? viewWrite(ss) : ui.sMode === "elegir" ? viewChoose(ss, sentsAll()) : viewOrder(ss);
  }
  document.getElementById("main").innerHTML = h;
  const input = document.getElementById("sent-input");
  if (input) input.focus({ preventScroll: true });
}

/* ---------- eventos ---------- */
function exportProgress() {
  const data = JSON.stringify({ app: "ingles-trabajo", version: 2, exported: new Date().toISOString(), save }, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `ingles-trabajo-progreso-${keyOf(new Date())}.json`;
  document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  toast("Progreso exportado ✅");
}
function importProgress(file) {
  const r = new FileReader();
  r.onload = () => {
    try {
      const j = JSON.parse(r.result); const s = j.save || j;
      if (typeof s.xp !== "number" || typeof s.days !== "object") throw new Error("formato");
      save = Object.assign({}, BLANK, s);
      if (save.lang !== "en" && save.lang !== "cs") save.lang = "en";
      if (!LEVELS.includes(save.lvl)) save.lvl = "B1";
      persist(); render(); toast("Progreso importado ✅");
    } catch (e) { alert("Ese archivo no parece un respaldo válido de Inglés de Trabajo."); }
  };
  r.readAsText(file);
}

document.addEventListener("click", e => {
  const b = e.target.closest("[data-act]"); if (!b || b.tagName === "SELECT" || b.tagName === "INPUT") return;
  const a = b.dataset.act, v = b.dataset.v;
  if (a === "speak") { e.stopPropagation(); speak(b.dataset.t, b.dataset.id, b.dataset.kind); return; }
  switch (a) {
    case "tab": ui.tab = v; window.scrollTo(0, 0); break;
    case "lang": setLang(v); window.scrollTo(0, 0); break;
    case "seg": if (b.dataset.k === "lvl") { save.lvl = v; persist(); ui.sFailedOnly = false; resetSub(); } else { ui[b.dataset.k] = v; resetSub(); } break;
    case "setlvl": save.lvl = v; save.lang = "en"; persist(); ui.th = "todos"; ui.sFailedOnly = false; resetSub(); break;
    case "flip": ui.fc.flipped = !ui.fc.flipped; break;
    case "mark": { const words = curWords(); const deck = ui.fc.pending ? words.filter(w => !save.known[w.id]) : words; const w = deck[ui.fc.idx % deck.length]; if (!w) break;
      const k = v === "1"; markWord(w.id, k); ui.fc.flipped = false; ui.fc.idx = ui.fc.pending && k ? ui.fc.idx : ui.fc.idx + 1; break; }
    case "quizstart": startQuiz(curWords(), wordsAll()); break;
    case "qpick": { const z = ui.quiz; if (z.picked !== null) break; z.picked = +v; if (+v === z.qs[z.qi].ans) { z.score++; gain(10); } break; }
    case "qnext": { const z = ui.quiz; if (z.qi + 1 >= z.qs.length) { z.done = true; if (z.score >= Math.ceil(z.qs.length * 0.75)) gain(10); } else { z.qi++; z.picked = null; } break; }
    case "cpick": {
      if (ui.ch.picked !== null) break;
      const s = sentById(ui.ch.id, curSents()) || sentById(b.dataset.id, curSents());
      if (!s || (b.dataset.id && b.dataset.id !== s.id)) break;
      ui.ch.picked = +v;
      if (+v === +b.dataset.ans) sentOk(s.id, 10); else gradeSent(s.id, "again");
      ui._speak = { t: s.en, id: s.id, kind: "s" };
      break;
    }
    case "cnext": if (ui.ch.picked === null) break; advancePractice(ui.ch, { picked: null }); break;
    case "opick": if (ui.ord.res) break; ui.ord.pick.push(+v); break;
    case "unpick": if (ui.ord.res) break; ui.ord.pick.splice(+v, 1); break;
    case "oclear": if (ui.ord.res) break; ui.ord.pick = []; break;
    case "ocheck": {
      if (ui.ord.res) break;
      const s = sentById(ui.ord.id, curSents()); if (!s) break;
      const w = orderWords(s);
      const ok = ui.ord.pick.map(i => w[i]).join(" ") === s.en; ui.ord.res = ok ? "ok" : "bad";
      if (ok) sentOk(s.id, 15); else gradeSent(s.id, "again");
      ui._speak = { t: s.en, id: s.id, kind: "s" };
      break;
    }
    case "onext": if (!ui.ord.res) break; advancePractice(ui.ord, { pick: [], res: null }); break;
    case "sreveal": ui.st.reveal = true; break;
    case "srate": {
      const s = sentById(ui.st.id, curSents()); if (!s || ui.st.rated) break;
      gradeSent(s.id, v, 10); ui.st.rated = v; break;
    }
    case "snext": if (!ui.st.rated) break; advancePractice(ui.st, { reveal: false, rated: false }); break;
    case "wcheck": {
      if (ui.wr.res) break;
      const s = sentById(ui.wr.id, curSents()); if (!s) break;
      const typed = (document.getElementById("sent-input") || {}).value || "";
      const res = judgeTyped(typed, s);
      ui.wr.res = res;
      if (res.empty) break;
      if (res.kind === "ok") gradeSent(s.id, "good", 15);
      else if (res.kind === "almost") gradeSent(s.id, "hard", 5);
      else gradeSent(s.id, "again");
      ui._speak = { t: s.en, id: s.id, kind: "s" };
      break;
    }
    case "wretry": ui.wr.res = null; break;
    case "wnext": if (!ui.wr.res || ui.wr.res.empty) break; advancePractice(ui.wr, { res: null }); break;
    case "export": exportProgress(); return;
    case "import": document.getElementById("imp").click(); return;
    case "reset": if (confirm("¿Seguro? Se borrará todo tu XP, rachas y palabras aprendidas.")) { save = Object.assign({}, BLANK, { goal: save.goal, lvl: save.lvl, lang: save.lang }); persist(); } break;
    default: return;
  }
  render();
  if (ui._speak) { const sp = ui._speak; ui._speak = null; speak(sp.t, sp.id, sp.kind); }
});
document.addEventListener("keydown", e => {
  if ((e.key === "Enter" || e.key === " ") && e.target.dataset && e.target.dataset.act === "flip") { e.preventDefault(); ui.fc.flipped = !ui.fc.flipped; render(); }
  if (e.key === "Enter" && !e.shiftKey && e.target && e.target.id === "sent-input") {
    e.preventDefault();
    const btn = document.querySelector('[data-act="wcheck"]');
    if (btn) btn.click();
  }
});
document.addEventListener("change", e => {
  const t = e.target, a = t.dataset.act;
  if (a === "theme") { ui.th = t.value; resetSub(); }
  else if (a === "goal") { save.goal = Number(t.value); persist(); }
  else if (a === "pending") { ui.fc = { idx: 0, flipped: false, pending: t.checked }; }
  else if (a === "failedOnly") { ui.sFailedOnly = t.checked; resetSub(); }
  else if (t.id === "imp") { if (t.files[0]) importProgress(t.files[0]); return; }
  else return;
  render();
});
// Al volver a la app (p. ej. al día siguiente), refresca racha y calendario
document.addEventListener("visibilitychange", () => {
  if (document.hidden) return;
  const typed = (document.getElementById("sent-input") || {}).value;
  save = load();
  render();
  const input = document.getElementById("sent-input");
  if (input && typed) input.value = typed;
});
if ("speechSynthesis" in window) speechSynthesis.getVoices();

render();
if ("serviceWorker" in navigator && location.protocol !== "file:") {
  window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(() => {}));
}
