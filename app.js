"use strict";
/* Inglés de Trabajo · PWA (vanilla JS). Datos en data.js */
const KEY = "ingles-trabajo-v1";
const BLANK = { xp: 0, days: {}, known: {}, sents: {}, goal: 50, lvl: "B1" };

function store() { try { return window.localStorage || null; } catch (e) { return null; } }
function load() {
  try { const s = store(); const raw = s && s.getItem(KEY); return raw ? Object.assign({}, BLANK, JSON.parse(raw)) : Object.assign({}, BLANK); }
  catch (e) { return Object.assign({}, BLANK); }
}
function canPersist() { try { const s = store(); s.setItem(KEY + ":t", "1"); s.removeItem(KEY + ":t"); return true; } catch (e) { return false; } }
function persist() { try { store().setItem(KEY, JSON.stringify(save)); } catch (e) {} }
function speak(t) {
  try {
    const u = new SpeechSynthesisUtterance(t); u.lang = "en-US"; u.rate = 0.9;
    const v = speechSynthesis.getVoices().find(v => /^en[-_]US/i.test(v.lang)) || speechSynthesis.getVoices().find(v => /^en/i.test(v.lang));
    if (v) u.voice = v;
    speechSynthesis.cancel(); speechSynthesis.speak(u);
  } catch (e) {}
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
if (!LEVELS.includes(save.lvl)) save.lvl = "B1";
const canSave = canPersist();
const ui = { tab: "inicio", th: "todos", vMode: "tarjetas", sMode: "estudiar",
  fc: { idx: 0, flipped: false, pending: false },
  quiz: null, // {qs, qi, picked, score, done}
  st: { tr: true },
  ch: { idx: 0, picked: null },
  ord: { idx: 0, pick: [], res: null } };
function resetSub() { ui.fc = { idx: 0, flipped: false, pending: ui.fc.pending }; ui.quiz = null; ui.ch = { idx: 0, picked: null }; ui.ord = { idx: 0, pick: [], res: null }; }

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
function sentOk(id, n) { const first = !save.sents[id]; save.sents = Object.assign({}, save.sents, { [id]: true }); gain(first ? n : 2); }

const wordsAll = () => ALL_WORDS.filter(w => w.lvl === save.lvl);
const sentsAll = () => ALL_SENTS.filter(s => s.lvl === save.lvl);
const curWords = () => ui.th === "todos" ? wordsAll() : wordsAll().filter(w => w.th === ui.th);
const curSents = () => ui.th === "todos" ? sentsAll() : sentsAll().filter(s => s.th === ui.th);

/* ---------- vistas ---------- */
const bar = (pct, cls = "") => `<div class="bar ${cls}"><div style="width:${Math.max(0, Math.min(100, pct))}%"></div></div>`;
const spk = t => `<button class="spk" data-act="speak" data-t="${esc(t)}" aria-label="Escuchar">🔊 Escuchar</button>`;
function seg(name, opts, val) {
  return `<div class="seg">${opts.map(([v, l]) => `<button class="${v === val ? "on" : ""}" data-act="seg" data-k="${name}" data-v="${v}">${l}</button>`).join("")}</div>`;
}
function pickers() {
  return seg("lvl", LEVELS.map(l => [l, LVL_LABEL[l]]), save.lvl) +
    `<label class="sel">Tema <select data-act="theme">${[["todos", "Todos los temas"], ...THEMES.map(t => [t, TH_LABEL[t]])].map(([v, l]) => `<option value="${v}" ${v === ui.th ? "selected" : ""}>${l}</option>`).join("")}</select></label>`;
}

function viewInicio() {
  const now = new Date(), todayKey = keyOf(now), todayXp = save.days[todayKey] || 0, st = streaks(save.days, now);
  const goalPct = Math.min(100, Math.round(todayXp / save.goal * 100)), goalMet = todayXp >= save.goal;
  const cal = []; for (let i = 29; i >= 0; i--) { const d = addDays(now, -i); const k = keyOf(d); cal.push({ k, n: d.getDate(), xp: save.days[k] || 0 }); }
  const practiced = cal.filter(c => c.xp > 0).length;
  const lvlStats = LEVELS.map(l => {
    const w = ALL_WORDS.filter(x => x.lvl === l), s = ALL_SENTS.filter(x => x.lvl === l);
    const kw = w.filter(x => save.known[x.id]).length, ks = s.filter(x => save.sents[x.id]).length;
    return { l, kw, tw: w.length, ks, ts: s.length, pct: Math.round((kw + ks) / (w.length + s.length) * 100) };
  });
  return `
  <section class="card hero">
    <div class="flame ${st.cur > 0 ? "lit" : ""}">🔥<b>${st.cur}</b></div>
    <div class="hero-txt">
      <h2>${st.cur > 0 ? `¡Racha de ${st.cur} día${st.cur === 1 ? "" : "s"}!` : "¡Empieza tu racha hoy!"}</h2>
      <p>${todayXp > 0 ? "Hoy ya practicaste. ¡Sigue así!" : st.cur > 0 ? "Practica hoy para no perder tu racha." : "Haz unas tarjetas para encender el fuego."}</p>
      ${bar(goalPct, "gold")}
      <p class="small">${todayXp} / ${save.goal} XP hoy · ${goalMet ? "¡Meta del día cumplida! 🎉" : `Te faltan ${save.goal - todayXp} XP`}</p>
    </div>
  </section>
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
  <section class="card"><h3>Tu progreso por nivel</h3>
    ${lvlStats.map(x => `<div class="lvl ${x.l === save.lvl ? "cur" : ""}">
      <div class="lvl-h"><b>${LVL_LABEL[x.l]}${x.l === save.lvl ? " · activo" : ""}</b><span>${x.pct}%</span></div>
      ${bar(x.pct)}
      <div class="small">Palabras ${x.kw}/${x.tw} · Frases ${x.ks}/${x.ts}</div>
      ${x.l !== save.lvl ? `<button class="btn" data-act="setlvl" data-v="${x.l}">Practicar ${x.l}</button>` : ""}
    </div>`).join("")}
    <p class="small">Tu resultado EF SET: 45 (B1). Pasa al siguiente nivel cuando domines cerca del 70% del actual. Tu meta para trabajar en Chequia es B2 (51+).</p>
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
    <span class="small">${TH_LABEL[w.th]} · ${f.idx % deck.length + 1}/${deck.length}</span>
    ${!f.flipped ? `<div class="w-en">${esc(w.en)}</div>${spk(w.en)}<span class="small">Toca la tarjeta para ver el significado</span>`
      : `<div class="w-es">${esc(w.es)}</div><div class="w-ex">“${esc(w.ex)}”</div>${spk(w.ex)}`}
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
  <p class="small">Pregunta ${z.qi + 1} de ${z.qs.length} · ${q.dir === "en-es" ? "¿Qué significa en español?" : "¿Cómo se dice en inglés?"}</p>
  <div class="card center"><div class="w-en">${esc(q.dir === "en-es" ? q.w.en : q.w.es)}</div>${q.dir === "en-es" ? spk(q.w.en) : ""}</div>
  <div class="opts">${q.options.map((o, i) => { const s = z.picked === null ? "" : i === q.ans ? "right" : i === z.picked ? "wrong" : "dim";
    return `<button class="opt ${s}" data-act="qpick" data-v="${i}" ${z.picked !== null ? "disabled" : ""}>${esc(o)}</button>`; }).join("")}</div>
  ${z.picked !== null ? `<div class="feedback ${z.picked === q.ans ? "good" : "bad"}"><b>${z.picked === q.ans ? "¡Correcto! +10 XP" : `Era: ${esc(q.options[q.ans])}`}</b><button class="big ${z.picked === q.ans ? "green" : "red"}" data-act="qnext">${z.qi + 1 >= z.qs.length ? "Ver resultado" : "Siguiente"}</button></div>` : ""}`;
}

function viewStudy(sents) {
  return `<label class="tog"><input type="checkbox" data-act="tr" ${ui.st.tr ? "checked" : ""}> Mostrar traducción</label>
  ${sents.map(s => `<div class="card sent"><div class="s-en">${esc(s.en)} ${save.sents[s.id] ? "✅" : ""}</div>${ui.st.tr ? `<div class="small">${esc(s.es)}</div>` : ""}<div class="small muted">${TH_LABEL[s.th]}</div>${spk(s.en)}</div>`).join("")}`;
}
function chooseOpts(s, bank) {
  const wrong = shuffle(bank.filter(b => b.id !== s.id), hash(s.id)).slice(0, 2).map(b => b.en);
  return shuffle([s.en, ...wrong], hash(s.id) + 3);
}
function viewChoose(sents, bank) {
  const c = ui.ch, s = sents[c.idx % sents.length], options = chooseOpts(s, bank), ans = options.indexOf(s.en);
  return `<p class="small">Frase ${c.idx % sents.length + 1} de ${sents.length} · ${TH_LABEL[s.th]}</p>
  <div class="card center"><p class="small">¿Cómo se dice en inglés?</p><div class="s-es">${esc(s.es)}</div></div>
  <div class="opts">${options.map((o, i) => { const st = c.picked === null ? "" : i === ans ? "right" : i === c.picked ? "wrong" : "dim";
    return `<button class="opt ${st}" data-act="cpick" data-v="${i}" data-ans="${ans}" data-id="${s.id}" ${c.picked !== null ? "disabled" : ""}>${esc(o)}</button>`; }).join("")}</div>
  ${c.picked !== null ? `<div class="feedback ${c.picked === ans ? "good" : "bad"}"><b>${c.picked === ans ? "¡Correcto!" : "Casi. La correcta está en verde."}</b>${spk(s.en)}<button class="big ${c.picked === ans ? "green" : "red"}" data-act="cnext">Siguiente</button></div>` : ""}`;
}
function orderWords(s) {
  const w = s.en.split(" "); let order = shuffle(w.map((_, i) => i), hash(s.id));
  if (order.every((v, i) => v === i)) order = order.reverse();
  return order.map(i => w[i]);
}
function viewOrder(sents) {
  const o = ui.ord, s = sents[o.idx % sents.length], words = orderWords(s);
  return `<p class="small">Frase ${o.idx % sents.length + 1} de ${sents.length} · ${TH_LABEL[s.th]}</p>
  <div class="card center"><p class="small">Ordena las palabras para traducir:</p><div class="s-es">${esc(s.es)}</div></div>
  <div class="answer ${o.res || ""}">${o.pick.length ? o.pick.map((i, j) => `<button class="chip" data-act="unpick" data-v="${j}" ${o.res ? "disabled" : ""}>${esc(words[i])}</button>`).join("") : `<span class="small muted">Toca las palabras en orden…</span>`}</div>
  <div class="bank">${words.map((w, i) => `<button class="chip ${o.pick.includes(i) ? "used" : ""}" data-act="opick" data-v="${i}" ${o.pick.includes(i) || o.res ? "disabled" : ""}>${esc(w)}</button>`).join("")}</div>
  ${o.res ? `<div class="feedback ${o.res === "ok" ? "good" : "bad"}"><b>${o.res === "ok" ? "¡Perfecto!" : `Correcta: ${esc(s.en)}`}</b>${spk(s.en)}<button class="big ${o.res === "ok" ? "green" : "red"}" data-act="onext">Siguiente</button></div>`
    : `<div class="row2"><button class="big gray" data-act="oclear">Borrar</button><button class="big green" data-act="ocheck" data-id="${s.id}" ${o.pick.length !== words.length ? "disabled" : ""}>Comprobar</button></div>`}`;
}

function render() {
  const now = new Date(), todayXp = save.days[keyOf(now)] || 0, st = streaks(save.days, now);
  document.getElementById("hdr-streak").textContent = `🔥 ${st.cur}`;
  document.getElementById("hdr-xp").textContent = `⚡ ${todayXp}/${save.goal}`;
  document.getElementById("hdr-lvl").textContent = save.lvl;
  document.querySelectorAll("nav button").forEach(b => b.classList.toggle("on", b.dataset.v === ui.tab));
  let h = "";
  if (ui.tab === "inicio") h = viewInicio();
  else if (ui.tab === "vocab") {
    h = `<h2 class="title">Vocabulario</h2>${pickers()}${seg("vMode", [["tarjetas", "Tarjetas"], ["quiz", "Quiz"]], ui.vMode)}`;
    h += ui.vMode === "tarjetas" ? viewFlash(curWords()) : viewQuiz();
  } else {
    h = `<h2 class="title">Oraciones útiles</h2>${pickers()}${seg("sMode", [["estudiar", "Estudiar"], ["elegir", "Elegir"], ["ordenar", "Ordenar"]], ui.sMode)}`;
    const ss = curSents();
    h += ui.sMode === "estudiar" ? viewStudy(ss) : ui.sMode === "elegir" ? viewChoose(ss, sentsAll()) : viewOrder(ss);
    h += `<p class="small center">Frases dominadas en ${save.lvl}: ${sentsAll().filter(s => save.sents[s.id]).length}/${sentsAll().length}</p>`;
  }
  document.getElementById("main").innerHTML = h;
}

/* ---------- eventos ---------- */
function exportProgress() {
  const data = JSON.stringify({ app: "ingles-trabajo", version: 1, exported: new Date().toISOString(), save }, null, 2);
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
      save = Object.assign({}, BLANK, s); persist(); render(); toast("Progreso importado ✅");
    } catch (e) { alert("Ese archivo no parece un respaldo válido de Inglés de Trabajo."); }
  };
  r.readAsText(file);
}

document.addEventListener("click", e => {
  const b = e.target.closest("[data-act]"); if (!b || b.tagName === "SELECT" || b.tagName === "INPUT") return;
  const a = b.dataset.act, v = b.dataset.v;
  if (a === "speak") { e.stopPropagation(); speak(b.dataset.t); return; }
  switch (a) {
    case "tab": ui.tab = v; window.scrollTo(0, 0); break;
    case "seg": if (b.dataset.k === "lvl") { save.lvl = v; persist(); resetSub(); } else { ui[b.dataset.k] = v; resetSub(); } break;
    case "setlvl": save.lvl = v; persist(); resetSub(); break;
    case "flip": ui.fc.flipped = !ui.fc.flipped; break;
    case "mark": { const words = curWords(); const deck = ui.fc.pending ? words.filter(w => !save.known[w.id]) : words; const w = deck[ui.fc.idx % deck.length]; if (!w) break;
      const k = v === "1"; markWord(w.id, k); ui.fc.flipped = false; ui.fc.idx = ui.fc.pending && k ? ui.fc.idx : ui.fc.idx + 1; break; }
    case "quizstart": startQuiz(curWords(), wordsAll()); break;
    case "qpick": { const z = ui.quiz; if (z.picked !== null) break; z.picked = +v; if (+v === z.qs[z.qi].ans) { z.score++; gain(10); } break; }
    case "qnext": { const z = ui.quiz; if (z.qi + 1 >= z.qs.length) { z.done = true; if (z.score >= Math.ceil(z.qs.length * 0.75)) gain(10); } else { z.qi++; z.picked = null; } break; }
    case "cpick": if (ui.ch.picked !== null) break; ui.ch.picked = +v; if (+v === +b.dataset.ans) sentOk(b.dataset.id, 10); break;
    case "cnext": ui.ch.idx++; ui.ch.picked = null; break;
    case "opick": ui.ord.pick.push(+v); break;
    case "unpick": ui.ord.pick.splice(+v, 1); break;
    case "oclear": ui.ord.pick = []; break;
    case "ocheck": { const ss = curSents(); const s = ss[ui.ord.idx % ss.length]; const w = orderWords(s);
      const ok = ui.ord.pick.map(i => w[i]).join(" ") === s.en; ui.ord.res = ok ? "ok" : "bad"; if (ok) sentOk(s.id, 15); break; }
    case "onext": ui.ord = { idx: ui.ord.idx + 1, pick: [], res: null }; break;
    case "export": exportProgress(); return;
    case "import": document.getElementById("imp").click(); return;
    case "reset": if (confirm("¿Seguro? Se borrará todo tu XP, rachas y palabras aprendidas.")) { save = Object.assign({}, BLANK, { goal: save.goal, lvl: save.lvl }); persist(); } break;
    default: return;
  }
  render();
});
document.addEventListener("keydown", e => { if ((e.key === "Enter" || e.key === " ") && e.target.dataset && e.target.dataset.act === "flip") { e.preventDefault(); ui.fc.flipped = !ui.fc.flipped; render(); } });
document.addEventListener("change", e => {
  const t = e.target, a = t.dataset.act;
  if (a === "theme") { ui.th = t.value; resetSub(); }
  else if (a === "goal") { save.goal = Number(t.value); persist(); }
  else if (a === "pending") { ui.fc = { idx: 0, flipped: false, pending: t.checked }; }
  else if (a === "tr") { ui.st.tr = t.checked; }
  else if (t.id === "imp") { if (t.files[0]) importProgress(t.files[0]); return; }
  else return;
  render();
});
// Al volver a la app (p. ej. al día siguiente), refresca racha y calendario
document.addEventListener("visibilitychange", () => { if (!document.hidden) { save = load(); render(); } });
if ("speechSynthesis" in window) speechSynthesis.getVoices();

render();
if ("serviceWorker" in navigator && location.protocol !== "file:") {
  window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(() => {}));
}
