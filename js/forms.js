// ============================================================
// forms.js — FoolProofDoctor
// Formspree + EmailJS + Firestore
// ============================================================

import { saveSubmission } from "./firebase-config.js";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xgobzwrk";

const EMAILJS = {
  serviceId:  "foolproofdoctor",
  templateId: "foolproofdoctor",
  publicKey:  "whLrQpTfWR4fzykmJ",
};

// ── Main Submit Handler ───────────────────────────────────
export async function handleFormSubmit(formData) {
  const { firstName, lastName, email, phone, age, service, message } = formData;

  // ── 1. Formspree → admin notification email ───────────
  const fRes = await fetch(FORMSPREE_ENDPOINT, {
    method:  "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify({
      firstName, lastName, email, phone, age, service, message,
      _subject: `New enquiry — ${service} — ${firstName} ${lastName}`,
      _replyto: email,
    }),
  });

  if (!fRes.ok) {
    const err = await fRes.json().catch(() => ({}));
    throw new Error(err?.error || "Submission failed. Please try again.");
  }

  // ── 2. EmailJS → confirmation email to client ─────────
  // IMPORTANT: In your EmailJS template dashboard you MUST set:
  //   "To Email" field  →  {{to_email}}
  //   "To Name" field   →  {{to_name}}
  // Without this the email only goes to your own address.
  await sendConfirmationEmail({ firstName, lastName, email, service });

  // ── 3. Firestore → save submission record ────────────
  try {
    await saveSubmission({
      firstName, lastName, email,
      phone:   phone   || "",
      age:     age     || "",
      service,
      message: message || "",
      source:  "website_form",
    });
  } catch (e) {
    // Non-fatal — form already submitted to Formspree
    console.warn("[FPD] Firestore save failed:", e.message);
  }

  return { success: true };
}

// ── EmailJS send with full error visibility ───────────────
async function sendConfirmationEmail({ firstName, lastName, email, service }) {
  // Check EmailJS is loaded
  if (!window.emailjs) {
    console.error("[FPD] EmailJS not loaded — CDN script may have failed.");
    return;
  }

  // Ensure EmailJS is initialised (safe to call multiple times)
  try {
    window.emailjs.init({ publicKey: EMAILJS.publicKey });
  } catch(e) {
    // Already initialised — fine to ignore
  }

  try {
    const result = await window.emailjs.send(
      EMAILJS.serviceId,
      EMAILJS.templateId,
      {
        to_name:      `${firstName} ${lastName}`,
        to_email:     email,           // ← EmailJS template "To Email" must be {{to_email}}
        first_name:   firstName,
        service_name: service,
        reply_to:     "support@foolproofdoctor.com",
      }
    );
    console.log("[FPD] EmailJS confirmation sent:", result.status, result.text);
  } catch (e) {
    // Log full error so it's visible in browser console for debugging
    console.error("[FPD] EmailJS send failed:", {
      status:  e.status,
      text:    e.text,
      message: e.message || e,
    });
    // Non-fatal — form was already submitted successfully
  }
}

// ── Validation ────────────────────────────────────────────
export function validateForm(formData) {
  const errors = {};
  if (!formData.firstName?.trim()) errors.firstName = "First name is required.";
  if (!formData.lastName?.trim())  errors.lastName  = "Last name is required.";
  if (!formData.email?.trim())     errors.email     = "Email address is required.";
  if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = "Please enter a valid email address.";
  }
  if (!formData.service?.trim()) errors.service = "Please select a service.";
  return { valid: Object.keys(errors).length === 0, errors };
}

// ── Field error helpers ───────────────────────────────────
export function showFieldError(fieldEl, message) {
  clearFieldError(fieldEl);
  fieldEl.style.borderColor = "#c86e6e";
  const span = document.createElement("span");
  span.className = "field-error";
  span.style.cssText = "display:block;font-size:11px;color:#c86e6e;margin-top:5px;letter-spacing:0.05em;";
  span.textContent = message;
  fieldEl.parentNode.appendChild(span);
}

export function clearFieldError(fieldEl) {
  fieldEl.style.borderColor = "";
  fieldEl.parentNode.querySelector(".field-error")?.remove();
}

export function clearAllErrors(formEl) {
  formEl.querySelectorAll(".field-error").forEach(e => e.remove());
  formEl.querySelectorAll(".form-input,.form-select,.form-textarea")
        .forEach(el => el.style.borderColor = "");
}
