// ============================================================
// firebase-config.js — FoolProofDoctor
// Firebase init + Firestore + Auth helpers
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics, logEvent } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import {
  getFirestore, doc, getDoc, setDoc, addDoc, updateDoc,
  collection, query, orderBy, getDocs, serverTimestamp, onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
  getAuth, signInWithEmailAndPassword, signInWithPopup,
  GoogleAuthProvider, signOut, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// ── Config ──────────────────────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyB-m9r-4lEae3TComBqGBBs1jdYldPeDGM",
  authDomain: "foolproofdoctor.firebaseapp.com",
  projectId: "foolproofdoctor",
  storageBucket: "foolproofdoctor.firebasestorage.app",
  messagingSenderId: "143759362204",
  appId: "1:143759362204:web:d5ce63df976cd15ea94559",
  measurementId: "G-8EK0PHKD3X"
};

// ── Init ─────────────────────────────────────────────────────
const app   = initializeApp(firebaseConfig);
const db    = getFirestore(app);
const auth  = getAuth(app);
let analytics = null;
try { analytics = getAnalytics(app); } catch(e) {}

const googleProvider = new GoogleAuthProvider();

// ── Exports ──────────────────────────────────────────────────
export { app, db, auth, analytics, googleProvider };
export {
  logEvent,
  doc, getDoc, setDoc, addDoc, updateDoc,
  collection, query, orderBy, getDocs, serverTimestamp, onSnapshot,
  signInWithEmailAndPassword, signInWithPopup,
  signOut, onAuthStateChanged
};

// ============================================================
// CONTENT HELPERS
// ============================================================

/**
 * Load site content from Firestore.
 * Falls back to defaults from content-defaults.js if doc doesn't exist.
 */
export async function loadSiteContent() {
  try {
    const snap = await getDoc(doc(db, "settings", "siteContent"));
    if (snap.exists()) return snap.data();
  } catch (e) {
    console.warn("Firestore content load failed, using defaults.", e);
  }
  return null; // caller will use defaults
}

/**
 * Save full site content object to Firestore.
 */
export async function saveSiteContent(contentObj) {
  await setDoc(doc(db, "settings", "siteContent"), {
    ...contentObj,
    updatedAt: serverTimestamp()
  }, { merge: true });
}

/**
 * Load branding/settings from Firestore.
 */
export async function loadBranding() {
  try {
    const snap = await getDoc(doc(db, "settings", "branding"));
    if (snap.exists()) return snap.data();
  } catch (e) {}
  return null;
}

/**
 * Save branding settings.
 */
export async function saveBranding(obj) {
  await setDoc(doc(db, "settings", "branding"), {
    ...obj,
    updatedAt: serverTimestamp()
  }, { merge: true });
}

// ============================================================
// SUBMISSION HELPERS
// ============================================================

/**
 * Save a form submission to Firestore.
 */
export async function saveSubmission(data) {
  const ref = await addDoc(collection(db, "submissions"), {
    ...data,
    status: "new",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return ref.id;
}

/**
 * Update status of a submission.
 * Status values: new | pending | in_progress | consultation_booked | confirmed | cancelled
 */
export async function updateSubmissionStatus(id, status, notes = "") {
  await updateDoc(doc(db, "submissions", id), {
    status,
    adminNotes: notes,
    updatedAt: serverTimestamp()
  });
}

/**
 * Load all submissions, ordered by newest first.
 */
export async function loadSubmissions() {
  const q = query(collection(db, "submissions"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

/**
 * Real-time listener for submissions (for admin dashboard live updates).
 */
export function subscribeSubmissions(callback) {
  const q = query(collection(db, "submissions"), orderBy("createdAt", "desc"));
  return onSnapshot(q, snap => {
    const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    callback(items);
  });
}

// ============================================================
// AUTH HELPERS
// ============================================================

/**
 * Sign in with email + password.
 */
export async function loginWithEmail(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

/**
 * Sign in with Google popup.
 */
export async function loginWithGoogle() {
  return signInWithPopup(auth, googleProvider);
}

/**
 * Sign out current user.
 */
export async function logout() {
  return signOut(auth);
}

/**
 * Subscribe to auth state. Returns unsubscribe fn.
 */
export function onAuth(callback) {
  return onAuthStateChanged(auth, callback);
}
