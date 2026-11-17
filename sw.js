const CACHE = "ingles-trabajo-v5";
const AUDIO_CACHE = "ingles-trabajo-audio-v5";
const ASSETS = ["./", "./index.html", "./styles.css", "./data.js", "./app.js", "./manifest.webmanifest",
  "./icons/icon-192.png", "./icons/icon-512.png", "./icons/apple-touch-icon.png", "./icons/icon-maskable-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => {
  e.waitUntil((async () => {
    await caches.open(AUDIO_CACHE);
    const ks = await caches.keys();
    await Promise.all(ks.filter(k => k !== CACHE && k !== AUDIO_CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

function parseRange(header, size) {
  const m = /^bytes=(\d*)-(\d*)$/i.exec(String(header || "").trim());
  if (!m) return null;
  let start, end;
  if (m[1] === "" && m[2] !== "") {
    const suffix = Number(m[2]);
    if (!Number.isFinite(suffix) || suffix <= 0) return null;
    start = Math.max(0, size - suffix);
    end = size - 1;
  } else if (m[1] !== "") {
    start = Number(m[1]);
    end = m[2] === "" ? size - 1 : Number(m[2]);
  } else return null;
  if (!Number.isFinite(start) || !Number.isFinite(end) || start < 0) return null;
  if (start >= size || end < start) return { unsat: true };
  end = Math.min(end, size - 1);
  return { start, end };
}

async function sliceRange(fullRes, rangeHeader) {
  const buf = await fullRes.clone().arrayBuffer();
  const size = buf.byteLength;
  const r = parseRange(rangeHeader, size);
  const type = fullRes.headers.get("Content-Type") || "audio/mpeg";
  if (!r || r.unsat) {
    return new Response(null, {
      status: 416,
      headers: { "Content-Range": `bytes */${size}`, "Content-Type": type, "Accept-Ranges": "bytes" }
    });
  }
  return new Response(buf.slice(r.start, r.end + 1), {
    status: 206,
    headers: {
      "Content-Type": type,
      "Content-Length": String(r.end - r.start + 1),
      "Content-Range": `bytes ${r.start}-${r.end}/${size}`,
      "Accept-Ranges": "bytes"
    }
  });
}

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  const isAudio = /\/audio\/[^?]*\.mp3$/i.test(url.pathname);
  if (isAudio) {
    e.respondWith((async () => {
      const cache = await caches.open(AUDIO_CACHE);
      const key = new Request(url.href, { method: "GET" });
      let full = await cache.match(key, { ignoreSearch: true });
      if (full && full.status !== 200) {
        await cache.delete(key);
        full = undefined;
      }
      if (!full) {
        // Pedimos el archivo entero (sin Range) y solo cacheamos un 200 completo.
        // Así nunca guardamos un 206 parcial, que en Safari de escritorio rompe el <audio>.
        let res;
        try {
          res = await fetch(key);
        } catch (err) {
          return Promise.reject(err);
        }
        if (res.status === 200) {
          await cache.put(key, res.clone());
          full = res;
        } else {
          return res;
        }
      }
      const range = e.request.headers.get("Range");
      if (range) return sliceRange(full, range);
      return full;
    })());
    return;
  }
  // red primero (para recibir actualizaciones), caché si no hay internet
  e.respondWith(fetch(e.request).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r; })
    .catch(() => caches.match(e.request, { ignoreSearch: true }).then(r => r || caches.match("./index.html"))));
});
