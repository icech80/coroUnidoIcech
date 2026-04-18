/**
 * Historial público de asistencia (solo lectura, sin PIN)
 */

const STORAGE_KEYS = {
    MEMBERS: "coro_members",
    ATTENDANCE: "coro_attendance",
};

function getMembers() {
    const raw = localStorage.getItem(STORAGE_KEYS.MEMBERS);
    return raw ? JSON.parse(raw) : [];
}

function getAttendance() {
    const raw = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
    return raw ? JSON.parse(raw) : {};
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

function renderMembersSummary() {
    const container = document.getElementById("members-summary");
    const members = getMembers();

    if (members.length === 0) {
        container.innerHTML = '<p class="empty-msg">No hay integrantes registrados.</p>';
        return;
    }

    const groups = {};
    members.forEach((m) => {
        if (!groups[m.voz]) groups[m.voz] = [];
        groups[m.voz].push(m);
    });

    const voiceOrder = ["Soprano", "Alto", "Tenor", "Bajo"];
    let html = `<p class="total-members">Total: <strong>${members.length}</strong> integrantes</p>`;

    voiceOrder.forEach((voz) => {
        const group = groups[voz];
        if (!group || group.length === 0) return;
        html += `<div class="voice-group">
            <h4 class="voice-group-title">${escapeHtml(voz)} (${group.length})</h4>`;
        group.forEach((m) => {
            html += `<div class="member-row">
                <span class="member-name">${escapeHtml(m.nombre)}</span>
            </div>`;
        });
        html += `</div>`;
    });

    container.innerHTML = html;
}

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
}

document.addEventListener("DOMContentLoaded", () => {
    renderMembersSummary();
    renderHistory();
});
