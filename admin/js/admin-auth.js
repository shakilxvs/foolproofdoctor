// ============================================================
// admin-auth.js — FoolProofDoctor
// Firebase Auth: email/password + Google sign-in
// No public registration — only existing Firebase accounts
// ============================================================

import {
  auth,
  loginWithEmail,
  loginWithGoogle,
  logout,
  onAuth
} from "/js/firebase-config.js";

// ── State ─────────────────────────────────────────────────
let currentUser = null;

// ── Init ──────────────────────────────────────────────────
export function initAuth(onAuthed, onUnauthed) {
  onAuth(user => {
    currentUser = user;
    if (user) {
      onAuthed(user);
    } else {
      onUnauthed();
    }
  });
}

// ── Email / Password Login ────────────────────────────────
export async function signInEmail(email, password) {
  if (!email || !password) throw new Error("Please enter your email and password.");
  try {
    const cred = await loginWithEmail(email, password);
    return cred.user;
  } catch (err) {
    throw new Error(mapAuthError(err.code));
  }
}

// ── Google Login ──────────────────────────────────────────
export async function signInGoogle() {
  try {
    const cred = await loginWithGoogle();
    return cred.user;
  } catch (err) {
    if (err.code === "auth/popup-closed-by-user") return null;
    throw new Error(mapAuthError(err.code));
  }
}

// ── Sign Out ──────────────────────────────────────────────
export async function signOut() {
  await logout();
  currentUser = null;
}

// ── Get current user ──────────────────────────────────────
export function getUser() {
  return currentUser;
}

// ── Error messages ────────────────────────────────────────
function mapAuthError(code) {
  const map = {
    "auth/invalid-email":          "Please enter a valid email address.",
    "auth/user-not-found":         "No account found with this email.",
    "auth/wrong-password":         "Incorrect password. Please try again.",
    "auth/invalid-credential":     "Invalid credentials. Check your email and password.",
    "auth/too-many-requests":      "Too many failed attempts. Please try again later.",
    "auth/network-request-failed": "Network error. Please check your connection.",
    "auth/popup-blocked":          "Popup was blocked. Please allow popups and try again.",
    "auth/account-exists-with-different-credential":
                                   "An account already exists with this email using a different sign-in method.",
  };
  return map[code] || "Sign-in failed. Please try again.";
}
