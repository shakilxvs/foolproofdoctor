// ============================================================
// admin-settings.js — FoolProofDoctor
// Branding: logo type, image/text, accent color, favicon
// ============================================================

import { saveBranding, loadBranding } from "/js/firebase-config.js";
import { showToast, markDirty, clearDirty, setButtonLoading } from "./admin-ui.js";

let localBranding = null;

// ── Init ──────────────────────────────────────────────────
export async function initSettingsPanel(content) {
  // Try loading branding from Firestore (may differ from content.branding)
  try {
    const remote = await loadBranding();
    localBranding = remote || JSON.parse(JSON.stringify(content.branding));
  } catch {
    localBranding = JSON.parse(JSON.stringify(content.branding));
  }

  buildSettingsPanel();
  populateBrandingFields();
}

// ── Build HTML ────────────────────────────────────────────
function buildSettingsPanel() {
  const panel = document.getElementById("panel-branding");
  if (!panel || panel.dataset.built) return;
  panel.dataset.built = "1";

  panel.innerHTML = `
    <div class="settings-grid">

      <!-- Logo Card -->
      <div class="editor-card" style="grid-column:1/-1;">
        <div class="editor-card-header">
          <div class="editor-card-title">
            <svg viewBox="0 0 24 24" fill="none" stroke-width="1.5" width="14" height="14"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            Logo
          </div>
        </div>
        <div class="editor-card-body">
          <div class="editor-label" style="margin-bottom:10px;">Logo Type</div>
          <div class="logo-type-toggle">
            <button class="logo-type-btn active" id="logoTypeTextBtn" onclick="window.setLogoType('text')">Text Logo</button>
            <button class="logo-type-btn"        id="logoTypeImageBtn" onclick="window.setLogoType('image')">Image Logo</button>
          </div>

          <!-- Text logo options -->
          <div id="logoTextOptions">
            <div class="editor-row">
              <div class="editor-group">
                <label class="editor-label">Logo Text</label>
                <input class="editor-input" id="br-logoText" type="text"
                       placeholder="FoolProofDoctor"
                       oninput="window.updateLogoPreview()">
              </div>
              <div class="editor-group">
                <label class="editor-label">Accent Part (gold color)</label>
                <input class="editor-input" id="br-logoAccent" type="text"
                       placeholder="Doctor"
                       oninput="window.updateLogoPreview()">
                <div class="editor-hint">This exact word/phrase within the logo text will be gold.</div>
              </div>
            </div>
          </div>

          <!-- Image logo options -->
          <div id="logoImageOptions" style="display:none;">
            <div class="editor-group">
              <label class="editor-label">Logo Image URL</label>
              <input class="editor-input" id="br-logoImageUrl" type="url"
                     placeholder="https://your-storage.com/logo.png"
                     oninput="window.updateLogoPreview()">
              <div class="editor-hint">
                Paste a direct image URL (PNG, SVG, WebP). Host on Shopify, WordPress, Cloudinary, or any CDN.
              </div>
            </div>
            <div class="editor-group">
              <label class="editor-label">Logo Width</label>
              <input class="editor-input" id="br-logoImageWidth" type="text"
                     placeholder="160px"
                     oninput="window.updateLogoPreview()">
              <div class="editor-hint">CSS width, e.g. 160px or 10rem</div>
            </div>
          </div>

          <!-- Preview -->
          <div class="editor-label" style="margin-top:20px;margin-bottom:8px;">Preview</div>
          <div class="logo-preview" id="logoPreview">
            <div class="logo-preview-text" id="logoPreviewInner">
              FoolProof<span class="accent">Doctor</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Favicon -->
      <div class="editor-card">
        <div class="editor-card-header">
          <div class="editor-card-title">
            <svg viewBox="0 0 24 24" fill="none" stroke-width="1.5" width="14" height="14"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
            Favicon
          </div>
        </div>
        <div class="editor-card-body">
          <div class="editor-group">
            <label class="editor-label">Favicon URL</label>
            <input class="editor-input" id="br-favicon" type="url"
                   placeholder="/favicon.svg or https://...">
            <div class="editor-hint">
              SVG or PNG. Leave as /favicon.svg to use the default gold "F" icon.
            </div>
          </div>
        </div>
      </div>

      <!-- Accent Color -->
      <div class="editor-card">
        <div class="editor-card-header">
          <div class="editor-card-title">
            <svg viewBox="0 0 24 24" fill="none" stroke-width="1.5" width="14" height="14"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4" fill="currentColor"/></svg>
            Brand Colors
          </div>
        </div>
        <div class="editor-card-body">
          <div class="editor-group">
            <label class="editor-label">Primary Gold (accent color)</label>
            <div class="color-row">
              <div class="color-swatch-wrap">
                <div class="color-swatch" id="colorSwatch1" style="background:#c8a96e;"></div>
                <input type="color" class="color-input-hidden" id="colorPicker1"
                       value="#c8a96e"
                       oninput="window.syncColor(1)">
              </div>
              <input class="color-hex" id="colorHex1" type="text"
                     value="#c8a96e" placeholder="#c8a96e" maxlength="7"
                     oninput="window.syncColorFromHex(1)">
            </div>
            <div class="editor-hint">Used for headings, icons, borders, buttons, and all accents.</div>
          </div>
          <div class="editor-group" style="margin-top:16px;">
            <label class="editor-label">Gold Hover (button hover color)</label>
            <div class="color-row">
              <div class="color-swatch-wrap">
                <div class="color-swatch" id="colorSwatch2" style="background:#e8c98e;"></div>
                <input type="color" class="color-input-hidden" id="colorPicker2"
                       value="#e8c98e"
                       oninput="window.syncColor(2)">
              </div>
              <input class="color-hex" id="colorHex2" type="text"
                     value="#e8c98e" placeholder="#e8c98e" maxlength="7"
                     oninput="window.syncColorFromHex(2)">
            </div>
          </div>

          <!-- Live preview -->
          <div style="margin-top:20px;">
            <div class="editor-label" style="margin-bottom:8px;">Color Preview</div>
            <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
              <div id="colorPreviewBtn"
                   style="padding:10px 20px;font-size:11px;font-weight:500;letter-spacing:0.1em;text-transform:uppercase;background:#c8a96e;color:#0a0a0b;cursor:default;">
                Button
              </div>
              <div id="colorPreviewText"
                   style="font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:300;font-style:italic;color:#c8a96e;">
                Accent Text
              </div>
              <div id="colorPreviewBorder"
                   style="width:40px;height:1px;background:#c8a96e;"></div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <button class="btn-save-primary" id="brandingSaveBtn"
            onclick="window.saveBrandingSettings()"
            style="width:100%;padding:16px;font-size:12px;margin-top:16px;">
      Save Branding
    </button>`;

  // Dirty tracking
  panel.querySelectorAll(".editor-input,.editor-textarea").forEach(el => {
    el.addEventListener("input", () => markDirty("Branding"));
  });
}

// ── Populate fields ───────────────────────────────────────
function populateBrandingFields() {
  const B = localBranding;
  if (!B) return;

  setVal("br-logoText",       B.logoText       || "FoolProofDoctor");
  setVal("br-logoAccent",     B.logoTextAccent || "Doctor");
  setVal("br-logoImageUrl",   B.logoImageUrl   || "");
  setVal("br-logoImageWidth", B.logoImageWidth || "160px");
  setVal("br-favicon",        B.faviconUrl     || "/favicon.svg");

  const gold  = B.accentColor      || "#c8a96e";
  const gold2 = B.accentColorHover || "#e8c98e";
  setColorPair(1, gold);
  setColorPair(2, gold2);

  setLogoTypeUI(B.logoType || "text");
  updateLogoPreviewFromBranding(B);
}

// ── Logo type toggle ──────────────────────────────────────
window.setLogoType = function(type) {
  localBranding = localBranding || {};
  localBranding.logoType = type;
  setLogoTypeUI(type);
  markDirty("Branding");
  updateLogoPreview();
};

function setLogoTypeUI(type) {
  document.getElementById("logoTypeTextBtn") ?.classList.toggle("active", type === "text");
  document.getElementById("logoTypeImageBtn")?.classList.toggle("active", type === "image");
  const textOpts  = document.getElementById("logoTextOptions");
  const imageOpts = document.getElementById("logoImageOptions");
  if (textOpts)  textOpts.style.display  = type === "text"  ? "block" : "none";
  if (imageOpts) imageOpts.style.display = type === "image" ? "block" : "none";
}

// ── Live logo preview ─────────────────────────────────────
window.updateLogoPreview = function() {
  const type    = localBranding?.logoType || "text";
  const preview = document.getElementById("logoPreviewInner");
  if (!preview) return;

  if (type === "image") {
    const url   = document.getElementById("br-logoImageUrl")?.value?.trim();
    const width = document.getElementById("br-logoImageWidth")?.value?.trim() || "160px";
    if (url) {
      preview.innerHTML = `<img src="${url}" alt="Logo" style="max-width:${width};height:auto;object-fit:contain;">`;
    } else {
      preview.textContent = "Paste an image URL above to preview";
      preview.style.fontSize = "13px";
    }
  } else {
    const text   = document.getElementById("br-logoText")?.value   || "FoolProofDoctor";
    const accent = document.getElementById("br-logoAccent")?.value || "Doctor";
    const base   = text.replace(accent, "");
    const gold   = document.getElementById("colorHex1")?.value || "#c8a96e";
    preview.innerHTML = `<span style="font-family:'Cormorant Garamond',serif;font-size:24px;font-weight:600;">${base}<span style="color:${gold};">${accent}</span></span>`;
  }
};

function updateLogoPreviewFromBranding(B) {
  setTimeout(updateLogoPreview, 50);
}

// ── Color sync ────────────────────────────────────────────
window.syncColor = function(n) {
  const picker = document.getElementById(`colorPicker${n}`);
  const hex    = document.getElementById(`colorHex${n}`);
  const swatch = document.getElementById(`colorSwatch${n}`);
  if (!picker) return;
  const val = picker.value;
  if (hex)    hex.value = val;
  if (swatch) swatch.style.background = val;
  updateColorPreview();
  markDirty("Branding");
};

window.syncColorFromHex = function(n) {
  const hex    = document.getElementById(`colorHex${n}`);
  const picker = document.getElementById(`colorPicker${n}`);
  const swatch = document.getElementById(`colorSwatch${n}`);
  if (!hex) return;
  const val = hex.value.trim();
  if (/^#[0-9a-fA-F]{6}$/.test(val)) {
    if (picker) picker.value = val;
    if (swatch) swatch.style.background = val;
    updateColorPreview();
    markDirty("Branding");
  }
};

function setColorPair(n, color) {
  const picker = document.getElementById(`colorPicker${n}`);
  const hex    = document.getElementById(`colorHex${n}`);
  const swatch = document.getElementById(`colorSwatch${n}`);
  if (picker) picker.value = color;
  if (hex)    hex.value    = color;
  if (swatch) swatch.style.background = color;
  updateColorPreview();
}

function updateColorPreview() {
  const gold  = document.getElementById("colorHex1")?.value || "#c8a96e";
  const btn   = document.getElementById("colorPreviewBtn");
  const text  = document.getElementById("colorPreviewText");
  const border= document.getElementById("colorPreviewBorder");
  if (btn)    btn.style.background   = gold;
  if (text)   text.style.color       = gold;
  if (border) border.style.background= gold;
  updateLogoPreview();
}

// ── Save ──────────────────────────────────────────────────
window.saveBrandingSettings = async function() {
  const btn = document.getElementById("brandingSaveBtn");
  setButtonLoading(btn, true);

  const type = localBranding?.logoType || "text";
  const branding = {
    logoType:         type,
    logoText:         getVal("br-logoText"),
    logoTextAccent:   getVal("br-logoAccent"),
    logoImageUrl:     getVal("br-logoImageUrl"),
    logoImageWidth:   getVal("br-logoImageWidth") || "160px",
    faviconUrl:       getVal("br-favicon") || "/favicon.svg",
    accentColor:      getVal("colorHex1") || "#c8a96e",
    accentColorHover: getVal("colorHex2") || "#e8c98e",
  };
  localBranding = branding;

  try {
    await saveBranding(branding);
    clearDirty();
    showToast("Branding saved. Reload the site to see changes.", "success");
  } catch (err) {
    showToast("Failed to save branding. Please try again.", "error");
  } finally {
    setButtonLoading(btn, false, "Save Branding");
  }
};

// ── Helpers ───────────────────────────────────────────────
function setVal(id, val) { const el = document.getElementById(id); if (el) el.value = val || ""; }
function getVal(id)       { return document.getElementById(id)?.value?.trim() || ""; }
