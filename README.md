# Coro Unido Echaurren 80 - Repertorio Musical

Aplicación web para el coro de la iglesia donde los integrantes pueden consultar el repertorio, escuchar los audios de cada voz, reproducir pistas instrumentales y descargar partituras y archivos de audio.

---

## Estructura del Proyecto

```
APP/
├── index.html              ← Página principal (repertorio)
├── asistencia.html         ← Página de asistencia
├── historial.html          ← Página de historial
├── css/
│   └── styles.css          ← Estilos de la aplicación
├── js/
│   ├── app.js              ← Lógica: repertorio, reproductor, descargas
│   ├── asistencia.js       ← Lógica: registro de asistencia
│   └── historial.js        ← Lógica: historial de asistencia
└── repetorio/
    ├── warmup/             ← Canciones de calentamiento
    │   ├── Amen/
    │   │   ├── soprano.mp3
    │   │   ├── alto.mp3
    │   │   ├── tenor.mp3
    │   │   ├── bajo.mp3
    │   │   ├── todas.mp3
    │   │   ├── pista.mp3
    │   │   └── partitura.jpeg
    │   └── Jubilate deo/
    │       ├── todas.mp3
    │       ├── pista.mp3
    │       └── partitura.jpeg
    └── canciones/          ← Cancionero principal
        ├── Es Exaltado/
        │   ├── Soprano.mp4
        │   ├── Alto.mp4
        │   ├── Tenor.mpeg
        │   ├── Bajo.mpeg
        │   ├── pista.mp3
        │   └── Partitura.pdf
        ├── Medley allabanza su Nombre/
        │   ├── Soprano.mp3
        │   ├── alto.mp3
        │   ├── tenor.mp3
        │   ├── bajo.mp3
        │   ├── Todo Junto.mp3
        │   ├── pista.mp3
        │   └── Partitura.pdf
        ├── ven de todo bien la fuente/
        │   ├── Soprano.mp3
        │   ├── Alto.mp3
        │   ├── Tenor.mp3
        │   ├── Bajo.mp3
        │   ├── Soprano-Cantado.mp3
        │   ├── Alto-Cantado.mp3
        │   ├── Tenor-Cantado.mp3
        │   ├── Bajo-Cantado.mp3
        │   ├── Todas las voces-Cantado.mp3
        │   ├── Pista.mp3
        │   └── Partitura.pdf
        └── Emanuel Dios Con nos/
            ├── Soprano.mp3
            ├── Alto.mp3
            ├── Tenor.mp3
            ├── Bajo.mp3
            ├── Todas las voces.mp3
            ├── Pista.mp3
            └── Partitura 2 sistemas.pdf
```

---

## Funcionalidades

| Función | Descripción |
|---------|-------------|
| **Secciones** | El repertorio se divide en dos categorías: **Warmup** (calentamiento) y **Canciones** (cancionero). |
| **Repertorio** | Lista de canciones en acordeón. Al hacer clic se despliegan las voces disponibles. |
| **Reproducir** | Botón naranja (▶) que reproduce el audio de la voz seleccionada directamente en el navegador. |
| **Retroceder / Adelantar 15s** | Botones (⟲ 15 / 15 ⟳) junto al reproductor para saltar 15 segundos atrás o adelante. En PC aparecen a cada lado del reproductor; en celular aparecen centrados debajo. |
| **Todas las voces** | Botón (▶) para reproducir el audio con todas las voces juntas (🎶). |
| **Pista instrumental** | Botón morado (▶) para reproducir la pista (solo música, sin voces). |
| **Descargar audio** | Botón azul "Descargar" para guardar el archivo de audio en el dispositivo. |
| **Ver partitura** | Botón verde (👁) que abre la partitura (PDF o JPEG) en una nueva pestaña. |
| **Descargar partitura** | Botón verde "Descargar" para guardar la partitura en el dispositivo. |

---

## Cómo agregar una canción nueva

### Paso 1: Crear la carpeta

Dentro de `repetorio/warmup/` o `repetorio/canciones/`, crear una carpeta con el nombre de la canción:

```
repetorio/canciones/
└── Grande Es Tu Fidelidad/
```

### Paso 2: Colocar los archivos

Dentro de esa carpeta, dejar los archivos de audio y partitura. Los nombres por defecto son:

| Archivo | Descripción |
|---------|-------------|
| `Soprano.mp4` | Audio de la voz Soprano |
| `Alto.mp4` | Audio de la voz Alto (Contralto) |
| `Tenor.mpeg` | Audio de la voz Tenor |
| `Bajo.mpeg` | Audio de la voz Bajo |
| `todas.mp3` | Todas las voces juntas (opcional) |
| `Pista.mp3` | Pista instrumental (solo música, opcional) |
| `Partitura.pdf` | Partitura de la canción (puede ser `.pdf` o `.jpeg`) |

> **Nota:** Los nombres y formatos de archivo pueden personalizarse por canción (ver Paso 3).

### Paso 3: Registrar la canción en el código

Abrir el archivo `js/app.js` y agregar la canción al array correspondiente:

**Canción con archivos por defecto (cancionero):**
```js
const canciones = [
    { nombre: "Es Exaltado", carpeta: "Es Exaltado" },
    { nombre: "Ven De Todo Bien La Fuente", carpeta: "ven de todo bien la fuente" },  // ← nueva
];
```

**Canción con archivos personalizados (cancionero):**
```js
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
];
```

**Canción con archivos personalizados (warmup):**
```js
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
];
```

**Propiedades disponibles:**

| Propiedad | Requerida | Descripción |
|-----------|-----------|-------------|
| `nombre` | Sí | Lo que se muestra en pantalla. |
| `carpeta` | Sí | Nombre exacto de la carpeta en `repetorio/warmup/` o `repetorio/canciones/`. |
| `voces` | No | Array de voces personalizadas (nombre, icono, archivo). Si no se define, usa Soprano.mp4, Alto.mp4, Tenor.mpeg, Bajo.mpeg. Si es `[]`, no muestra voces individuales. |
| `todas` | No | Nombre del archivo con todas las voces juntas (ej: `"todas.mp3"`). |
| `pista` | No | Nombre del archivo de pista instrumental. Por defecto: `"Pista.mp3"`. |
| `partitura` | No | Nombre del archivo de partitura. Por defecto: `"Partitura.pdf"`. Soporta `.jpeg`. |
| `archivos` | No | Poner `false` si la carpeta aún no tiene archivos (muestra el acordeón vacío). |

---

## Cómo ejecutar la aplicación

### Opción 1: Abrir directamente
Hacer doble clic en `index.html`. (La reproducción de audio puede no funcionar por restricciones del navegador con archivos locales.)

### Opción 2: Servidor local (recomendado)
Abrir una terminal en la carpeta `APP/` y ejecutar:

```bash
python -m http.server 8080
```

Luego abrir en el navegador: **http://localhost:8080**

---

## Voces disponibles

| Voz | Icono | Tipo |
|-----|-------|------|
| Soprano | 👩 | Femenina (aguda) |
| Alto | 👩 | Femenina (grave) |
| Tenor | 👨 | Masculina (aguda) |
| Bajo | 👨 | Masculina (grave) |

---

## Tecnologías

- HTML5
- CSS3
- JavaScript (vanilla, sin dependencias externas)
- PWA con Service Worker (`sw.js`) para uso **offline**

---

## Modo offline (PWA)

La app funciona sin internet una vez que el contenido se cacheó:

- El **app shell** (HTML/CSS/JS/favicon) se precachea automáticamente al primer acceso.
- Los **audios y partituras** se cachean a medida que se usan, o todos a la vez con el botón **"📥 Descargar todo para usar sin internet"** que aparece arriba del repertorio.
- Si se pierde conexión, aparece un banner inferior **"📴 Sin conexión — usando contenido guardado"**.
- El Service Worker maneja peticiones `Range` para que el reproductor `<audio>` funcione totalmente offline (incluido buscar dentro de la pista).

**Importante:** el Service Worker solo se registra cuando la app se sirve por `https://` o `http://localhost`. Abrir `index.html` con doble clic (esquema `file://`) **no** activa el modo offline. Para probar localmente:

```bash
python -m http.server 8080
# Abrir http://localhost:8080
```

**Forzar actualización:** subir el `VERSION` al inicio de `sw.js` y hacer push.

---

## Despliegue

La app está publicada con GitHub Pages:

- **Repositorio:** https://github.com/icech80/coroUnidoIcech
- **Dominio personalizado (CNAME):** https://ministeriocoro.icech80.cl/ ← URL oficial a compartir
- **URL de GitHub Pages:** https://icech80.github.io/coroUnidoIcech/ (redirige automáticamente al dominio personalizado)

**HTTPS:** el certificado del dominio personalizado es emitido por Let's Encrypt y se renueva automáticamente vía GitHub Pages (`https_enforced: true`, cualquier acceso por `http://` se redirige a `https://`). Si algún usuario ve una advertencia de "sitio no seguro", suele deberse a caché de DNS/navegador desactualizada en su dispositivo, no a un problema del sitio.

### Publicar cambios

Después de modificar cualquier archivo, ejecutar en la terminal dentro de la carpeta `APP/`:

```bash
git add -A
git commit -m "Descripción del cambio"
git push
```

GitHub Pages actualizará la página automáticamente en 1-2 minutos.
