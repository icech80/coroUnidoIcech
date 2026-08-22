/**
 * Service Worker - Coro Unido Echaurren 80
 *
 * Estrategias:
 *  - App shell (HTML/CSS/JS/favicon): network-first con fallback a cache.
 *  - Recursos del repertorio (audios, partituras): cache-first con soporte
 *    para peticiones Range (necesario para <audio> en Chrome/Safari).
 *  - Todo lo demás: pasa directo a la red.
 *
 * Para forzar actualización del SW, subir el número de versión.
 */

const VERSION = "v1.0.2";
const SHELL_CACHE = `coro-shell-${VERSION}`;
const MEDIA_CACHE = `coro-media-${VERSION}`;

// Rutas relativas al scope del SW (raíz de la app).
const SHELL_ASSETS = [
  "./",
  "./index.html",
  "./asistencia.html",
  "./historial.html",
  "./css/styles.css",
  "./js/app.js",
  "./js/asistencia.js",
  "./js/historial.js",
  "./js/sw-register.js",
  "./favicon.svg",
  "./manifest.webmanifest",
];

// ============================================================
// Install: precachea el app shell.
// ============================================================
self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(SHELL_CACHE);
      // addAll falla todo si una sola URL falla; usamos add individual tolerante.
      await Promise.all(
        SHELL_ASSETS.map((url) =>
          cache.add(new Request(url, { cache: "reload" })).catch((err) => {
            console.warn("[SW] No se pudo precachear", url, err);
          })
        )
      );
      self.skipWaiting();
    })()
  );
});

// ============================================================
// Activate: limpia caches viejos.
// ============================================================
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((k) => k !== SHELL_CACHE && k !== MEDIA_CACHE)
          .map((k) => caches.delete(k))
      );
      await self.clients.claim();
    })()
  );
});

// ============================================================
// Mensajes desde la app (precarga manual de medios).
// ============================================================
self.addEventListener("message", (event) => {
  const data = event.data || {};
  if (data.type === "PRECACHE_MEDIA" && Array.isArray(data.urls)) {
    event.waitUntil(precacheMedia(data.urls, event.source));
  } else if (data.type === "CLEAR_MEDIA_CACHE") {
    event.waitUntil(caches.delete(MEDIA_CACHE));
  } else if (data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

async function precacheMedia(urls, client) {
  const cache = await caches.open(MEDIA_CACHE);
  let done = 0;
  const total = urls.length;
  for (const url of urls) {
    try {
      const existing = await cache.match(url, { ignoreVary: true });
      if (!existing) {
        // Pedimos el recurso completo (sin Range) para poder cachearlo.
        const res = await fetch(url, { cache: "no-store" });
        if (res && res.ok && res.status === 200) {
          await cache.put(url, res.clone());
        }
      }
    } catch (err) {
      console.warn("[SW] precache fallo", url, err);
    }
    done++;
    if (client && client.postMessage) {
      client.postMessage({ type: "PRECACHE_PROGRESS", done, total, url });
    }
  }
  if (client && client.postMessage) {
    client.postMessage({ type: "PRECACHE_DONE", total });
  }
}

// ============================================================
// Fetch handler.
// ============================================================
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  // Solo manejamos requests del mismo origen.
  if (url.origin !== self.location.origin) return;

  // Recursos del repertorio (audios, partituras, imágenes).
  if (url.pathname.includes("/repetorio/")) {
    event.respondWith(handleMediaRequest(req));
    return;
  }

  // App shell: network-first, fallback cache.
  event.respondWith(handleShellRequest(req));
});

// ------------------------------------------------------------
// App shell: network-first.
// ------------------------------------------------------------
async function handleShellRequest(req) {
  const cache = await caches.open(SHELL_CACHE);
  try {
    const fresh = await fetch(req);
    if (fresh && fresh.ok) {
      cache.put(req, fresh.clone()).catch(() => {});
    }
    return fresh;
  } catch (err) {
    const cached = await cache.match(req, { ignoreSearch: true });
    if (cached) return cached;
    // Para navegaciones, intentar devolver index.html.
    if (req.mode === "navigate") {
      const fallback = await cache.match("./index.html");
      if (fallback) return fallback;
    }
    throw err;
  }
}

// ------------------------------------------------------------
// Media: cache-first con soporte Range.
// ------------------------------------------------------------
async function handleMediaRequest(req) {
  const cache = await caches.open(MEDIA_CACHE);
  const rangeHeader = req.headers.get("range");

  // Buscamos la respuesta completa cacheada (sin Range).
  const cacheKey = new Request(req.url, { method: "GET" });
  let cached = await cache.match(cacheKey, { ignoreVary: true });

  if (!cached) {
    // Descargamos completo (sin Range) y cacheamos.
    try {
      const fullReq = new Request(req.url, {
        method: "GET",
        credentials: req.credentials,
        cache: "no-store",
      });
      const res = await fetch(fullReq);
      if (res && res.ok && res.status === 200) {
        await cache.put(cacheKey, res.clone());
        cached = await cache.match(cacheKey, { ignoreVary: true });
      } else {
        // Si no se pudo cachear, devolvemos lo que sea (incluye errores de red).
        return res;
      }
    } catch (err) {
      // Sin red y sin caché: error.
      return new Response("Recurso no disponible offline", {
        status: 504,
        statusText: "Gateway Timeout (offline)",
      });
    }
  }

  // Si el cliente pidió un rango, construimos respuesta 206.
  if (rangeHeader) {
    return buildRangeResponse(cached, rangeHeader);
  }
  return cached.clone();
}

/**
 * Construye una respuesta 206 Partial Content a partir de una respuesta
 * 200 completa cacheada y un header Range del cliente.
 */
async function buildRangeResponse(fullResponse, rangeHeader) {
  const buffer = await fullResponse.clone().arrayBuffer();
  const total = buffer.byteLength;

  // Parse "bytes=start-end" (end opcional).
  const match = /bytes=(\d*)-(\d*)/.exec(rangeHeader);
  if (!match) {
    return fullResponse.clone();
  }
  let start = match[1] === "" ? 0 : parseInt(match[1], 10);
  let end = match[2] === "" ? total - 1 : parseInt(match[2], 10);

  if (isNaN(start) || isNaN(end) || start > end || start >= total) {
    return new Response(null, {
      status: 416,
      statusText: "Range Not Satisfiable",
      headers: { "Content-Range": `bytes */${total}` },
    });
  }
  if (end >= total) end = total - 1;

  const slice = buffer.slice(start, end + 1);
  const headers = new Headers(fullResponse.headers);
  headers.set("Content-Range", `bytes ${start}-${end}/${total}`);
  headers.set("Content-Length", String(slice.byteLength));
  headers.set("Accept-Ranges", "bytes");

  return new Response(slice, {
    status: 206,
    statusText: "Partial Content",
    headers,
  });
}
