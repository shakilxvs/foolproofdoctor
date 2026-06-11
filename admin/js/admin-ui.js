// ============================================================
// admin-ui.js — FoolProofDoctor
// Shared UI helpers: toast, modals, loading, dirty tracking
// ============================================================

// ── Toast ─────────────────────────────────────────────────
export function showToast(message, type = "success", duration = 3500) {
  let toast = document.getElementById("adminToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "adminToast";
    toast.className = "admin-toast";
    document.body.appendChild(toast);
  }

  const icons = {
    success: `<svg viewBox="0 0 24 24" fill="none" stroke-width="1.5"><polyline points="20 6 9 17 4 12"/></svg>`,
    error:   `<svg viewBox="0 0 24 24" fill="none" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
    info:    `<svg viewBox="0 0 24 24" fill="none" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
  };

  toast.className = `admin-toast ${type}`;
  toast.innerHTML = `${icons[type] || icons.info}<span>${message}</span>`;

  requestAnimationFrame(() => {
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), duration);
  });
}

// ── Loading overlay on a button ───────────────────────────
export function setButtonLoading(btn, loading, originalText) {
  if (!btn) return;
  if (loading) {
    btn.disabled = true;
    btn.dataset.originalText = btn.textContent;
    btn.textContent = "Saving...";
  } else {
    btn.disabled = false;
    btn.textContent = originalText || btn.dataset.originalText || "Save";
  }
}

// ── Dirty / unsaved changes tracking ─────────────────────
let dirtyState = false;
let dirtyPanel = "";

export function markDirty(panelName) {
  dirtyState = true;
  dirtyPanel = panelName;
  const bar = document.getElementById("saveBar");
  const txt = document.getElementById("saveBarText");
  if (bar) bar.classList.add("visible");
  if (txt) txt.innerHTML = `<strong>Unsaved changes</strong> in ${panelName}`;
}

export function clearDirty() {
  dirtyState = false;
  dirtyPanel = "";
  const bar = document.getElementById("saveBar");
  if (bar) bar.classList.remove("visible");
}

export function isDirty() {
  return dirtyState;
}

// ── Confirm discard ───────────────────────────────────────
export function confirmDiscard() {
  if (!dirtyState) return true;
  return window.confirm("You have unsaved changes. Discard them?");
}

// ── Sidebar toggle (mobile) ───────────────────────────────
// FIX: overlay has inline style="display:none" so we must use
// style.display directly — classList.toggle("visible") cannot
// override an inline style declaration.
export function initMobileSidebar() {
  const sidebar = document.getElementById("adminSidebar");
  const overlay = document.getElementById("sidebarOverlay");

  window.toggleSidebar = function() {
    const isOpen = sidebar.classList.toggle("mobile-open");
    if (overlay) {
      overlay.style.display = isOpen ? "block" : "none";
    }
  };

  if (overlay) {
    overlay.addEventListener("click", () => {
      sidebar.classList.remove("mobile-open");
      overlay.style.display = "none";
    });
  }
}

// ── Active nav item ───────────────────────────────────────
export function setActiveNav(panelId) {
  document.querySelectorAll(".nav-item").forEach(el => {
    el.classList.toggle("active", el.dataset.panel === panelId);
  });
}

// ── Active panel ─────────────────────────────────────────
export function showAdminPanel(panelId) {
  document.querySelectorAll(".panel").forEach(p => p.classList.remove("active"));
  const panel = document.getElementById(`panel-${panelId}`);
  if (panel) panel.classList.add("active");
  setActiveNav(panelId);

  const header = document.getElementById("adminHeaderTitle");
  const titles = {
    dashboard:   "Dashboard",
    submissions: "Submissions",
    content:     "Content Editor",
    services:    "Service Pages",
    branding:    "Branding & Logo",
  };
  if (header) header.textContent = titles[panelId] || panelId;
}

// ── Format date ───────────────────────────────────────────
export function formatDate(ts) {
  if (!ts) return "—";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function formatDateTime(ts) {
  if (!ts) return "—";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "2-digit", minute: "2-digit"
  });
}

// ── Truncate ──────────────────────────────────────────────
export function truncate(str, len = 40) {
  if (!str) return "—";
  return str.length > len ? str.slice(0, len) + "…" : str;
}

// ── Status badge HTML ─────────────────────────────────────
export function statusBadge(status, STATUSES) {
  const s = STATUSES[status] || STATUSES.new;
  return `<span class="status-badge" style="color:${s.color};background:${s.bg}">
    <span class="status-dot" style="background:${s.color}"></span>
    ${s.label}
  </span>`;
}

// ── Detect video URL type ─────────────────────────────────
export function detectVideoType(url) {
  if (!url) return null;
  if (/youtube\.com|youtu\.be/.test(url))  return "YouTube";
  if (/vimeo\.com/.test(url))              return "Vimeo";
  if (/\.(mp4|webm|ogg)$/i.test(url))      return "Direct Video";
  return "External URL";
}

// ── Escape HTML ───────────────────────────────────────────
export function escHtml(str) {
  return String(str || "")
    .replace(/&/g,"&amp;").replace(/</g,"&lt;")
    .replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}
