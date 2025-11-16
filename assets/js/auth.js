// =========================
// ⚡ IMPORTS
// =========================
import { auth, db, googleProvider, signInWithPopup, ref, set, update } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  OAuthProvider
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

import { get } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

// 🔵 IMPORTAMOS NUEVO
import { verifyFirebaseTokenOnBackend } from "./verifyToken.js";
import { saveBackendToken, logoutAll } from "./tokenManager.js";

// Ruta base
const base = window.location.pathname.includes("SouthAmericansSecrets")
  ? "/SouthAmericansSecrets"
  : "";

// =========================
// GLOBAL USER
// =========================
window.currentUser = null;

// =========================
// HEADER UI
// =========================
function updateHeaderUI(user) {
  const headers = document.querySelectorAll(".auth-buttons, .auth-buttons-mobile");

  if (!headers.length) return;

  if (user) {
    const photoURL = user.photoURL || `${base}/assets/img/default-avatar.png`;

    const html = `
      <div class="user-profile-info">
        <a href="${base}/pages/dashboard.html" class="profile-avatar-link">
          <img src="${photoURL}" alt="Profile" class="profile-avatar">
        </a>
        <a href="${base}/pages/dashboard.html" class="user-greeting">
          Hi, ${user.displayName || user.email.split("@")[0]}
        </a>
      </div>
      <button class="btn register logout-btn">
        <i class="fas fa-sign-out-alt"></i> Log Out
      </button>
    `;

    headers.forEach(h => h.innerHTML = html);

    document.querySelectorAll(".logout-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        await signOut(auth);
        logoutAll();
        window.location.href = base + "/index.html";
      });
    });

  } else {
    const html = `
      <a href="${base}/pages/login.html" class="btn login">Login</a>
      <a href="${base}/pages/register.html" class="btn register">Register</a>
    `;
    headers.forEach(h => h.innerHTML = html);
  }
}

document.addEventListener("headerLoaded", () => updateHeaderUI(currentUser));

// =========================
// ✔ REGISTRO
// =========================
const registerForm = document.querySelector(".register-form");

if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = registerForm.querySelector('input[placeholder="Full name"]').value.trim();
    const email = registerForm.querySelector('input[placeholder="Email"]').value.trim();
    const password = registerForm.querySelector('input[placeholder="Password"]').value.trim();

    if (!name || !email || !password) {
      showMessage("Please complete all fields.", "error");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: name });

      await update(ref(db, "users/" + user.uid), {
        name,
        email,
        createdAt: new Date().toISOString()
      });

      // ⚡ Verificar token Firebase en backend
      const verify = await verifyFirebaseTokenOnBackend();
      if (verify?.backend_token) saveBackendToken(verify.backend_token);

      localStorage.setItem("user", JSON.stringify({
        uid: user.uid,
        name,
        email
      }));

      showMessage("Account created! 🎉", "success");
      setTimeout(() => window.location.href = base + "/pages/dashboard.html", 1500);

    } catch (error) {
      showMessage(getErrorMessage(error.code), "error");
    }
  });
}

// =========================
// ✔ LOGIN EMAIL/PASSWORD
// =========================
const loginForm = document.querySelector(".login-form");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = loginForm.querySelector('input[placeholder="Your email"]').value.trim();
    const password = loginForm.querySelector('input[placeholder="Password"]').value.trim();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 🔵 Nuevamente, verificamos token Firebase → backend
      const verify = await verifyFirebaseTokenOnBackend();
      if (verify?.backend_token) saveBackendToken(verify.backend_token);

      localStorage.setItem("user", JSON.stringify({
        uid: user.uid,
        name: user.displayName || "User",
        email: user.email
      }));

      showMessage("Welcome back! 👋", "success");
      setTimeout(() => window.location.href = base + "/pages/dashboard.html", 1000);

    } catch (error) {
      showMessage(getErrorMessage(error.code), "error");
    }
  });
}

// =========================
// ✔ LOGIN GOOGLE
// =========================
document.querySelectorAll(".google-btn").forEach((btn) => {
  btn.addEventListener("click", async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const userRef = ref(db, "users/" + user.uid);
      const snapshot = await get(userRef);

      if (!snapshot.exists()) {
        await update(userRef, {
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          provider: "Google",
          createdAt: new Date().toISOString()
        });
      }

      // ⚡ Verificar token Firebase → backend
      const verify = await verifyFirebaseTokenOnBackend();
      if (verify?.backend_token) saveBackendToken(verify.backend_token);

      localStorage.setItem("user", JSON.stringify({
        uid: user.uid,
        name: user.displayName,
        email: user.email
      }));

      window.location.href = base + "/pages/dashboard.html";

    } catch (error) {
      showMessage("Google login failed: " + error.message, "error");
    }
  });
});

// =========================
// ✔ LOGIN APPLE (igual que Google)
// =========================
const appleProvider = new OAuthProvider("apple.com");

document.querySelectorAll(".apple-btn").forEach((btn) => {
  btn.addEventListener("click", async () => {
    try {
      appleProvider.addScope('email');
      appleProvider.addScope('name');
      const result = await signInWithPopup(auth, appleProvider);
      const user = result.user;

      const userRef = ref(db, "users/" + user.uid);
      const snapshot = await get(userRef);

      if (!snapshot.exists()) {
        await update(userRef, {
          name: user.displayName || "Apple User",
          email: user.email || "No email",
          provider: "Apple",
          createdAt: new Date().toISOString()
        });
      }

      // 🔵 Verificar token Firebase → backend
      const verify = await verifyFirebaseTokenOnBackend();
      if (verify?.backend_token) saveBackendToken(verify.backend_token);

      localStorage.setItem("user", JSON.stringify({
        uid: user.uid,
        name: user.displayName,
        email: user.email
      }));

      window.location.href = base + "/pages/dashboard.html";

    } catch (error) {
      showMessage("Apple login failed: " + error.message, "error");
    }
  });
});

// =========================
// ✔ OBSERVADOR DE SESIÓN
// =========================
onAuthStateChanged(auth, async (user) => {
  window.currentUser = user;
  updateHeaderUI(user);

  const path = window.location.pathname;

  const protectedRoutes = [
    "dashboard.html",
    "tour-booking.html",
    "checkout.html"
  ];

  const requiresAuth = protectedRoutes.some(route => path.includes(route));

  if (requiresAuth && !user) {
    window.location.href = base + "/pages/login.html";
    return;
  }

  if (user) {
    // ⚡ Cada vez que recarga la página, verificamos token de Firebase → backend
    const verify = await verifyFirebaseTokenOnBackend();
    if (verify?.backend_token) saveBackendToken(verify.backend_token);
  }
});

// =========================
// Helpers
// =========================
function showMessage(message, type) {
  const div = document.createElement("div");
  div.className = `auth-message ${type}`;
  div.textContent = message;
  document.body.appendChild(div);
  setTimeout(() => div.remove(), 3000);
}

function getErrorMessage(code) {
  const map = {
    'auth/email-already-in-use': 'Email already registered.',
    'auth/invalid-email': 'Invalid email.',
    'auth/weak-password': 'Weak password.',
    'auth/user-not-found': 'No user found.',
    'auth/wrong-password': 'Wrong password.'
  };
  return map[code] || "Authentication error.";
}

window.db = db;
window.ref = ref;
window.get = get;

export { updateProfile, update, ref, db, auth, get, showMessage, getErrorMessage };
