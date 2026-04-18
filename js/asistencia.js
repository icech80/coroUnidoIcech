/**
 * Asistencia del Coro
 *
 * Datos almacenados en localStorage:
 *   - coro_pin: PIN de acceso (se genera la primera vez)
 *   - coro_members: JSON array de integrantes [{id, nombre, voz}]
 *   - coro_attendance: JSON object { "YYYY-MM-DD": { memberId: true/false } }
 */

const STORAGE_KEYS = {
    PIN: "coro_pin",
    MEMBERS: "coro_members",
    ATTENDANCE: "coro_attendance",
};

// Default PIN — change this to your preferred PIN
const DEFAULT_PIN = "135246";

// ── Data helpers ──

function getPin() {
    let pin = localStorage.getItem(STORAGE_KEYS.PIN);
    if (!pin) {
        localStorage.setItem(STORAGE_KEYS.PIN, DEFAULT_PIN);
        pin = DEFAULT_PIN;
    }
    return pin;
}

function getMembers() {
    const raw = localStorage.getItem(STORAGE_KEYS.MEMBERS);
    return raw ? JSON.parse(raw) : [];
}

function saveMembers(members) {
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));
}

function getAttendance() {
    const raw = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
    return raw ? JSON.parse(raw) : {};
}

function saveAttendance(attendance) {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendance));
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateStr) {
    const [y, m, d] = dateStr.split("-");
    return `${d}/${m}/${y}`;
}

// ── PIN ──

function initPin() {
    const overlay = document.getElementById("pin-overlay");
    const input = document.getElementById("pin-input");
    const btn = document.getElementById("pin-submit");
    const error = document.getElementById("pin-error");

    function tryPin() {
        const pin = getPin();
        if (input.value === pin) {
            overlay.classList.add("hidden");
            document.getElementById("main-content").classList.remove("hidden");
            initApp();
        } else {
            error.classList.remove("hidden");
            input.value = "";
            input.focus();
        }
    }

    btn.addEventListener("click", tryPin);
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") tryPin();
        error.classList.add("hidden");
    });

    // Toggle PIN visibility
    const toggleBtn = document.getElementById("pin-toggle");
    toggleBtn.addEventListener("click", () => {
        const isPassword = input.type === "password";
        input.type = isPassword ? "text" : "password";
        toggleBtn.textContent = isPassword ? "🙈" : "👁";
        input.focus();
    });

    input.focus();
}

// ── Members ──

function renderMembers() {
    const list = document.getElementById("members-list");
    const members = getMembers();

    if (members.length === 0) {
        list.innerHTML = '<p class="empty-msg">No hay integrantes registrados.</p>';
        return;
    }

    // Group by voice
    const groups = {};
    members.forEach((m) => {
        if (!groups[m.voz]) groups[m.voz] = [];
        groups[m.voz].push(m);
    });

    const voiceOrder = ["Soprano", "Alto", "Tenor", "Bajo"];
    let html = "";

    voiceOrder.forEach((voz) => {
        const group = groups[voz];
        if (!group || group.length === 0) return;
        html += `<div class="voice-group">
            <h4 class="voice-group-title">${escapeHtml(voz)} (${group.length})</h4>`;
        group.forEach((m) => {
            html += `<div class="member-row">
                <span class="member-name">${escapeHtml(m.nombre)}</span>
                <div class="member-actions">
                    <select class="voice-select-sm" data-id="${m.id}">
                        ${voiceOrder.map((v) => `<option value="${v}" ${v === m.voz ? "selected" : ""}>${v}</option>`).join("")}
                    </select>
                    <button class="btn btn-danger btn-sm" data-id="${m.id}" title="Eliminar">✕</button>
                </div>
            </div>`;
        });
        html += `</div>`;
    });

    list.innerHTML = html;

    // Change voice
    list.querySelectorAll(".voice-select-sm").forEach((sel) => {
        sel.addEventListener("change", () => {
            const id = sel.dataset.id;
            const members = getMembers();
            const member = members.find((m) => m.id === id);
            if (member) {
                member.voz = sel.value;
                saveMembers(members);
                renderMembers();
            }
        });
    });

    // Delete buttons
    list.querySelectorAll(".btn-danger").forEach((btn) => {
        btn.addEventListener("click", () => {
            const id = btn.dataset.id;
            const member = members.find((m) => m.id === id);
            if (confirm(`¿Eliminar a ${member.nombre}?`)) {
                const updated = members.filter((m) => m.id !== id);
                saveMembers(updated);
                renderMembers();
            }
        });
    });
}

function initMembers() {
    const nameInput = document.getElementById("new-member-name");
    const voiceSelect = document.getElementById("new-member-voice");
    const addBtn = document.getElementById("add-member-btn");

    addBtn.addEventListener("click", () => {
        const nombre = nameInput.value.trim();
        if (!nombre) {
            nameInput.focus();
            return;
        }

        const members = getMembers();
        members.push({
            id: generateId(),
            nombre: nombre,
            voz: voiceSelect.value,
        });
        saveMembers(members);
        nameInput.value = "";
        nameInput.focus();
        renderMembers();
    });

    nameInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") addBtn.click();
    });

    renderMembers();
}

// ── Attendance ──

function initAttendance() {
    const dateInput = document.getElementById("session-date");
    const startBtn = document.getElementById("start-session-btn");
    const form = document.getElementById("attendance-form");
    const attendanceList = document.getElementById("attendance-list");
    const dateLabel = document.getElementById("session-date-label");
    const saveBtn = document.getElementById("save-attendance-btn");

    // Default to today
    dateInput.value = new Date().toISOString().split("T")[0];

    startBtn.addEventListener("click", () => {
        const date = dateInput.value;
        if (!date) return;

        const members = getMembers();
        if (members.length === 0) {
            alert("Primero agrega integrantes.");
            return;
        }

        const attendance = getAttendance();
        const existing = attendance[date] || {};

        dateLabel.textContent = `Sesión: ${formatDate(date)}`;
        form.classList.remove("hidden");

        const voiceOrder = ["Soprano", "Alto", "Tenor", "Bajo"];
        const groups = {};
        members.forEach((m) => {
            if (!groups[m.voz]) groups[m.voz] = [];
            groups[m.voz].push(m);
        });

        let html = "";
        voiceOrder.forEach((voz) => {
            const group = groups[voz];
            if (!group || group.length === 0) return;
            html += `<div class="voice-group">
                <h4 class="voice-group-title">${escapeHtml(voz)}</h4>`;
            group.forEach((m) => {
                const checked = existing[m.id] ? "checked" : "";
                html += `<label class="attendance-row">
                    <input type="checkbox" data-member-id="${m.id}" ${checked}>
                    <span class="checkmark"></span>
                    <span>${escapeHtml(m.nombre)}</span>
                </label>`;
            });
            html += `</div>`;
        });

        attendanceList.innerHTML = html;
    });

    saveBtn.addEventListener("click", () => {
        const date = dateInput.value;
        if (!date) return;

        const attendance = getAttendance();
        attendance[date] = {};

        attendanceList.querySelectorAll("input[type=checkbox]").forEach((cb) => {
            attendance[date][cb.dataset.memberId] = cb.checked;
        });

        saveAttendance(attendance);
        renderHistory();

        // Visual feedback
        saveBtn.textContent = "✅ Guardado";
        setTimeout(() => {
            saveBtn.textContent = "💾 Guardar Asistencia";
        }, 1500);
    });
}

// ── History ──

function renderHistory() {
    const container = document.getElementById("history-container");
    const attendance = getAttendance();
    const members = getMembers();
    const dates = Object.keys(attendance).sort().reverse();

    if (dates.length === 0) {
        container.innerHTML = '<p class="empty-msg">No hay registros de asistencia.</p>';
        return;
    }

    let html = "";

    dates.forEach((date) => {
        const session = attendance[date];
        const present = members.filter((m) => session[m.id]);
        const absent = members.filter((m) => !session[m.id] && session.hasOwnProperty(m.id));
        const total = present.length + absent.length;

        html += `<div class="history-card">
            <div class="history-header">
                <span class="history-date">📅 ${formatDate(date)}</span>
                <span class="history-count">${present.length}/${total} presentes</span>
                <button class="btn btn-danger btn-sm history-delete" data-date="${date}" title="Eliminar sesión">🗑</button>
            </div>
            <div class="history-details">`;

        if (present.length > 0) {
            html += `<p class="present-list">✅ ${present.map((m) => escapeHtml(m.nombre)).join(", ")}</p>`;
        }
        if (absent.length > 0) {
            html += `<p class="absent-list">❌ ${absent.map((m) => escapeHtml(m.nombre)).join(", ")}</p>`;
        }

        html += `</div></div>`;
    });

    container.innerHTML = html;

    // Delete session buttons
    container.querySelectorAll(".history-delete").forEach((btn) => {
        btn.addEventListener("click", () => {
            const date = btn.dataset.date;
            if (confirm(`¿Eliminar la sesión del ${formatDate(date)}?`)) {
                const att = getAttendance();
                delete att[date];
                saveAttendance(att);
                renderHistory();
            }
        });
    });
}

// ── Init ──

function initApp() {
    initMembers();
    initAttendance();
    renderHistory();
}

document.addEventListener("DOMContentLoaded", initPin);
