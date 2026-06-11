// ============================================================
// admin-services.js — FoolProofDoctor
// Per-service editor: video URL, titles, descriptions, SEO
// ============================================================

import { saveSiteContent } from "/js/firebase-config.js";
import { SERVICE_KEYS } from "/js/content-defaults.js";
import { showToast, markDirty, clearDirty, setButtonLoading, detectVideoType } from "./admin-ui.js";

let localContent = null;

const SERVICE_LABELS = {
  mortgage:   "Mortgage Protection",
  income:     "Income Protection",
  business:   "Business Protection",
  family:     "Family Protection",
  retirement: "Retirement Planning",
  final:      "Final Expense",
};

// ── Init ──────────────────────────────────────────────────
export function initServicesEditor(content) {
  localContent = JSON.parse(JSON.stringify(content));
  buildServicesEditor();
  populateServiceFields();
}

// ── Build HTML ────────────────────────────────────────────
function buildServicesEditor() {
  const panel = document.getElementById("panel-services");
  if (!panel || panel.dataset.built) return;
  panel.dataset.built = "1";

  panel.innerHTML = `
    <div class="service-tabs" id="serviceTabsBar">
      ${SERVICE_KEYS.map((key, i) => `
        <button class="service-tab ${i===0?"active":""}"
                data-key="${key}"
                onclick="window.switchServiceTab('${key}')">
          ${SERVICE_LABELS[key]}
        </button>`).join("")}
    </div>

    ${SERVICE_KEYS.map((key, i) => `
      <div class="service-tab-content ${i===0?"active":""}" id="stab-${key}">
        <div class="editor-card">
          <div class="editor-card-header">
            <div class="editor-card-title">
              <svg viewBox="0 0 24 24" fill="none" stroke-width="1.5" width="14" height="14"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              ${SERVICE_LABELS[key]}
            </div>
          </div>
          <div class="editor-card-body">

            <!-- Video URL -->
            <div class="editor-group">
              <label class="editor-label">Video URL</label>
              <input class="editor-input" id="sv-${key}-video"
                     type="url"
                     placeholder="https://youtube.com/watch?v=... or https://vimeo.com/... or direct .mp4 URL"
                     oninput="window.previewVideoUrl('${key}')">
              <div id="sv-${key}-video-preview" class="video-url-preview" style="display:none;"></div>
              <div class="editor-hint">
                Supports: YouTube, Vimeo, or any direct video URL (MP4, WebM).
                Leave blank to show the animated placeholder.
              </div>
            </div>

            <!-- Page eyebrow -->
            <div class="editor-group">
              <label class="editor-label">Page Eyebrow Label</label>
              <input class="editor-input" id="sv-${key}-eyebrow" type="text"
                     placeholder="e.g. 01 / Mortgage Protection">
            </div>

            <!-- Card content -->
            <div style="margin-top:4px;padding-top:16px;border-top:1px solid var(--border2);">
              <div class="editor-label" style="margin-bottom:12px;font-size:11px;letter-spacing:0.12em;color:var(--gold);">SERVICE CARD (homepage grid)</div>
              <div class="editor-row">
                <div class="editor-group">
                  <label class="editor-label">Card Title</label>
                  <input class="editor-input" id="sv-${key}-cardTitle" type="text">
                </div>
              </div>
              <div class="editor-group">
                <label class="editor-label">Card Description</label>
                <textarea class="editor-textarea" id="sv-${key}-cardDesc"></textarea>
              </div>
            </div>

            <!-- Service page content -->
            <div style="margin-top:4px;padding-top:16px;border-top:1px solid var(--border2);">
              <div class="editor-label" style="margin-bottom:12px;font-size:11px;letter-spacing:0.12em;color:var(--gold);">SERVICE PAGE</div>
              <div class="editor-row">
                <div class="editor-group">
                  <label class="editor-label">Page Title</label>
                  <input class="editor-input" id="sv-${key}-pageTitle" type="text">
                  <div class="editor-hint">Last word(s) will appear in italic gold</div>
                </div>
                <div class="editor-group">
                  <label class="editor-label">Video Label</label>
                  <input class="editor-input" id="sv-${key}-videoLabel" type="text"
                         placeholder="e.g. Understanding Mortgage Protection">
                </div>
              </div>
            </div>

            <!-- Form info -->
            <div style="margin-top:4px;padding-top:16px;border-top:1px solid var(--border2);">
              <div class="editor-label" style="margin-bottom:12px;font-size:11px;letter-spacing:0.12em;color:var(--gold);">FORM INFO PANEL</div>
              <div class="editor-group">
                <label class="editor-label">Form Title</label>
                <input class="editor-input" id="sv-${key}-formTitle" type="text">
              </div>
              <div class="editor-group">
                <label class="editor-label">Form Italic Part (must be part of Form Title)</label>
                <input class="editor-input" id="sv-${key}-formTitleItalic" type="text">
                <div class="editor-hint">This exact phrase will appear in italic gold within the form title above.</div>
              </div>
              <div class="editor-group">
                <label class="editor-label">Form Description Paragraph</label>
                <textarea class="editor-textarea" id="sv-${key}-formText" style="min-height:80px;"></textarea>
              </div>
            </div>

            <!-- SEO -->
            <div style="margin-top:4px;padding-top:16px;border-top:1px solid var(--border2);">
              <div class="editor-label" style="margin-bottom:12px;font-size:11px;letter-spacing:0.12em;color:var(--gold);">SEO</div>
              <div class="editor-row">
                <div class="editor-group">
                  <label class="editor-label">Meta Title</label>
                  <input class="editor-input" id="sv-${key}-metaTitle" type="text">
                </div>
              </div>
              <div class="editor-group">
                <label class="editor-label">Meta Description</label>
                <textarea class="editor-textarea" id="sv-${key}-metaDesc"></textarea>
              </div>
              <div class="editor-group">
                <label class="editor-label">URL Slug</label>
                <div style="display:flex;align-items:center;gap:8px;">
                  <span style="font-size:13px;color:var(--muted);">foolproofdoctor.com/</span>
                  <input class="editor-input" id="sv-${key}-slug" type="text"
                         style="flex:1;" placeholder="mortgage-protection">
                </div>
                <div class="editor-hint">Lowercase, hyphens only. Example: mortgage-protection</div>
              </div>
            </div>

          </div>
        </div>
      </div>`).join("")}

    <button class="btn-save-primary" id="servicesSaveBtn"
            onclick="window.saveServicesEditor()"
            style="width:100%;padding:16px;font-size:12px;margin-top:8px;">
      Save Service Changes
    </button>`;

  // Dirty tracking
  panel.querySelectorAll(".editor-input,.editor-textarea").forEach(el => {
    el.addEventListener("input", () => markDirty("Service Pages"));
  });
}

// ── Populate fields ───────────────────────────────────────
function populateServiceFields() {
  SERVICE_KEYS.forEach(key => {
    const s = localContent.services[key];
    if (!s) return;
    setVal(`sv-${key}-video`,           s.videoUrl || "");
    setVal(`sv-${key}-eyebrow`,         s.eyebrow || "");
    setVal(`sv-${key}-cardTitle`,       s.cardTitle || "");
    setVal(`sv-${key}-cardDesc`,        s.cardDesc || "");
    setVal(`sv-${key}-pageTitle`,       s.pageTitle || "");
    setVal(`sv-${key}-videoLabel`,      s.videoLabel || "");
    setVal(`sv-${key}-formTitle`,       s.formTitle || "");
    setVal(`sv-${key}-formTitleItalic`, s.formTitleItalic || "");
    setVal(`sv-${key}-formText`,        s.formText || "");
    setVal(`sv-${key}-metaTitle`,       s.metaTitle || "");
    setVal(`sv-${key}-metaDesc`,        s.metaDesc || "");
    setVal(`sv-${key}-slug`,            s.slug || "");

    // Show video preview if URL exists
    if (s.videoUrl) previewVideoUrlFor(key, s.videoUrl);
  });
}

// ── Video URL preview ─────────────────────────────────────
window.previewVideoUrl = function(key) {
  const url = document.getElementById(`sv-${key}-video`)?.value?.trim();
  previewVideoUrlFor(key, url);
};

function previewVideoUrlFor(key, url) {
  const preview = document.getElementById(`sv-${key}-video-preview`);
  if (!preview) return;
  if (!url) { preview.style.display = "none"; return; }
  const type = detectVideoType(url);
  preview.style.display = "flex";
  preview.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke-width="1.5">
      <polygon points="5 3 19 12 5 21 5 3"/>
    </svg>
    <span>Detected: <strong>${type}</strong></span>
    <span class="video-type-badge">${type}</span>`;
}

// ── Tab switcher ──────────────────────────────────────────
window.switchServiceTab = function(key) {
  document.querySelectorAll(".service-tab").forEach(t => t.classList.toggle("active", t.dataset.key === key));
  document.querySelectorAll(".service-tab-content").forEach(c => c.classList.toggle("active", c.id === `stab-${key}`));
};

// ── Save ──────────────────────────────────────────────────
window.saveServicesEditor = async function() {
  const btn = document.getElementById("servicesSaveBtn");
  setButtonLoading(btn, true);

  SERVICE_KEYS.forEach(key => {
    if (!localContent.services[key]) return;
    localContent.services[key].videoUrl        = getVal(`sv-${key}-video`);
    localContent.services[key].eyebrow         = getVal(`sv-${key}-eyebrow`);
    localContent.services[key].cardTitle       = getVal(`sv-${key}-cardTitle`);
    localContent.services[key].cardDesc        = getVal(`sv-${key}-cardDesc`);
    localContent.services[key].pageTitle       = getVal(`sv-${key}-pageTitle`);
    localContent.services[key].videoLabel      = getVal(`sv-${key}-videoLabel`);
    localContent.services[key].formTitle       = getVal(`sv-${key}-formTitle`);
    localContent.services[key].formTitleItalic = getVal(`sv-${key}-formTitleItalic`);
    localContent.services[key].formText        = getVal(`sv-${key}-formText`);
    localContent.services[key].metaTitle       = getVal(`sv-${key}-metaTitle`);
    localContent.services[key].metaDesc        = getVal(`sv-${key}-metaDesc`);
    localContent.services[key].slug            = getVal(`sv-${key}-slug`);
  });

  try {
    await saveSiteContent(localContent);
    clearDirty();
    showToast("Service pages saved successfully.", "success");
  } catch (err) {
    showToast("Failed to save. Please try again.", "error");
  } finally {
    setButtonLoading(btn, false, "Save Service Changes");
  }
};

// ── Helpers ───────────────────────────────────────────────
function setVal(id, val) { const el = document.getElementById(id); if (el) el.value = val || ""; }
function getVal(id)       { return document.getElementById(id)?.value?.trim() || ""; }
