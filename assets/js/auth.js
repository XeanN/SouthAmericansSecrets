// =========================
// ⚡ IMPORTS (Limpios y corregidos)
// =========================
// Importamos la configuración desde tu archivo firebase.js
import { auth, db, googleProvider, signInWithPopup, ref, set, update } from "./firebase.js";

// Importamos las funciones de autenticación y base de datos (Usando la misma versión 10.8.0)
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  OAuthProvider
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

import { get } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// Ruta base (Para GitHub Pages)
function getBasePath() {
  const path = window.location.pathname;
  return path.includes("/SouthAmericansSecrets") ? "/SouthAmericansSecrets" : "";
}
const base = getBasePath();

// =========================
// GLOBAL USER
// =========================
window.currentUser = null;

// =========================
// HEADER UI (Actualizar foto y nombre)
// =========================
function updateHeaderUI(user) {
  // Buscamos los contenedores en escritorio y móvil
  const headers = document.querySelectorAll(".auth-buttons, .auth-buttons-mobile");
  if (!headers.length) return;

  if (user) {
    const photoURL = user.photoURL || `${base}/assets/img/default-avatar.png`;
    const userName = user.displayName || user.email.split("@")[0];

    const html = `
      <div class="user-profile-info" style="display: flex; align-items: center; gap: 10px;">
        <a href="${base}/pages/dashboard.html" class="profile-avatar-link">
          <img src="${photoURL}" alt="Profile" class="profile-avatar" style="width: 35px; height: 35px; border-radius: 50%; object-fit: cover;">
        </a>
        <a href="${base}/pages/dashboard.html" class="user-greeting" style="text-decoration: none; color: inherit; font-weight: 600;">
          Hi, ${userName}
        </a>
      </div>
      <button class="btn register logout-btn" style="margin-left: 10px;">
        <i class="fas fa-sign-out-alt"></i> Log Out
      </button>
    `;

    headers.forEach(h => h.innerHTML = html);

    // Activar botones de Logout
    document.querySelectorAll(".logout-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        await signOut(auth);
        window.location.href = base + "/index.html";
      });
    });

  } else {
    // Si no hay usuario, mostramos Login/Register
    const html = `
      <a href="${base}/pages/login.html" class="btn login">Login</a>
      <a href="${base}/pages/register.html" class="btn register">Register</a>
    `;
    headers.forEach(h => h.innerHTML = html);
  }
}

// =========================
// ✔ REGISTRO (Crear Cuenta)
// =========================
const registerForm = document.querySelector(".register-form");

if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Capturamos los inputs
    const nameInput = registerForm.querySelector('input[type="text"]'); // A veces el placeholder cambia
    const emailInput = registerForm.querySelector('input[type="email"]');
    const passInput = registerForm.querySelector('input[type="password"]');

    const name = nameInput ? nameInput.value.trim() : "User";
    const email = emailInput.value.trim();
    const password = passInput.value.trim();

    if (!email || !password) {
      showMessage("Please complete all fields.", "error");
      return;
    }

    try {
      showMessage("Creating account...", "info");
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Actualizar nombre en Firebase Auth
      await updateProfile(user, { displayName: name });

      // Guardar en Realtime Database (Base de datos de tu amigo)
      await update(ref(db, "users/" + user.uid), {
        name: name,
        email: email,
        createdAt: new Date().toISOString(),
        provider: "Email"
      });

      showMessage("Account created! 🎉", "success");
      setTimeout(() => window.location.href = base + "/pages/dashboard.html", 1500);

    } catch (error) {
      console.error(error);
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

    const emailInput = loginForm.querySelector('input[type="email"]');
    const passInput = loginForm.querySelector('input[type="password"]');
    
    const email = emailInput.value.trim();
    const password = passInput.value.trim();

    try {
      showMessage("Logging in...", "info");
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      showMessage("Welcome back! 👋", "success");
      setTimeout(() => window.location.href = base + "/pages/dashboard.html", 1000);

    } catch (error) {
      console.error(error);
      showMessage(getErrorMessage(error.code), "error");
    }
  });
}

// =========================
// ✔ LOGIN GOOGLE
// =========================
document.querySelectorAll(".google-btn").forEach((btn) => {
  btn.addEventListener("click", async (e) => {
    e.preventDefault(); // Evitar recarga si está dentro de un form
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Verificar si ya existe en la DB
      const userRef = ref(db, "users/" + user.uid);
      const snapshot = await get(userRef);

      if (!snapshot.exists()) {
        // Si es nuevo, lo guardamos
        await update(userRef, {
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          provider: "Google",
          createdAt: new Date().toISOString()
        });
      }

      window.location.href = base + "/pages/dashboard.html";

    } catch (error) {
      console.error(error);
      showMessage("Google login failed: " + error.message, "error");
    }
  });
});

// =========================
// ✔ OBSERVADOR DE SESIÓN (Mantiene al usuario logueado)
// =========================
onAuthStateChanged(auth, async (user) => {
  window.currentUser = user;
  
  // Esperamos a que cargue el header (evento headerLoaded en main.js)
  updateHeaderUI(user);
  document.addEventListener("headerLoaded", () => updateHeaderUI(user));

  // Protección de rutas: Si no está logueado, sacar del dashboard/checkout
  const path = window.location.pathname;
  const protectedRoutes = ["dashboard.html", "checkout.html"];
  
  // Solo protegemos si NO estamos en login o register
  if (protectedRoutes.some(route => path.includes(route)) && !user) {
    // Pequeño timeout para dar tiempo a Firebase a verificar
    setTimeout(() => {
        if (!auth.currentUser) window.location.href = base + "/pages/login.html";
    }, 500);
  }
});

// =========================
// Helpers (Mensajes bonitos)
// =========================
function showMessage(message, type) {
  // Si tienes SweetAlert instalado, úsalo, si no, crea un div
  if (typeof Swal !== 'undefined') {
      Swal.fire({
          icon: type,
          title: type === 'error' ? 'Oops...' : 'Success',
          text: message,
          timer: 2000,
          showConfirmButton: false
      });
  } else {
      // Fallback nativo
      const div = document.createElement("div");
      div.className = `auth-message ${type}`; // Asegúrate de tener CSS para esto o se verá feo
      div.style.position = 'fixed';
      div.style.top = '20px';
      div.style.right = '20px';
      div.style.padding = '15px';
      div.style.background = type === 'error' ? '#ff4d4d' : '#4dff88';
      div.style.color = 'white';
      div.style.zIndex = '9999';
      div.style.borderRadius = '5px';
      div.textContent = message;
      document.body.appendChild(div);
      setTimeout(() => div.remove(), 3000);
  }
}

function getErrorMessage(code) {
  const map = {
    'auth/email-already-in-use': 'Email already registered.',
    'auth/invalid-email': 'Invalid email address.',
    'auth/weak-password': 'Password should be at least 6 characters.',
    'auth/user-not-found': 'User not found. Please register.',
    'auth/wrong-password': 'Incorrect password.',
    'auth/popup-closed-by-user': 'Sign in cancelled.'
  };
  return map[code] || "Authentication error: " + code;
}

// Exportamos para que otros archivos puedan usarlo
export { updateProfile, update, ref, db, auth, get, showMessage };