// ============================================================
// forms.js — FoolProofDoctor
// Handles Formspree submission + EmailJS confirmation email
// + Firestore submission save
// ============================================================

import { saveSubmission } from "./firebase-config.js";

// ── Config ────────────────────────────────────────────────
const FORMSPREE_ENDPOINT = "https://formspree.io/f/xgobzwrk";

const EMAILJS_CONFIG = {
  serviceId:  "foolproofdoctor",
  templateId: "foolproofdoctor",
  publicKey:  "whLrQpTfWR4fzykmJ",
};

// ── EmailJS ready check ───────────────────────────────────
// EmailJS is initialised in index.html directly before this module runs.
// We just check window.emailjs is available when sending.
const emailjsReady = () => !!(window.emailjs);

// ── Main Submit Handler ───────────────────────────────────
/**
 * Called when a service page form is submitted.
 * 1. Validates fields
 * 2. Sends to Formspree (notifies admin via email)
 * 3. Sends confirmation email to client via EmailJS
 * 4. Saves to Firestore submissions collection
 * Returns { success: true } or throws.
 */
export async function handleFormSubmit(formData) {
  const { firstName, lastName, email, phone, age, service, message } = formData;

  // ── 1. Formspree ────────────────────────────────────────
  const formspreePayload = {
    firstName, lastName, email, phone, age,
    service, message,
    _subject: `New enquiry — ${service} — ${firstName} ${lastName}`,
    _replyto: email,
  };

  const formspreeRes = await fetch(FORMSPREE_ENDPOINT, {
    method:  "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body:    JSON.stringify(formspreePayload),
  });

  if (!formspreeRes.ok) {
    const err = await formspreeRes.json().catch(() => ({}));
    throw new Error(err?.error || "Submission failed. Please try again.");
  }

  // ── 2. EmailJS — confirmation to client ────────────────
  if (emailjsReady() && window.emailjs) {
    try {
      await window.emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        {
          to_name:      `${firstName} ${lastName}`,
          to_email:     email,
          service_name: service,
          first_name:   firstName,
          reply_to:     "support@foolproofdoctor.com",
        }
      );
    } catch (e) {
      // Non-fatal — submission was already sent to Formspree
      console.warn("EmailJS confirmation failed:", e);
    }
  }

  // ── 3. Firestore ────────────────────────────────────────
  let firestoreId = null;
  try {
    firestoreId = await saveSubmission({
      firstName, lastName, email, phone,
      age: age || "",
      service,
      message: message || "",
      source:  "website_form",
    });
  } catch (e) {
    console.warn("Firestore save failed:", e);
  }

  return { success: true, firestoreId };
}

// ── Form Validation ───────────────────────────────────────
export function validateForm(formData) {
  const errors = {};
  if (!formData.firstName?.trim()) errors.firstName = "First name is required.";
  if (!formData.lastName?.trim())  errors.lastName  = "Last name is required.";
  if (!formData.email?.trim())     errors.email     = "Email address is required.";
  if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = "Please enter a valid email address.";
  }
  if (!formData.service?.trim())   errors.service   = "Please select a service.";
  return { valid: Object.keys(errors).length === 0, errors };
}

// ── Show field error ──────────────────────────────────────
export function showFieldError(fieldEl, message) {
  clearFieldError(fieldEl);
  fieldEl.style.borderColor = "#c86e6e";
  const err = document.createElement("span");
  err.className    = "field-error";
  err.style.cssText = "display:block;font-size:11px;color:#c86e6e;margin-top:5px;letter-spacing:0.05em;";
  err.textContent  = message;
  fieldEl.parentNode.appendChild(err);
}

export function clearFieldError(fieldEl) {
  fieldEl.style.borderColor = "";
  const existing = fieldEl.parentNode.querySelector(".field-error");
  if (existing) existing.remove();
}

export function clearAllErrors(formEl) {
  formEl.querySelectorAll(".field-error").forEach(e => e.remove());
  formEl.querySelectorAll(".form-input, .form-select, .form-textarea")
        .forEach(el => el.style.borderColor = "");
}
