// ============================================================
// admin-dashboard.js — FoolProofDoctor
// Submissions list, status management, live stats
// ============================================================

import { subscribeSubmissions, updateSubmissionStatus } from "/js/firebase-config.js";
import { SUBMISSION_STATUSES } from "/js/content-defaults.js";
import { showToast, formatDate, formatDateTime, truncate, statusBadge, escHtml } from "./admin-ui.js";

// ── State ─────────────────────────────────────────────────
let allSubmissions   = [];
let filteredSubs     = [];
let activeFilter     = "all";
let searchQuery      = "";
let unsubscribeFn    = null;
let currentModalId   = null;

// ── Init Dashboard ────────────────────────────────────────
export function initDashboard() {
  renderDashboardShell();
  startLiveFeed();
}

// ── Start real-time feed ──────────────────────────────────
export function startLiveFeed() {
  if (unsubscribeFn) unsubscribeFn();
  unsubscribeFn = subscribeSubmissions(submissions => {
    allSubmissions = submissions;
    applyFilters();
    updateDashboardStats();
    updateNavBadge();
  });
}

export function stopLiveFeed() {
  if (unsubscribeFn) { unsubscribeFn(); unsubscribeFn = null; }
}

// ── Render dashboard overview stats ──────────────────────
function updateDashboardStats() {
  const total    = allSubmissions.length;
  const newCount = allSubmissions.filter(s => s.status === "new").length;
  const confirmed= allSubmissions.filter(s => s.status === "confirmed").length;
  const thisWeek = allSubmissions.filter(s => {
    if (!s.createdAt) return false;
    const d = s.createdAt.toDate ? s.createdAt.toDate() : new Date(s.createdAt);
    const now = new Date();
    return (now - d) < 7 * 24 * 60 * 60 * 1000;
  }).length;

  setStat("statTotal",     total);
  setStat("statNew",       newCount);
  setStat("statConfirmed", confirmed);
  setStat("statWeek",      thisWeek);

  // Quick status breakdown
  buildStatusBreakdown();

  // Recent submissions on dash
  buildRecentSubmissions();
}

function setStat(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

function buildStatusBreakdown() {
  const el = document.getElementById("statusBreakdown");
  if (!el) return;
  const counts = {};
  Object.keys(SUBMISSION_STATUSES).forEach(k => counts[k] = 0);
  allSubmissions.forEach(s => { if (counts[s.status] !== undefined) counts[s.status]++; });

  el.innerHTML = Object.entries(SUBMISSION_STATUSES).map(([key, s]) => `
    <div class="quick-stat-item">
      <div class="quick-stat-label">
        <span class="quick-stat-dot" style="background:${s.color}"></span>
        ${s.label}
      </div>
      <span class="quick-stat-num">${counts[key]}</span>
    </div>`).join("");
}

function buildRecentSubmissions() {
  const el = document.getElementById("recentSubmissions");
  if (!el) return;
  const recent = allSubmissions.slice(0, 6);
  if (!recent.length) {
    el.innerHTML = `<div class="empty-state">
      <svg viewBox="0 0 24 24" fill="none" stroke-width="1"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/></svg>
      <p>No submissions yet</p>
    </div>`;
    return;
  }
  el.innerHTML = `<div class="table-wrap"><table>
    <thead><tr>
      <th>Name</th><th>Service</th><th>Status</th><th>Date</th>
    </tr></thead>
    <tbody>
      ${recent.map(s => `
        <tr onclick="window.openSubmissionModal('${s.id}')">
          <td class="td-name">${escHtml(s.firstName)} ${escHtml(s.lastName)}</td>
          <td class="td-service">${escHtml(s.service || "—")}</td>
          <td>${statusBadge(s.status, SUBMISSION_STATUSES)}</td>
          <td class="td-date">${formatDate(s.createdAt)}</td>
        </tr>`).join("")}
    </tbody>
  </table></div>`;
}

// ── Nav badge ─────────────────────────────────────────────
function updateNavBadge() {
  const newCount = allSubmissions.filter(s => s.status === "new").length;
  document.querySelectorAll(".submissions-badge").forEach(el => {
    el.textContent = newCount || "";
    el.style.display = newCount ? "flex" : "none";
  });
}

// ── Submissions panel ─────────────────────────────────────
export function initSubmissionsPanel() {
  renderFilters();
  renderSubmissionsTable();
}

function renderFilters() {
  const bar = document.getElementById("submissionsFilterBar");
  if (!bar) return;

  const filters = [
    { key: "all", label: "All" },
    ...Object.entries(SUBMISSION_STATUSES).map(([k, s]) => ({ key: k, label: s.label }))
  ];

  bar.innerHTML = `
    <input class="search-box" id="subSearchBox" type="text" placeholder="Search name or email..." value="${escHtml(searchQuery)}">
    ${filters.map(f => `
      <button class="filter-btn ${activeFilter === f.key ? "active" : ""}"
              onclick="window.setSubFilter('${f.key}')">${f.label}</button>
    `).join("")}
    <div class="filter-spacer"></div>
    <span class="submissions-count" id="subCount"></span>
  `;

  document.getElementById("subSearchBox")?.addEventListener("input", e => {
    searchQuery = e.target.value.toLowerCase();
    applyFilters();
  });
}

window.setSubFilter = function(filter) {
  activeFilter = filter;
  renderFilters();
  applyFilters();
};

function applyFilters() {
  filteredSubs = allSubmissions.filter(s => {
    const matchFilter = activeFilter === "all" || s.status === activeFilter;
    const matchSearch = !searchQuery ||
      `${s.firstName} ${s.lastName} ${s.email} ${s.service}`.toLowerCase().includes(searchQuery);
    return matchFilter && matchSearch;
  });
  renderSubmissionsTable();
  const el = document.getElementById("subCount");
  if (el) el.textContent = `${filteredSubs.length} result${filteredSubs.length !== 1 ? "s" : ""}`;
}

function renderSubmissionsTable() {
  const el = document.getElementById("submissionsTableWrap");
  if (!el) return;

  if (!filteredSubs.length) {
    el.innerHTML = `<div class="empty-state">
      <svg viewBox="0 0 24 24" fill="none" stroke-width="1"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/></svg>
      <p>${allSubmissions.length ? "No submissions match your filter." : "No submissions yet."}</p>
    </div>`;
    return;
  }

  el.innerHTML = `<div class="table-wrap"><table>
    <thead><tr>
      <th>Name</th>
      <th>Email</th>
      <th>Phone</th>
      <th>Service</th>
      <th>Status</th>
      <th>Date</th>
      <th></th>
    </tr></thead>
    <tbody>
      ${filteredSubs.map(s => `
        <tr onclick="window.openSubmissionModal('${s.id}')">
          <td class="td-name">${escHtml(s.firstName)} ${escHtml(s.lastName)}</td>
          <td class="td-email"><a href="mailto:${escHtml(s.email)}" onclick="event.stopPropagation()">${escHtml(s.email)}</a></td>
          <td class="td-email">${escHtml(s.phone || "—")}</td>
          <td class="td-service">${escHtml(s.service || "—")}</td>
          <td>${statusBadge(s.status, SUBMISSION_STATUSES)}</td>
          <td class="td-date">${formatDate(s.createdAt)}</td>
          <td class="td-actions">
            <button class="table-action-btn" onclick="event.stopPropagation();window.openSubmissionModal('${s.id}')">View</button>
          </td>
        </tr>`).join("")}
    </tbody>
  </table></div>`;
}

// ── Submission Detail Modal ───────────────────────────────
window.openSubmissionModal = function(id) {
  const sub = allSubmissions.find(s => s.id === id);
  if (!sub) return;
  currentModalId = id;

  const overlay = document.getElementById("submissionModal");
  if (!overlay) return;

  document.getElementById("modalName").textContent    = `${sub.firstName} ${sub.lastName}`;
  document.getElementById("modalEmail").innerHTML     = `<a href="mailto:${escHtml(sub.email)}">${escHtml(sub.email)}</a>`;
  document.getElementById("modalPhone").textContent   = sub.phone   || "Not provided";
  document.getElementById("modalAge").textContent     = sub.age     || "Not provided";
  document.getElementById("modalService").textContent = sub.service || "Not selected";
  document.getElementById("modalDate").textContent    = formatDateTime(sub.createdAt);
  document.getElementById("modalMessage").textContent = sub.message || "No message provided.";
  document.getElementById("modalNotes").value         = sub.adminNotes || "";
  document.getElementById("modalStatusUpdated").textContent = sub.updatedAt ? formatDateTime(sub.updatedAt) : "—";

  // Status select
  const sel = document.getElementById("modalStatusSelect");
  if (sel) {
    sel.innerHTML = Object.entries(SUBMISSION_STATUSES)
      .map(([k, s]) => `<option value="${k}" ${sub.status === k ? "selected" : ""}>${s.label}</option>`)
      .join("");
  }

  overlay.classList.add("open");
  document.body.style.overflow = "hidden";
};

window.closeSubmissionModal = function() {
  document.getElementById("submissionModal")?.classList.remove("open");
  document.body.style.overflow = "";
  currentModalId = null;
};

window.saveSubmissionStatus = async function() {
  if (!currentModalId) return;
  const sel   = document.getElementById("modalStatusSelect");
  const notes = document.getElementById("modalNotes");
  const btn   = document.getElementById("modalSaveBtn");

  const status    = sel?.value;
  const adminNotes = notes?.value || "";

  if (btn) { btn.disabled = true; btn.textContent = "Saving..."; }

  try {
    await updateSubmissionStatus(currentModalId, status, adminNotes);
    showToast("Status updated successfully.", "success");
    window.closeSubmissionModal();
  } catch (err) {
    showToast("Failed to update status. Please try again.", "error");
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = "Save Changes"; }
  }
};

// ── Render dashboard shell HTML ───────────────────────────
function renderDashboardShell() {
  const dashPanel = document.getElementById("panel-dashboard");
  if (!dashPanel || dashPanel.dataset.built) return;
  dashPanel.dataset.built = "1";
  dashPanel.innerHTML = `
    <div class="dash-stats">
      <div class="dash-stat">
        <div class="dash-stat-top">
          <div class="dash-stat-icon"><svg viewBox="0 0 24 24" fill="none" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/></svg></div>
        </div>
        <div class="dash-stat-num" id="statTotal">—</div>
        <div class="dash-stat-label">Total Submissions</div>
        <div class="dash-stat-bar" style="width:100%"></div>
      </div>
      <div class="dash-stat">
        <div class="dash-stat-top">
          <div class="dash-stat-icon"><svg viewBox="0 0 24 24" fill="none" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
        </div>
        <div class="dash-stat-num" id="statNew">—</div>
        <div class="dash-stat-label">New (Unreviewed)</div>
        <div class="dash-stat-bar" style="width:60%"></div>
      </div>
      <div class="dash-stat">
        <div class="dash-stat-top">
          <div class="dash-stat-icon"><svg viewBox="0 0 24 24" fill="none" stroke-width="1.5"><polyline points="20 6 9 17 4 12"/></svg></div>
        </div>
        <div class="dash-stat-num" id="statConfirmed">—</div>
        <div class="dash-stat-label">Confirmed Clients</div>
        <div class="dash-stat-bar" style="width:40%"></div>
      </div>
      <div class="dash-stat">
        <div class="dash-stat-top">
          <div class="dash-stat-icon"><svg viewBox="0 0 24 24" fill="none" stroke-width="1.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg></div>
        </div>
        <div class="dash-stat-num" id="statWeek">—</div>
        <div class="dash-stat-label">This Week</div>
        <div class="dash-stat-bar" style="width:75%"></div>
      </div>
    </div>
    <div class="dash-grid">
      <div class="dash-panel">
        <div class="dash-panel-header">
          <span class="dash-panel-title">Recent Submissions</span>
          <button class="dash-panel-action" onclick="window.switchPanel('submissions')">View All</button>
        </div>
        <div id="recentSubmissions"></div>
      </div>
      <div class="dash-panel">
        <div class="dash-panel-header">
          <span class="dash-panel-title">Status Breakdown</span>
        </div>
        <div class="quick-stat-list" id="statusBreakdown"></div>
      </div>
    </div>`;
}
