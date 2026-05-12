/**
 * Registro del Service Worker + UI de estado offline / precarga.
 *
 * Funcionalidades:
 *  - Registra sw.js (si el navegador lo soporta y se sirve por http(s)).
 *  - Muestra un banner cuando se pierde conexión.
 *  - Si la página expone `window.getRepertorioUrls()`, agrega un botón
 *    "Descargar todo para uso offline" que precachea todos los audios
 *    y partituras vía postMessage al SW.
 */

(function () {
  const isSecureCtx =
    location.protocol === "https:" || location.hostname === "localhost" || location.hostname === "127.0.0.1";

  if ("serviceWorker" in navigator && isSecureCtx) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("./sw.js")
        .then((reg) => {
          console.log("[SW] Registrado, scope:", reg.scope);
        })
        .catch((err) => {
          console.warn("[SW] Registro falló:", err);
        });
    });
  }

  // ---------- Indicador online/offline ----------
  function ensureStatusBanner() {
    let el = document.getElementById("net-status-banner");
    if (el) return el;
    el = document.createElement("div");
    el.id = "net-status-banner";
    el.className = "net-status-banner hidden";
    el.setAttribute("role", "status");
    el.setAttribute("aria-live", "polite");
    document.body.appendChild(el);
    return el;
  }

  function updateNetStatus() {
    const el = ensureStatusBanner();
    if (navigator.onLine) {
      el.classList.add("hidden");
      el.textContent = "";
    } else {
      el.classList.remove("hidden");
      el.textContent = "📴 Sin conexión — usando contenido guardado";
    }
  }

  window.addEventListener("online", updateNetStatus);
  window.addEventListener("offline", updateNetStatus);
  document.addEventListener("DOMContentLoaded", updateNetStatus);

  // ---------- Botón de precarga total ----------
  // Se monta sólo si la página expone getRepertorioUrls() (index.html).
  document.addEventListener("DOMContentLoaded", () => {
    if (typeof window.getRepertorioUrls !== "function") return;
    if (!("serviceWorker" in navigator)) return;

    const container =
      document.querySelector("main .container") || document.querySelector("main") || document.body;

    const wrap = document.createElement("div");
    wrap.className = "offline-controls";
    wrap.innerHTML = `
      <button id="precache-all-btn" class="precache-btn" type="button">
        📥 Descargar todo para usar sin internet
      </button>
      <span id="precache-progress" class="precache-progress" aria-live="polite"></span>
    `;
    // Insertar al inicio del contenedor.
    container.insertBefore(wrap, container.firstChild);

    const btn = wrap.querySelector("#precache-all-btn");
    const progress = wrap.querySelector("#precache-progress");

    btn.addEventListener("click", async () => {
      const urls = window.getRepertorioUrls();
      if (!urls || urls.length === 0) {
        progress.textContent = "No hay archivos para descargar.";
        return;
      }
      const reg = await navigator.serviceWorker.ready;
      if (!reg.active) {
        progress.textContent = "Service Worker no está activo todavía. Recargá la página.";
        return;
      }
      btn.disabled = true;
      progress.textContent = `Descargando 0 / ${urls.length}…`;

      const onMsg = (event) => {
        const data = event.data || {};
        if (data.type === "PRECACHE_PROGRESS") {
          progress.textContent = `Descargando ${data.done} / ${data.total}…`;
        } else if (data.type === "PRECACHE_DONE") {
          progress.textContent = `✅ Listo: ${data.total} archivos guardados.`;
          btn.disabled = false;
          navigator.serviceWorker.removeEventListener("message", onMsg);
        }
      };
      navigator.serviceWorker.addEventListener("message", onMsg);

      reg.active.postMessage({ type: "PRECACHE_MEDIA", urls });
    });
  });
})();
