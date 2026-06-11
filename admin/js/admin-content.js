// ============================================================
// admin-content.js — FoolProofDoctor
// Content editor: hero, about, testimonial, CTA, footer, nav
// ============================================================

import { saveSiteContent } from "/js/firebase-config.js";
import { DEFAULT_CONTENT } from "/js/content-defaults.js";
import { showToast, markDirty, clearDirty, setButtonLoading } from "./admin-ui.js";

let localContent = null;

// ── Init ──────────────────────────────────────────────────
export function initContentEditor(content) {
  localContent = JSON.parse(JSON.stringify(content)); // deep clone
  buildContentEditor();
  populateFields();
}

// ── Build editor HTML ─────────────────────────────────────
function buildContentEditor() {
  const panel = document.getElementById("panel-content");
  if (!panel || panel.dataset.built) return;
  panel.dataset.built = "1";

  panel.innerHTML = `
    <div class="editor-grid">
      <!-- Left nav -->
      <nav class="editor-nav" id="contentEditorNav">
        ${[
          { id:"hero",        icon: heroIcon(),        label: "Hero Section"   },
          { id:"about",       icon: aboutIcon(),       label: "About Section"  },
          { id:"services",    icon: servicesIcon(),    label: "Services Grid"  },
          { id:"testimonial", icon: testimonialIcon(), label: "Testimonial"    },
          { id:"cta",         icon: ctaIcon(),         label: "CTA Banner"     },
          { id:"form",        icon: formIcon(),        label: "Contact Form"   },
          { id:"footer",      icon: footerIcon(),      label: "Footer"         },
          { id:"contact",     icon: contactIcon(),     label: "Contact Info"   },
          { id:"seo",         icon: seoIcon(),         label: "SEO & Meta"     },
        ].map((item, i) => `
          <button class="editor-nav-item ${i===0?"active":""}" data-section="${item.id}"
                  onclick="window.switchContentSection('${item.id}')">
            ${item.icon} ${item.label}
          </button>`).join("")}
      </nav>

      <!-- Right sections -->
      <div class="editor-sections">

        <!-- HERO -->
        <div class="editor-section active" id="csec-hero">
          <div class="editor-card">
            <div class="editor-card-header">
              <div class="editor-card-title">${heroIcon()} Hero Section</div>
            </div>
            <div class="editor-card-body">
              <div class="editor-group">
                <label class="editor-label">Eyebrow Text</label>
                <input class="editor-input" id="ce-hero-eyebrow" type="text" placeholder="Licensed Financial Professionals">
                <div class="editor-hint">The small text above the main headline</div>
              </div>
              <div class="editor-row">
                <div class="editor-group">
                  <label class="editor-label">Title Line 1</label>
                  <input class="editor-input" id="ce-hero-title1" type="text">
                </div>
                <div class="editor-group">
                  <label class="editor-label">Title Line 2 (italic gold)</label>
                  <input class="editor-input" id="ce-hero-title2" type="text">
                </div>
              </div>
              <div class="editor-group">
                <label class="editor-label">Title Line 3</label>
                <input class="editor-input" id="ce-hero-title3" type="text">
              </div>
              <div class="editor-group">
                <label class="editor-label">Subtitle Paragraph</label>
                <textarea class="editor-textarea" id="ce-hero-subtitle"></textarea>
              </div>
              <div class="editor-row">
                <div class="editor-group">
                  <label class="editor-label">Primary Button Text</label>
                  <input class="editor-input" id="ce-hero-cta1" type="text">
                </div>
                <div class="editor-group">
                  <label class="editor-label">Secondary Button Text</label>
                  <input class="editor-input" id="ce-hero-cta2" type="text">
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ABOUT -->
        <div class="editor-section" id="csec-about">
          <div class="editor-card">
            <div class="editor-card-header">
              <div class="editor-card-title">${aboutIcon()} About Section</div>
            </div>
            <div class="editor-card-body">
              <div class="editor-row">
                <div class="editor-group">
                  <label class="editor-label">Section Label</label>
                  <input class="editor-input" id="ce-about-label" type="text">
                </div>
                <div class="editor-group">
                  <label class="editor-label">Title Line 1</label>
                  <input class="editor-input" id="ce-about-title1" type="text">
                </div>
              </div>
              <div class="editor-group">
                <label class="editor-label">Title Line 2 (italic gold)</label>
                <input class="editor-input" id="ce-about-title2" type="text">
              </div>
              <div class="editor-group">
                <label class="editor-label">Body Paragraph 1</label>
                <textarea class="editor-textarea" id="ce-about-body1"></textarea>
              </div>
              <div class="editor-group">
                <label class="editor-label">Body Paragraph 2</label>
                <textarea class="editor-textarea" id="ce-about-body2"></textarea>
              </div>
              <div style="margin-top:20px;">
                <div class="editor-label" style="margin-bottom:12px;">Stats (4 items)</div>
                <div class="editor-row">
                  ${[0,1,2,3].map(i => `
                    <div class="editor-group">
                      <label class="editor-label">Stat ${i+1} Number</label>
                      <input class="editor-input" id="ce-stat${i}-num" type="text" placeholder="12+">
                      <label class="editor-label" style="margin-top:8px;">Stat ${i+1} Label</label>
                      <input class="editor-input" id="ce-stat${i}-label" type="text" placeholder="Years of Expertise">
                    </div>`).join("")}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- SERVICES GRID -->
        <div class="editor-section" id="csec-services">
          <div class="editor-card">
            <div class="editor-card-header">
              <div class="editor-card-title">${servicesIcon()} Services Grid</div>
            </div>
            <div class="editor-card-body">
              <div class="editor-row">
                <div class="editor-group">
                  <label class="editor-label">Section Label</label>
                  <input class="editor-input" id="ce-svsec-label" type="text">
                </div>
                <div class="editor-group">
                  <label class="editor-label">Title Line 1</label>
                  <input class="editor-input" id="ce-svsec-title1" type="text">
                </div>
              </div>
              <div class="editor-row">
                <div class="editor-group">
                  <label class="editor-label">Title Line 2 (italic gold)</label>
                  <input class="editor-input" id="ce-svsec-title2" type="text">
                </div>
                <div class="editor-group">
                  <label class="editor-label">Subtitle (right side)</label>
                  <input class="editor-input" id="ce-svsec-sub" type="text">
                </div>
              </div>
              <div class="editor-hint" style="margin-top:4px;">Individual service card content is editable under "Service Pages" in the sidebar.</div>
            </div>
          </div>
        </div>

        <!-- TESTIMONIAL -->
        <div class="editor-section" id="csec-testimonial">
          <div class="editor-card">
            <div class="editor-card-header">
              <div class="editor-card-title">${testimonialIcon()} Testimonial</div>
            </div>
            <div class="editor-card-body">
              <div class="editor-group">
                <label class="editor-label">Quote Text</label>
                <textarea class="editor-textarea" id="ce-testi-quote" style="min-height:100px;"></textarea>
                <div class="editor-hint">Do not include quotation marks — they are added automatically.</div>
              </div>
              <div class="editor-row">
                <div class="editor-group">
                  <label class="editor-label">Author Name</label>
                  <input class="editor-input" id="ce-testi-author" type="text">
                </div>
                <div class="editor-group">
                  <label class="editor-label">Author Role / Description</label>
                  <input class="editor-input" id="ce-testi-role" type="text" placeholder="Client since 2021">
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- CTA -->
        <div class="editor-section" id="csec-cta">
          <div class="editor-card">
            <div class="editor-card-header">
              <div class="editor-card-title">${ctaIcon()} CTA Banner</div>
            </div>
            <div class="editor-card-body">
              <div class="editor-row">
                <div class="editor-group">
                  <label class="editor-label">Title Line 1</label>
                  <input class="editor-input" id="ce-cta-title1" type="text">
                </div>
                <div class="editor-group">
                  <label class="editor-label">Title Line 2 (italic gold)</label>
                  <input class="editor-input" id="ce-cta-title2" type="text">
                </div>
              </div>
              <div class="editor-group">
                <label class="editor-label">Title Line 3</label>
                <input class="editor-input" id="ce-cta-title3" type="text">
              </div>
              <div class="editor-group">
                <label class="editor-label">Subtitle Paragraph</label>
                <textarea class="editor-textarea" id="ce-cta-sub"></textarea>
              </div>
              <div class="editor-row">
                <div class="editor-group">
                  <label class="editor-label">Primary Button Text</label>
                  <input class="editor-input" id="ce-cta-primary" type="text">
                </div>
                <div class="editor-group">
                  <label class="editor-label">Secondary Button Text</label>
                  <input class="editor-input" id="ce-cta-secondary" type="text">
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- FORM -->
        <div class="editor-section" id="csec-form">
          <div class="editor-card">
            <div class="editor-card-header">
              <div class="editor-card-title">${formIcon()} Contact Form</div>
            </div>
            <div class="editor-card-body">
              <div class="editor-row">
                <div class="editor-group">
                  <label class="editor-label">Form Card Title</label>
                  <input class="editor-input" id="ce-form-title" type="text">
                </div>
                <div class="editor-group">
                  <label class="editor-label">Form Card Subtitle</label>
                  <input class="editor-input" id="ce-form-sub" type="text">
                </div>
              </div>
              <div class="editor-group">
                <label class="editor-label">Submit Button Text</label>
                <input class="editor-input" id="ce-form-submit" type="text">
              </div>
              <div class="editor-row">
                <div class="editor-group">
                  <label class="editor-label">Success Title</label>
                  <input class="editor-input" id="ce-form-success-title" type="text">
                </div>
              </div>
              <div class="editor-group">
                <label class="editor-label">Success Message</label>
                <textarea class="editor-textarea" id="ce-form-success-text"></textarea>
              </div>
              <div style="margin-top:16px">
                <div class="editor-label" style="margin-bottom:12px;">Trust Promise Items</div>
                ${[1,2,3].map(i => `
                  <div class="editor-row" style="margin-bottom:10px;">
                    <div class="editor-group">
                      <label class="editor-label">Promise ${i} Title</label>
                      <input class="editor-input" id="ce-promise${i}-title" type="text">
                    </div>
                    <div class="editor-group">
                      <label class="editor-label">Promise ${i} Text</label>
                      <input class="editor-input" id="ce-promise${i}-text" type="text">
                    </div>
                  </div>`).join("")}
              </div>
            </div>
          </div>
        </div>

        <!-- FOOTER -->
        <div class="editor-section" id="csec-footer">
          <div class="editor-card">
            <div class="editor-card-header">
              <div class="editor-card-title">${footerIcon()} Footer</div>
            </div>
            <div class="editor-card-body">
              <div class="editor-row">
                <div class="editor-group">
                  <label class="editor-label">Footer Tagline</label>
                  <input class="editor-input" id="ce-footer-tagline" type="text">
                </div>
                <div class="editor-group">
                  <label class="editor-label">Copyright Name</label>
                  <input class="editor-input" id="ce-footer-copy" type="text">
                </div>
              </div>
              <div style="margin-top:4px;">
                <div class="editor-label" style="margin-bottom:12px;">Social Links (leave blank to hide)</div>
                <div class="editor-row">
                  <div class="editor-group">
                    <label class="editor-label">Facebook URL</label>
                    <input class="editor-input" id="ce-social-fb" type="url" placeholder="https://facebook.com/...">
                  </div>
                  <div class="editor-group">
                    <label class="editor-label">Instagram URL</label>
                    <input class="editor-input" id="ce-social-ig" type="url" placeholder="https://instagram.com/...">
                  </div>
                </div>
                <div class="editor-row">
                  <div class="editor-group">
                    <label class="editor-label">Twitter / X URL</label>
                    <input class="editor-input" id="ce-social-tw" type="url" placeholder="https://twitter.com/...">
                  </div>
                  <div class="editor-group">
                    <label class="editor-label">LinkedIn URL</label>
                    <input class="editor-input" id="ce-social-li" type="url" placeholder="https://linkedin.com/...">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- CONTACT INFO -->
        <div class="editor-section" id="csec-contact">
          <div class="editor-card">
            <div class="editor-card-header">
              <div class="editor-card-title">${contactIcon()} Contact Info</div>
            </div>
            <div class="editor-card-body">
              <div class="editor-group">
                <label class="editor-label">Phone Number</label>
                <input class="editor-input" id="ce-contact-phone" type="tel" placeholder="+1 (555) 000-0000">
              </div>
              <div class="editor-group">
                <label class="editor-label">Email Address</label>
                <input class="editor-input" id="ce-contact-email" type="email" placeholder="hello@foolproofdoctor.com">
              </div>
              <div class="editor-group">
                <label class="editor-label">Address</label>
                <textarea class="editor-textarea" id="ce-contact-address" placeholder="123 Main St, City, State"></textarea>
              </div>
            </div>
          </div>
        </div>

        <!-- SEO -->
        <div class="editor-section" id="csec-seo">
          <div class="editor-card">
            <div class="editor-card-header">
              <div class="editor-card-title">${seoIcon()} SEO & Meta Tags</div>
            </div>
            <div class="editor-card-body">
              <div class="editor-group">
                <label class="editor-label">Site Title (browser tab)</label>
                <input class="editor-input" id="ce-seo-title" type="text">
              </div>
              <div class="editor-group">
                <label class="editor-label">Meta Description</label>
                <textarea class="editor-textarea" id="ce-seo-desc" style="min-height:80px;"></textarea>
                <div class="editor-hint">Recommended: 150–160 characters for best SEO.</div>
              </div>
              <div class="editor-group">
                <label class="editor-label">OG / Social Share Title</label>
                <input class="editor-input" id="ce-og-title" type="text">
              </div>
              <div class="editor-group">
                <label class="editor-label">OG / Social Share Description</label>
                <textarea class="editor-textarea" id="ce-og-desc"></textarea>
              </div>
              <div class="editor-group">
                <label class="editor-label">OG Image URL (1200×630 recommended)</label>
                <input class="editor-input" id="ce-og-image" type="url" placeholder="https://...">
              </div>
              <div class="editor-group">
                <label class="editor-label">Canonical Domain</label>
                <input class="editor-input" id="ce-canonical" type="url" placeholder="https://foolproofdoctor.com">
              </div>
            </div>
          </div>
        </div>

        <!-- Save button -->
        <button class="btn-save-primary" id="contentSaveBtn" onclick="window.saveContentEditor()" style="width:100%;padding:16px;font-size:12px;">
          Save All Content Changes
        </button>
      </div>
    </div>`;

  // Listen for changes on all editor inputs
  panel.querySelectorAll(".editor-input,.editor-textarea,.editor-select").forEach(el => {
    el.addEventListener("input", () => markDirty("Content"));
  });
}

// ── Populate fields from content ─────────────────────────
function populateFields() {
  const C = localContent;
  if (!C) return;

  setVal("ce-hero-eyebrow",  C.hero.eyebrow);
  setVal("ce-hero-title1",   C.hero.titleLine1);
  setVal("ce-hero-title2",   C.hero.titleLine2);
  setVal("ce-hero-title3",   C.hero.titleLine3);
  setVal("ce-hero-subtitle", C.hero.subtitle);
  setVal("ce-hero-cta1",     C.hero.ctaPrimary);
  setVal("ce-hero-cta2",     C.hero.ctaSecondary);

  setVal("ce-about-label",  C.about.label);
  setVal("ce-about-title1", C.about.titleLine1);
  setVal("ce-about-title2", C.about.titleLine2);
  setVal("ce-about-body1",  C.about.body1);
  setVal("ce-about-body2",  C.about.body2);
  C.about.stats.forEach((s, i) => {
    setVal(`ce-stat${i}-num`,   s.num);
    setVal(`ce-stat${i}-label`, s.label);
  });

  setVal("ce-svsec-label",  C.servicesSection.label);
  setVal("ce-svsec-title1", C.servicesSection.titleLine1);
  setVal("ce-svsec-title2", C.servicesSection.titleLine2);
  setVal("ce-svsec-sub",    C.servicesSection.subtitle);

  setVal("ce-testi-quote",  C.testimonial.quote);
  setVal("ce-testi-author", C.testimonial.author);
  setVal("ce-testi-role",   C.testimonial.role);

  setVal("ce-cta-title1",    C.cta.titleLine1);
  setVal("ce-cta-title2",    C.cta.titleLine2);
  setVal("ce-cta-title3",    C.cta.titleLine3);
  setVal("ce-cta-sub",       C.cta.subtitle);
  setVal("ce-cta-primary",   C.cta.ctaPrimary);
  setVal("ce-cta-secondary", C.cta.ctaSecondary);

  setVal("ce-form-title",        C.form.title);
  setVal("ce-form-sub",          C.form.subtitle);
  setVal("ce-form-submit",       C.form.submitText);
  setVal("ce-form-success-title",C.form.successTitle);
  setVal("ce-form-success-text", C.form.successText);
  setVal("ce-promise1-title",    C.form.promise1Title);
  setVal("ce-promise1-text",     C.form.promise1Text);
  setVal("ce-promise2-title",    C.form.promise2Title);
  setVal("ce-promise2-text",     C.form.promise2Text);
  setVal("ce-promise3-title",    C.form.promise3Title);
  setVal("ce-promise3-text",     C.form.promise3Text);

  setVal("ce-footer-tagline", C.footer.tagline);
  setVal("ce-footer-copy",    C.footer.copyrightName);
  setVal("ce-social-fb",      C.footer.socialLinks.facebook);
  setVal("ce-social-ig",      C.footer.socialLinks.instagram);
  setVal("ce-social-tw",      C.footer.socialLinks.twitter);
  setVal("ce-social-li",      C.footer.socialLinks.linkedin);

  setVal("ce-contact-phone",   C.contact.phone);
  setVal("ce-contact-email",   C.contact.email);
  setVal("ce-contact-address", C.contact.address);

  setVal("ce-seo-title",  C.seo.siteTitle);
  setVal("ce-seo-desc",   C.seo.metaDescription);
  setVal("ce-og-title",   C.seo.ogTitle);
  setVal("ce-og-desc",    C.seo.ogDescription);
  setVal("ce-og-image",   C.seo.ogImageUrl);
  setVal("ce-canonical",  C.seo.canonicalUrl);
}

// ── Save ──────────────────────────────────────────────────
window.saveContentEditor = async function() {
  const btn = document.getElementById("contentSaveBtn");
  setButtonLoading(btn, true);

  // Read all fields back into localContent
  localContent.hero.eyebrow    = getVal("ce-hero-eyebrow");
  localContent.hero.titleLine1 = getVal("ce-hero-title1");
  localContent.hero.titleLine2 = getVal("ce-hero-title2");
  localContent.hero.titleLine3 = getVal("ce-hero-title3");
  localContent.hero.subtitle   = getVal("ce-hero-subtitle");
  localContent.hero.ctaPrimary    = getVal("ce-hero-cta1");
  localContent.hero.ctaSecondary  = getVal("ce-hero-cta2");

  localContent.about.label      = getVal("ce-about-label");
  localContent.about.titleLine1 = getVal("ce-about-title1");
  localContent.about.titleLine2 = getVal("ce-about-title2");
  localContent.about.body1      = getVal("ce-about-body1");
  localContent.about.body2      = getVal("ce-about-body2");
  localContent.about.stats      = [0,1,2,3].map(i => ({
    num:   getVal(`ce-stat${i}-num`),
    label: getVal(`ce-stat${i}-label`),
  }));

  localContent.servicesSection.label     = getVal("ce-svsec-label");
  localContent.servicesSection.titleLine1= getVal("ce-svsec-title1");
  localContent.servicesSection.titleLine2= getVal("ce-svsec-title2");
  localContent.servicesSection.subtitle  = getVal("ce-svsec-sub");

  localContent.testimonial.quote  = getVal("ce-testi-quote");
  localContent.testimonial.author = getVal("ce-testi-author");
  localContent.testimonial.role   = getVal("ce-testi-role");

  localContent.cta.titleLine1   = getVal("ce-cta-title1");
  localContent.cta.titleLine2   = getVal("ce-cta-title2");
  localContent.cta.titleLine3   = getVal("ce-cta-title3");
  localContent.cta.subtitle     = getVal("ce-cta-sub");
  localContent.cta.ctaPrimary   = getVal("ce-cta-primary");
  localContent.cta.ctaSecondary = getVal("ce-cta-secondary");

  localContent.form.title        = getVal("ce-form-title");
  localContent.form.subtitle     = getVal("ce-form-sub");
  localContent.form.submitText   = getVal("ce-form-submit");
  localContent.form.successTitle = getVal("ce-form-success-title");
  localContent.form.successText  = getVal("ce-form-success-text");
  localContent.form.promise1Title= getVal("ce-promise1-title");
  localContent.form.promise1Text = getVal("ce-promise1-text");
  localContent.form.promise2Title= getVal("ce-promise2-title");
  localContent.form.promise2Text = getVal("ce-promise2-text");
  localContent.form.promise3Title= getVal("ce-promise3-title");
  localContent.form.promise3Text = getVal("ce-promise3-text");

  localContent.footer.tagline       = getVal("ce-footer-tagline");
  localContent.footer.copyrightName = getVal("ce-footer-copy");
  localContent.footer.socialLinks   = {
    facebook:  getVal("ce-social-fb"),
    instagram: getVal("ce-social-ig"),
    twitter:   getVal("ce-social-tw"),
    linkedin:  getVal("ce-social-li"),
  };

  localContent.contact.phone   = getVal("ce-contact-phone");
  localContent.contact.email   = getVal("ce-contact-email");
  localContent.contact.address = getVal("ce-contact-address");

  localContent.seo.siteTitle      = getVal("ce-seo-title");
  localContent.seo.metaDescription= getVal("ce-seo-desc");
  localContent.seo.ogTitle        = getVal("ce-og-title");
  localContent.seo.ogDescription  = getVal("ce-og-desc");
  localContent.seo.ogImageUrl     = getVal("ce-og-image");
  localContent.seo.canonicalUrl   = getVal("ce-canonical");

  try {
    await saveSiteContent(localContent);
    clearDirty();
    showToast("Content saved successfully.", "success");
  } catch (err) {
    showToast("Failed to save. Please try again.", "error");
  } finally {
    setButtonLoading(btn, false, "Save All Content Changes");
  }
};

// ── Section switcher ──────────────────────────────────────
window.switchContentSection = function(id) {
  document.querySelectorAll(".editor-section").forEach(s => s.classList.remove("active"));
  document.querySelectorAll(".editor-nav-item[data-section]").forEach(b => b.classList.remove("active"));
  document.getElementById(`csec-${id}`)?.classList.add("active");
  document.querySelector(`.editor-nav-item[data-section="${id}"]`)?.classList.add("active");
};

// ── Helpers ───────────────────────────────────────────────
function setVal(id, val) {
  const el = document.getElementById(id);
  if (el) el.value = val || "";
}
function getVal(id) {
  return document.getElementById(id)?.value?.trim() || "";
}

// Icon SVGs
function heroIcon()        { return `<svg viewBox="0 0 24 24" fill="none" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/></svg>`; }
function aboutIcon()       { return `<svg viewBox="0 0 24 24" fill="none" stroke-width="1.5"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>`; }
function servicesIcon()    { return `<svg viewBox="0 0 24 24" fill="none" stroke-width="1.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>`; }
function testimonialIcon() { return `<svg viewBox="0 0 24 24" fill="none" stroke-width="1.5"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>`; }
function ctaIcon()         { return `<svg viewBox="0 0 24 24" fill="none" stroke-width="1.5"><polyline points="13 17 18 12 13 7"/><polyline points="6 17 11 12 6 7"/></svg>`; }
function formIcon()        { return `<svg viewBox="0 0 24 24" fill="none" stroke-width="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`; }
function footerIcon()      { return `<svg viewBox="0 0 24 24" fill="none" stroke-width="1.5"><line x1="3" y1="21" x2="21" y2="21"/><line x1="3" y1="10" x2="21" y2="10"/><polyline points="8 21 8 10"/><polyline points="16 21 16 10"/><polyline points="3 10 12 3 21 10"/></svg>`; }
function contactIcon()     { return `<svg viewBox="0 0 24 24" fill="none" stroke-width="1.5"><path d="M22 16.92v3a2 2 0 01-2.18 2A19.79 19.79 0 012.1 5.18 2 2 0 014.1 3h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 10.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 17z"/></svg>`; }
function seoIcon()         { return `<svg viewBox="0 0 24 24" fill="none" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`; }
