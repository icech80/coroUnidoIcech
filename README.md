# Coro Unido Echaurren 80 - Repertorio Musical

Aplicación web para el coro de la iglesia donde los integrantes pueden consultar el repertorio, escuchar los audios de cada voz y descargar partituras y archivos de audio.

---

## Estructura del Proyecto

```
APP/
├── index.html              ← Página principal
├── css/
│   └── styles.css          ← Estilos de la aplicación
├── js/
│   └── app.js              ← Lógica: repertorio, reproductor, descargas
└── repetorio/              ← Carpeta con todas las canciones
    └── Es Exaltado/        ← Ejemplo de canción
        ├── Soprano.mp4
        ├── Alto.mp4
        ├── Tenor.mpeg
        ├── Bajo.mpeg
        └── Partitura.pdf
```

---

## Funcionalidades

| Función | Descripción |
|---------|-------------|
| **Repertorio** | Lista de canciones. Al hacer clic se despliegan las voces disponibles. |
| **Reproducir** | Botón naranja (▶) que reproduce el audio de la voz seleccionada directamente en el navegador. |
| **Descargar audio** | Botón azul "Descargar" para guardar el archivo de audio en el dispositivo. |
| **Ver partitura** | Botón verde (👁) que abre el PDF de la partitura en una nueva pestaña. |
| **Descargar partitura** | Botón verde "Descargar" para guardar el PDF en el dispositivo. |

---

## Cómo agregar una canción nueva

### Paso 1: Crear la carpeta

Dentro de `repetorio/`, crear una carpeta con el nombre de la canción. Ejemplo:

```
repetorio/
└── Grande Es Tu Fidelidad/
```

### Paso 2: Colocar los archivos

Dentro de esa carpeta, dejar los siguientes archivos con estos nombres exactos:

| Archivo | Descripción |
|---------|-------------|
| `Soprano.mp4` | Audio de la voz Soprano |
| `Alto.mp4` | Audio de la voz Alto (Contralto) |
| `Tenor.mpeg` | Audio de la voz Tenor |
| `Bajo.mpeg` | Audio de la voz Bajo |
| `Partitura.pdf` | Partitura de la canción |

### Paso 3: Registrar la canción en el código

Abrir el archivo `js/app.js` y agregar la canción al array `repertorio`:

```js
const repertorio = [
    { nombre: "Es Exaltado", carpeta: "Es Exaltado" },
    { nombre: "Grande Es Tu Fidelidad", carpeta: "Grande Es Tu Fidelidad" },  // ← nueva
];
```

- **nombre**: lo que se muestra en pantalla.
- **carpeta**: el nombre exacto de la carpeta dentro de `repetorio/`.

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
