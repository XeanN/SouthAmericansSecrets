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

// Ruta base (tu lógica original)
const base = window.location.pathname.includes("SouthAmericansSecrets")
  ? "/SouthAmericansSecrets"
  : "";

// =========================
// ✅ FUNCIONES GLOBALES
// =========================

// Guardamos el usuario actual globalmente
let currentUser = null;

// ✅ Función que actualiza el header (¡MODIFICADA!)
function updateHeaderUI(user) {
  // 1. Seleccionamos AMBOS contenedores (escritorio y móvil)
  const headers = document.querySelectorAll(".auth-buttons, .auth-buttons-mobile"); 
  
  if (!headers.length) {
    console.log("updateHeaderUI: Header elements not found yet.");
    return;
  }

  console.log(`Updating ${headers.length} header elements.`);

  if (user) {
    // === ¡NUEVA LÓGICA DE FOTO! ===
    const photoURL = user.photoURL || `${base}/assets/img/default-avatar.png`; 

    // Si hay usuario, ponemos el saludo y botón de Logout
    const html = `
      <div class="user-profile-info">
        
        <a href="${base}/pages/dashboard.html" class="profile-avatar-link">
          <img src="${photoURL}" alt="Profile" class="profile-avatar">
        </a>
        
        <a href="${base}/pages/dashboard.html" class="user-greeting">Hi, ${user.displayName || user.email.split("@")[0]}</a>
      </div>
      
      <button class="btn register logout-btn">
        <i class="fas fa-sign-out-alt"></i> Log Out
      </button>
    `;
    
    // Aplicamos el HTML a ambos
    headers.forEach(header => header.innerHTML = html);
    
    // 2. Añadimos el listener de "Logout" (sin cambios)
    document.querySelectorAll(".logout-btn").forEach(btn => {
      const newBtn = btn.cloneNode(true);
      btn.parentNode.replaceChild(newBtn, btn);

      newBtn.addEventListener("click", async () => {
        await signOut(auth);
        localStorage.removeItem("user");
        window.location.href = base + "/index.html";
      });
    });

  } else {
    // Si no hay usuario, ponemos Login y Register
    const html = `
      <a href="${base}/pages/login.html" class="btn login">Login</a>      
      <a href="${base}/pages/register.html" class="btn register">Register</a>
    `;
    // Aplicamos el HTML a ambos
    headers.forEach(header => header.innerHTML = html);
  }
}

// ✅ Escuchar cuando el HEADER termine de cargarse
// (Se ejecuta si onAuthStateChanged fue más rápido que el header)
document.addEventListener("headerLoaded", () => {
  console.log("Event: headerLoaded detected. Updating UI.");
  updateHeaderUI(currentUser);
});


// =========================
// ✅ REGISTRO (Sin cambios)
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
      await updateProfile(user, { displayName: name }); // <-- Aquí no ponemos foto, usará el default
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
      window.location.href = base + "/pages/dashboard.html";
    } catch (error) {
      alert("Error creating account: " + error.message);
    }
  });
}

// =========================
// ✅ LOGIN (Sin cambios)
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
      window.location.href = base + "/pages/dashboard.html";
    } catch (error) {
      alert("Login failed: " + error.message);
    }
  });
}

// =========================
// ✅ LOGIN CON GOOGLE (Sin cambios)
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
        photoURL: user.photoURL, // <-- Guardamos la foto en la DB
        provider: "Google",
        createdAt: new Date().toISOString()
      });
      localStorage.setItem("user", JSON.stringify({
        uid: user.uid,
        name: user.displayName,
        email: user.email
      }));
      window.location.href = base + "/pages/dashboard.html";
    } catch (error) {
      alert("Google login failed: " + error.message);
    }
  });
});

// =========================
// ✅ LOGIN CON APPLE (Sin cambios)
// =========================
const appleProvider = new OAuthProvider("apple.com");
const appleBtns = document.querySelectorAll(".apple-btn");
appleBtns.forEach((btn) => {
  btn.addEventListener("click", async (e) => {
    e.preventDefault();
    try {
      appleProvider.addScope('email');
      appleProvider.addScope('name');
      const result = await signInWithPopup(auth, appleProvider);
      const user = result.user;
      
      await set(ref(db, "users/" + user.uid), {
        name: user.displayName || "Apple User",
        email: user.email || "No email",
        photoURL: user.photoURL || null, // <-- Guardamos la foto en la DB
        provider: "Apple",
        createdAt: new Date().toISOString()
      });
      localStorage.setItem("user", JSON.stringify({
        uid: user.uid,
        name: user.displayName || "Apple User",
        email: user.email || "No email"
      }));
      window.location.href = base + "/pages/dashboard.html";
    } catch (error) {
      alert("Apple login failed: " + error.message);
    }
  });
});

// =========================
// ✅ OBSERVADOR de SESIÓN (Sin cambios)
// =========================
onAuthStateChanged(auth, (user) => {
  console.log("Event: onAuthStateChanged. User:", user);
  currentUser = user; // Actualizamos la variable global

  // ✅ Actualizar header (si ya fue cargado)
  updateHeaderUI(user); 

  // --- RUTAS PROTEGIDAS (Tu código original) ---
  const protectedRoutes = [
    "dashboard.html",
    "tour-booking.html",
    "checkout.html"
  ];

  const path = window.location.pathname;
  const requiresAuth = protectedRoutes.some(route => path.includes(route));

  if (requiresAuth && !user) {
    console.log("Route protected. Redirecting to login.");
    window.location.href = base + "/pages/login.html";
    return;
  }

  if (user && (path.includes("login.html") || path.includes("register.html"))) {
    console.log("User already logged in. Redirecting to dashboard.");
    window.location.href = base + "/pages/dashboard.html";
  }
});