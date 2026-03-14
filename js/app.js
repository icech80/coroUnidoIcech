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
    { nombre: "Amen", carpeta: "Amen", archivos: false },
    { nombre: "Jubilate Deo", carpeta: "Jubilate deo", archivos: false },
];

const canciones = [
    { nombre: "Es Exaltado", carpeta: "Es Exaltado" },
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
        voces.forEach((voz) => {
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

            const playerRow = document.createElement("li");
            playerRow.className = "audio-player-row hidden";
            playerRow.innerHTML = `<audio controls preload="none"><source src="${rutaAudio}">Tu navegador no soporta audio.</audio>`;

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

        // Pista (instrumental)
        const rutaPista = `${basePath}/${encodeURIComponent(cancion.carpeta)}/Pista.mp3`;
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

        const pistaPlayerRow = document.createElement("li");
        pistaPlayerRow.className = "audio-player-row hidden";
        pistaPlayerRow.innerHTML = `<audio controls preload="none"><source src="${rutaPista}">Tu navegador no soporta audio.</audio>`;

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
        const rutaPartitura = `${basePath}/${encodeURIComponent(cancion.carpeta)}/Partitura.pdf`;
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

document.addEventListener("DOMContentLoaded", crearListaCanciones);
