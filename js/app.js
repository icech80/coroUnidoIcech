/**
 * Repertorio del Coro
 * 
 * Estructura de carpetas:
 *   repetorio/
 *     warmup/
 *       [Nombre Canción]/
 *         Soprano.mp4, Alto.mp4, Tenor.mpeg, Bajo.mpeg, Pista.mp3, Partitura.pdf
 *     canciones/
 *       [Nombre Canción]/
 *         Soprano.mp4, Alto.mp4, Tenor.mpeg, Bajo.mpeg, Pista.mp3, Partitura.pdf
 * 
 * Para agregar una canción nueva:
 * 1. Crea una carpeta dentro de "repetorio/warmup/" o "repetorio/canciones/".
 * 2. Coloca los archivos de voces, pista y partitura dentro.
 * 3. Agrega un objeto al array correspondiente abajo.
 */

const warmup = [
    {
        nombre: "Amen",
        carpeta: "Amen",
        voces: [
            { nombre: "Soprano", icono: "👩", archivo: "soprano.mp3" },
            { nombre: "Alto",    icono: "👩", archivo: "alto.mp3" },
            { nombre: "Tenor",   icono: "👨", archivo: "tenor.mp3" },
            { nombre: "Bajo",    icono: "👨", archivo: "bajo.mp3" },
        ],
        todas: "todas.mp3",
        pista: "pista.mp3",
        partitura: "partitura.jpeg",
    },
    {
        nombre: "Jubilate Deo",
        carpeta: "Jubilate deo",
        voces: [],
        todas: "todas.mp3",
        pista: "pista.mp3",
        partitura: "partitura.jpeg",
    },
];

const canciones = [
    { nombre: "Es Exaltado", carpeta: "Es Exaltado" },
    {
        nombre: "Medley Alabanza Su Nombre",
        carpeta: "Medley allabanza su Nombre",
        voces: [
            { nombre: "Soprano", icono: "👩", archivo: "Soprano.mp3" },
            { nombre: "Alto",    icono: "👩", archivo: "alto.mp3" },
            { nombre: "Tenor",   icono: "👨", archivo: "tenor.mp3" },
            { nombre: "Bajo",    icono: "👨", archivo: "bajo.mp3" },
        ],
        todas: "Todo Junto.mp3",
        pista: "pista.mp3",
        partitura: "Partitura.pdf",
    },
    {
        nombre: "Ven De Todo Bien La Fuente",
        carpeta: "ven de todo bien la fuente",
        voces: [
            { nombre: "Soprano",         icono: "👩", archivo: "Soprano.mp3" },
            { nombre: "Alto",            icono: "👩", archivo: "Alto.mp3" },
            { nombre: "Tenor",           icono: "👨", archivo: "Tenor.mp3" },
            { nombre: "Bajo",            icono: "👨", archivo: "Bajo.mp3" },
            { nombre: "Soprano Cantado", icono: "👩", archivo: "Soprano-Cantado.mp3" },
            { nombre: "Alto Cantado",    icono: "👩", archivo: "Alto-Cantado.mp3" },
            { nombre: "Tenor Cantado",   icono: "👨", archivo: "Tenor-Cantado.mp3" },
            { nombre: "Bajo Cantado",    icono: "👨", archivo: "Bajo-Cantado.mp3" },
        ],
        todas: "Todas las voces-Cantado.mp3",
        pista: "Pista.mp3",
        partitura: "Partitura.pdf",
    },
];

const voces = [
    { nombre: "Soprano",  icono: "👩", archivo: "Soprano.mp4" },
    { nombre: "Alto",     icono: "👩", archivo: "Alto.mp4" },
    { nombre: "Tenor",    icono: "👨", archivo: "Tenor.mpeg" },
    { nombre: "Bajo",     icono: "👨", archivo: "Bajo.mpeg" },
];

function crearListaCanciones() {
    renderCategoria(warmup, "warmup-list", "repetorio/warmup");
    renderCategoria(canciones, "canciones-list", "repetorio/canciones");
}

function crearPlayerRow(rutaAudio) {
    const playerRow = document.createElement("li");
    playerRow.className = "audio-player-row hidden";
    playerRow.innerHTML = `
        <div class="audio-player-controls">
            <button class="skip-btn skip-back" title="Retroceder 15s">&#8634; 15</button>
            <audio controls preload="none"><source src="${rutaAudio}">Tu navegador no soporta audio.</audio>
            <button class="skip-btn skip-fwd" title="Adelantar 15s">15 &#8635;</button>
        </div>
    `;
    const audio = playerRow.querySelector("audio");
    playerRow.querySelector(".skip-back").addEventListener("click", () => { audio.currentTime = Math.max(0, audio.currentTime - 15); });
    playerRow.querySelector(".skip-fwd").addEventListener("click", () => { audio.currentTime = Math.min(audio.duration || Infinity, audio.currentTime + 15); });
    return playerRow;
}

function renderCategoria(lista, containerId, basePath) {
    const container = document.getElementById(containerId);

    lista.forEach((cancion, index) => {
        const songItem = document.createElement("div");
        songItem.className = "song-item";

        // Header clickeable
        const header = document.createElement("div");
        header.className = "song-header";
        header.setAttribute("role", "button");
        header.setAttribute("tabindex", "0");
        header.setAttribute("aria-expanded", "false");
        header.innerHTML = `
            <div class="song-info">
                <span class="song-number">${index + 1}</span>
                <span class="song-name">${escapeHtml(cancion.nombre)}</span>
            </div>
            <span class="arrow">&#9660;</span>
        `;

        header.addEventListener("click", () => toggleSong(songItem, header));
        header.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggleSong(songItem, header);
            }
        });

        // Submenu de voces
        const vocesMenu = document.createElement("div");
        vocesMenu.className = "voices-menu";

        const ul = document.createElement("ul");

        if (cancion.archivos !== false) {
        // Voces
        const vocesLista = cancion.voces !== undefined ? cancion.voces : voces;
        vocesLista.forEach((voz) => {
            const li = document.createElement("li");
            li.className = "voice-item";
            const rutaAudio = `${basePath}/${encodeURIComponent(cancion.carpeta)}/${encodeURIComponent(voz.archivo)}`;
            li.innerHTML = `
                <div class="voice-info">
                    <span class="voice-icon">${voz.icono}</span>
                    <span class="voice-name">${escapeHtml(voz.nombre)}</span>
                </div>
                <div class="voice-actions">
                    <button class="play-btn" title="Reproducir ${escapeHtml(voz.nombre)}" data-src="${rutaAudio}">
                        &#9654;
                    </button>
                    <a href="${rutaAudio}" download class="download-btn" title="Descargar ${escapeHtml(voz.nombre)}">
                        <span class="btn-icon">&#11015;</span> Descargar
                    </a>
                </div>
            `;

            const playerRow = crearPlayerRow(rutaAudio);

            const playBtn = li.querySelector(".play-btn");
            playBtn.addEventListener("click", () => {
                const audio = playerRow.querySelector("audio");
                const isVisible = !playerRow.classList.contains("hidden");
                if (isVisible) {
                    playerRow.classList.add("hidden");
                    audio.pause();
                    playBtn.innerHTML = "&#9654;";
                } else {
                    playerRow.classList.remove("hidden");
                    audio.play();
                    playBtn.innerHTML = "&#9209;";
                }
            });

            ul.appendChild(li);
            ul.appendChild(playerRow);
        });

        // Todas las voces
        if (cancion.todas) {
            const rutaTodas = `${basePath}/${encodeURIComponent(cancion.carpeta)}/${encodeURIComponent(cancion.todas)}`;
            const liTodas = document.createElement("li");
            liTodas.className = "voice-item";
            liTodas.innerHTML = `
                <div class="voice-info">
                    <span class="voice-icon">🎶</span>
                    <span class="voice-name">Todas las voces</span>
                </div>
                <div class="voice-actions">
                    <button class="play-btn todas-btn" title="Reproducir Todas las voces" data-src="${rutaTodas}">
                        &#9654;
                    </button>
                    <a href="${rutaTodas}" download class="download-btn" title="Descargar Todas las voces">
                        <span class="btn-icon">&#11015;</span> Descargar
                    </a>
                </div>
            `;

            const todasPlayerRow = crearPlayerRow(rutaTodas);

            const todasPlayBtn = liTodas.querySelector(".play-btn");
            todasPlayBtn.addEventListener("click", () => {
                const audio = todasPlayerRow.querySelector("audio");
                const isVisible = !todasPlayerRow.classList.contains("hidden");
                if (isVisible) {
                    todasPlayerRow.classList.add("hidden");
                    audio.pause();
                    todasPlayBtn.innerHTML = "&#9654;";
                } else {
                    todasPlayerRow.classList.remove("hidden");
                    audio.play();
                    todasPlayBtn.innerHTML = "&#9209;";
                }
            });

            ul.appendChild(liTodas);
            ul.appendChild(todasPlayerRow);
        }

        // Pista (instrumental)
        const pistaFile = cancion.pista || "pista.mp3";
        const rutaPista = `${basePath}/${encodeURIComponent(cancion.carpeta)}/${encodeURIComponent(pistaFile)}`;
        const liPista = document.createElement("li");
        liPista.className = "voice-item";
        liPista.innerHTML = `
            <div class="voice-info">
                <span class="voice-icon">🎵</span>
                <span class="voice-name">Pista</span>
            </div>
            <div class="voice-actions">
                <button class="play-btn pista-btn" title="Reproducir Pista" data-src="${rutaPista}">
                    &#9654;
                </button>
                <a href="${rutaPista}" download class="download-btn pista-download-btn" title="Descargar Pista">
                    <span class="btn-icon">&#11015;</span> Descargar
                </a>
            </div>
        `;

        const pistaPlayerRow = crearPlayerRow(rutaPista);

        const pistaPlayBtn = liPista.querySelector(".play-btn");
        pistaPlayBtn.addEventListener("click", () => {
            const audio = pistaPlayerRow.querySelector("audio");
            const isVisible = !pistaPlayerRow.classList.contains("hidden");
            if (isVisible) {
                pistaPlayerRow.classList.add("hidden");
                audio.pause();
                pistaPlayBtn.innerHTML = "&#9654;";
            } else {
                pistaPlayerRow.classList.remove("hidden");
                audio.play();
                pistaPlayBtn.innerHTML = "&#9209;";
            }
        });

        ul.appendChild(liPista);
        ul.appendChild(pistaPlayerRow);

        // Partitura
        const liPartitura = document.createElement("li");
        const partituraFile = cancion.partitura || "Partitura.pdf";
        const rutaPartitura = `${basePath}/${encodeURIComponent(cancion.carpeta)}/${encodeURIComponent(partituraFile)}`;
        liPartitura.innerHTML = `
            <div class="voice-info">
                <span class="voice-icon">📄</span>
                <span class="voice-name">Partitura</span>
            </div>
            <div class="voice-actions">
                <a href="${rutaPartitura}" target="_blank" class="play-btn view-btn" title="Ver Partitura">
                    &#128065;
                </a>
                <a href="${rutaPartitura}" download class="download-btn partitura-btn" title="Descargar Partitura">
                    <span class="btn-icon">&#11015;</span> Descargar
                </a>
            </div>
        `;
        ul.appendChild(liPartitura);
        } // fin if archivos

        vocesMenu.appendChild(ul);
        songItem.appendChild(header);
        songItem.appendChild(vocesMenu);
        container.appendChild(songItem);
    });
}

function toggleSong(songItem, header) {
    const isOpen = songItem.classList.contains("open");

    // Cerrar todas las canciones abiertas
    document.querySelectorAll(".song-item.open").forEach((item) => {
        item.classList.remove("open");
        item.querySelector(".song-header").setAttribute("aria-expanded", "false");
    });

    // Abrir la seleccionada (si no estaba abierta)
    if (!isOpen) {
        songItem.classList.add("open");
        header.setAttribute("aria-expanded", "true");
    }
}

function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Devuelve la lista de URLs (audios + partituras) de todo el repertorio.
 * La usa sw-register.js para precachear todo offline.
 */
function getRepertorioUrls() {
    const urls = [];

    function recolectar(lista, basePath) {
        lista.forEach((cancion) => {
            if (cancion.archivos === false) return;
            const carpeta = `${basePath}/${encodeURIComponent(cancion.carpeta)}`;
            const vocesLista = cancion.voces !== undefined ? cancion.voces : voces;
            vocesLista.forEach((v) => urls.push(`${carpeta}/${encodeURIComponent(v.archivo)}`));
            if (cancion.todas) urls.push(`${carpeta}/${encodeURIComponent(cancion.todas)}`);
            const pistaFile = cancion.pista || "pista.mp3";
            urls.push(`${carpeta}/${encodeURIComponent(pistaFile)}`);
            const partituraFile = cancion.partitura || "Partitura.pdf";
            urls.push(`${carpeta}/${encodeURIComponent(partituraFile)}`);
        });
    }

    recolectar(warmup, "repetorio/warmup");
    recolectar(canciones, "repetorio/canciones");
    return urls;
}
window.getRepertorioUrls = getRepertorioUrls;

document.addEventListener("DOMContentLoaded", crearListaCanciones);
