// =========================
// ✅ IMPORTS
// =========================
import { auth, db, googleProvider, signInWithPopup, ref, set } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  OAuthProvider
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";


// =========================
// ✅ FUNCIONES GLOBALES
// =========================

// Guardamos el usuario actual globalmente
let currentUser = null;

// ✅ Función que actualiza el header (login/register o nombre + logout)
function updateHeaderUI(user) {
  const header = document.querySelector(".auth-buttons");
  if (!header) return; // Si el header aún no existe, salimos

  if (user) {
    header.innerHTML = `
      <span class="user-name">Hi, ${user.displayName || user.email}</span>
      <button class="btn logout-btn">Logout</button>
    `;

    // Bind logout
    const logoutBtn = header.querySelector(".logout-btn");
    logoutBtn.addEventListener("click", async () => {
      await signOut(auth);
      localStorage.removeItem("user");
      window.location.href = "/index.html";
    });
  } else {
    header.innerHTML = `
      <a href="/pages/login.html" class="btn login">Login</a>
      <a href="/pages/register.html" class="btn register">Register</a>
    `;
  }
}

// ✅ Escuchar cuando el HEADER termine de cargarse
document.addEventListener("headerLoaded", () => {
  updateHeaderUI(currentUser);
});


// =========================
// ✅ REGISTRO
// =========================
const registerForm = document.querySelector(".register-form");

if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = registerForm.querySelector('input[placeholder="Full name"]').value.trim();
    const email = registerForm.querySelector('input[placeholder="Email"]').value.trim();
    const password = registerForm.querySelector('input[placeholder="Password"]').value.trim();

    if (!name || !email || !password) {
      alert("Please complete all fields.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: name });

      await set(ref(db, "users/" + user.uid), {
        name,
        email,
        createdAt: new Date().toISOString()
      });

      localStorage.setItem("user", JSON.stringify({
        uid: user.uid,
        name,
        email
      }));

      window.location.href = "SouthAmericansSecrets/pages/dashboard.html";
    } catch (error) {
      alert("Error creating account: " + error.message);
    }
  });
}


// =========================
// ✅ LOGIN
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

      localStorage.setItem("user", JSON.stringify({
        uid: user.uid,
        name: user.displayName || "User",
        email: user.email
      }));

      window.location.href = "/pages/dashboard.html";
    } catch (error) {
      alert("Login failed: " + error.message);
    }
  });
}


// =========================
// ✅ LOGIN CON GOOGLE
// =========================
const googleBtns = document.querySelectorAll(".google-btn");
googleBtns.forEach((btn) => {
  btn.addEventListener("click", async (e) => {
    e.preventDefault();
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      await set(ref(db, "users/" + user.uid), {
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        provider: "Google",
        createdAt: new Date().toISOString()
      });

      localStorage.setItem("user", JSON.stringify({
        uid: user.uid,
        name: user.displayName,
        email: user.email
      }));

      window.location.href = "/pages/dashboard.html";
    } catch (error) {
      alert("Google login failed: " + error.message);
    }
  });
});

// =========================
// ✅ LOGIN CON APPLE
// =========================
const appleProvider = new OAuthProvider("apple.com");

const appleBtns = document.querySelectorAll(".apple-btn");
appleBtns.forEach((btn) => {
  btn.addEventListener("click", async (e) => {
    e.preventDefault();
    try {
      // Opcional: solicitar nombre y email al usuario
      appleProvider.addScope('email');
      appleProvider.addScope('name');

      const result = await signInWithPopup(auth, appleProvider);
      const user = result.user;

      // Guardar usuario si es nuevo
      await set(ref(db, "users/" + user.uid), {
        name: user.displayName || "Apple User",
        email: user.email || "No email",
        photoURL: user.photoURL || null,
        provider: "Apple",
        createdAt: new Date().toISOString()
      });

      // Guardar en localStorage
      localStorage.setItem("user", JSON.stringify({
        uid: user.uid,
        name: user.displayName || "Apple User",
        email: user.email || "No email"
      }));

      window.location.href = "/pages/dashboard.html";
    } catch (error) {
      alert("Apple login failed: " + error.message);
    }
  });
});


// =========================
// ✅ OBSERVADOR DE SESIÓN
// =========================
onAuthStateChanged(auth, (user) => {
  currentUser = user; // Guardamos el usuario actual

  // ✅ Si el header ya está cargado, lo actualizamos
  updateHeaderUI(user);

  // ✅ Redirecciones inteligentes
  const path = window.location.pathname;

  // Si estoy en dashboard y NO hay usuario → login
  if (path.includes("dashboard.html") && !user) {
    window.location.href = "/pages/login.html";
  }

  // Si estoy en login o register y YA estoy logueado → dashboard
  if ((path.includes("login.html") || path.includes("register.html")) && user) {
    window.location.href = "/pages/dashboard.html";
  }
});
