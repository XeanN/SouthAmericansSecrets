// auth.js
import { auth, db, googleProvider, signInWithPopup, ref, set } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

// Detectar si estamos en register o login
const registerForm = document.querySelector(".register-form");
const loginForm = document.querySelector(".login-form");

// 🟢 REGISTRO NUEVO USUARIO
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

      // Actualizar perfil en Firebase Auth
      await updateProfile(user, { displayName: name });

      // Guardar en Realtime Database
      await set(ref(db, "users/" + user.uid), {
        name,
        email,
        createdAt: new Date().toISOString()
      });

      // Guardar en localStorage
      localStorage.setItem("user", JSON.stringify({
        uid: user.uid,
        name,
        email
      }));

      // Redirigir al dashboard automáticamente
      window.location.href = "/pages/dashboard.html";
    } catch (error) {
      alert("Error creating account: " + error.message);
    }
  });
}

// 🔵 LOGIN EXISTENTE
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

// 🟠 LOGIN CON GOOGLE
const googleBtns = document.querySelectorAll(".google-btn");
googleBtns.forEach((btn) => {
  btn.addEventListener("click", async (e) => {
    e.preventDefault();
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Guardar usuario si es nuevo
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

// 🧩 LOGOUT (para dashboard)
export async function logout() {
  await signOut(auth);
  localStorage.removeItem("user");
  window.location.href = "/index.html";
}

// 🔍 Detectar si hay usuario logueado (para proteger páginas)
onAuthStateChanged(auth, (user) => {
  if (window.location.pathname.includes("dashboard.html")) {
    if (!user) {
      // Si no hay usuario → forzar login
      window.location.href = "/pages/login.html";
    }
  }
});
