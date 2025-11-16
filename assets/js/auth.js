// =========================
// ✅ IMPORTS
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

// Ruta base
const base = window.location.pathname.includes("SouthAmericansSecrets")
  ? "/SouthAmericansSecrets"
  : "";

// =========================
// ✅ VARIABLES GLOBALES
// =========================
window.currentUser = null;

// =========================
// ✅ FUNCIÓN ACTUALIZAR HEADER
// =========================
function updateHeaderUI(user) {
  const headers = document.querySelectorAll(".auth-buttons, .auth-buttons-mobile"); 
  
  if (!headers.length) {
    console.log("updateHeaderUI: Header elements not found yet.");
    return;
  }

  console.log(`Updating ${headers.length} header elements.`);

  if (user) {
    const photoURL = user.photoURL || `${base}/assets/img/default-avatar.png`; 

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
    
    headers.forEach(header => header.innerHTML = html);
    
    document.querySelectorAll(".logout-btn").forEach(btn => {
      const newBtn = btn.cloneNode(true);
      btn.parentNode.replaceChild(newBtn, btn);

      newBtn.addEventListener("click", async () => {
        await signOut(auth);
        localStorage.removeItem("user");
        // 🚨 PASO NUEVO: Eliminar el token JWT
        localStorage.removeItem("access_token");
        window.location.href = base + "/index.html";
      });
    });

  } else {
    const html = `
      <a href="${base}/pages/login.html" class="btn login">Login</a>      
      <a href="${base}/pages/register.html" class="btn register">Register</a>
    `;
    headers.forEach(header => header.innerHTML = html);
  }
}

document.addEventListener("headerLoaded", () => {
  console.log("Event: headerLoaded detected. Updating UI.");
  updateHeaderUI(currentUser);
});

// =========================
// ✅ REGISTRO (CORREGIDO: Obtener token JWT)
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
    
    if (password.length < 6) {
      showMessage("Password must be at least 6 characters.", "error");
      return;
    }
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await updateProfile(user, { displayName: name });
      
      // Guardar en Realtime Database
      await update(ref(db, "users/" + user.uid), {
        name,
        email,
        phone: "",
        createdAt: new Date().toISOString()
      });
      
      // 🚨 PASO NUEVO: Obtener el token JWT de tu API de Python
      const tokenResponse = await fetch(`${base}/backend/login`, { // << ASUMIMOS ESTA RUTA
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });
      
      const tokenData = await tokenResponse.json();
      
      // ✅ GUARDAR EL TOKEN JWT
      localStorage.setItem("access_token", tokenData.access_token);
      
      // Guardar info básica de Firebase
      localStorage.setItem("user", JSON.stringify({
        uid: user.uid,
        name,
        email
      }));
      
      showMessage("Account created successfully! 🎉", "success");
      setTimeout(() => {
        window.location.href = base + "/pages/dashboard.html";
      }, 1500);
    } catch (error) {
      showMessage(getErrorMessage(error.code), "error");
    }
  });
}

// =========================
// ✅ LOGIN (CORREGIDO: Obtener token JWT)
// =========================
const loginForm = document.querySelector(".login-form");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = loginForm.querySelector('input[placeholder="Your email"]').value.trim();
    const password = loginForm.querySelector('input[placeholder="Password"]').value.trim();
    
    if (!email || !password) {
      showMessage("Please enter your email and password.", "error");
      return;
    }
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // 🚨 PASO NUEVO Y CRÍTICO: Obtener el token JWT de tu API de Python
      const tokenResponse = await fetch(`${base}/backend/login`, { // << ASUMIMOS ESTA RUTA
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });
      
      if (!tokenResponse.ok) {
        // Si la API de Python falla, mostramos un error pero el usuario está logueado en Firebase
        showMessage("Login de API fallido. Recomendaciones no disponibles.", "error");
        return;
      }

      const tokenData = await tokenResponse.json();
      
      // ✅ GUARDAR EL TOKEN JWT
      localStorage.setItem("access_token", tokenData.access_token);
      
      // Guardar info básica de Firebase
      localStorage.setItem("user", JSON.stringify({
        uid: user.uid,
        name: user.displayName || "User",
        email: user.email
      }));
      
      showMessage("Welcome back! 👋", "success");
      setTimeout(() => {
        window.location.href = base + "/pages/dashboard.html";
      }, 1000);
    } catch (error) {
      showMessage(getErrorMessage(error.code), "error");
    }
  });
}

// =========================
// ✅ RECUPERAR CONTRASEÑA
// =========================
const forgotPasswordLink = document.querySelector(".forgot-password");

if (forgotPasswordLink) {
  forgotPasswordLink.addEventListener("click", async (e) => {
    e.preventDefault();
    
    const emailInput = loginForm ? loginForm.querySelector('input[placeholder="Your email"]') : null;
    const email = emailInput ? emailInput.value.trim() : "";
    
    if (!email) {
      showPasswordResetModal();
      return;
    }
    
    try {
      await sendPasswordResetEmail(auth, email);
      showMessage("Password reset email sent! Check your inbox. 📧", "success");
    } catch (error) {
      showMessage(getErrorMessage(error.code), "error");
    }
  });
}

// =========================
// ✅ MODAL RECUPERAR CONTRASEÑA
// =========================
function showPasswordResetModal() {
  const modalHTML = `
    <div class="password-reset-modal" id="passwordResetModal">
      <div class="password-reset-content">
        <button class="close-modal" onclick="document.getElementById('passwordResetModal').remove()">
          <i class="fas fa-times"></i>
        </button>
        <h3><i class="fas fa-key"></i> Reset Password</h3>
        <p>Enter your email address and we'll send you a link to reset your password.</p>
        <form id="resetPasswordForm">
          <input type="email" id="resetEmail" placeholder="your.email@example.com" required>
          <button type="submit" class="btn">Send Reset Link</button>
        </form>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  
  const modalStyles = `
    <style>
      .password-reset-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        animation: fadeIn 0.3s ease;
      }
      
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      .password-reset-content {
        background: white;
        padding: 2.5rem;
        border-radius: 16px;
        max-width: 450px;
        width: 90%;
        position: relative;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        animation: slideUp 0.3s ease;
      }
      
      @keyframes slideUp {
        from { transform: translateY(30px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      
      .password-reset-content h3 {
        margin: 0 0 1rem 0;
        color: var(--color-primary);
        display: flex;
        align-items: center;
        gap: 10px;
      }
      
      .password-reset-content p {
        margin-bottom: 1.5rem;
        color: var(--color-text-secondary);
      }
      
      .password-reset-content input {
        width: 100%;
        padding: 12px;
        border: 2px solid #ddd;
        border-radius: 8px;
        font-size: 1rem;
        margin-bottom: 1rem;
        transition: border-color 0.3s ease;
      }
      
      .password-reset-content input:focus {
        outline: none;
        border-color: var(--color-primary);
      }
      
      .close-modal {
        position: absolute;
        top: 15px;
        right: 15px;
        background: transparent;
        border: none;
        font-size: 1.5rem;
        color: #999;
        cursor: pointer;
        transition: color 0.3s ease;
      }
      
      .close-modal:hover {
        color: #333;
      }
    </style>
  `;
  
  document.head.insertAdjacentHTML('beforeend', modalStyles);
  
  document.getElementById('resetPasswordForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('resetEmail').value.trim();
    
    if (!email) {
      showMessage("Please enter your email address.", "error");
      return;
    }
    
    try {
      await sendPasswordResetEmail(auth, email);
      showMessage("Password reset email sent! Check your inbox. 📧", "success");
      document.getElementById('passwordResetModal').remove();
    } catch (error) {
      showMessage(getErrorMessage(error.code), "error");
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
      
      // Verificar si el usuario ya existe
      const userRef = ref(db, "users/" + user.uid);
      const snapshot = await get(userRef);
      
      if (!snapshot.exists()) {
        // Solo crear si no existe
        // ✅ AHORA (CORRECTO):
        await update(userRef, {
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          phone: "",
          provider: "Google",
          createdAt: new Date().toISOString()
        });
      }
      
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
// ✅ LOGIN CON APPLE
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
      
      const userRef = ref(db, "users/" + user.uid);
      const snapshot = await get(userRef);
      
      if (!snapshot.exists()) {
        // ✅ AHORA (CORRECTO):
        await update(userRef, {
          name: user.displayName || "Apple User",
          email: user.email || "No email",
          photoURL: user.photoURL || null,
          phone: "",
          provider: "Apple",
          createdAt: new Date().toISOString()
        });
      }
      
      localStorage.setItem("user", JSON.stringify({
        uid: user.uid,
        name: user.displayName || "Apple User",
        email: user.email || "No email"
      }));
      
      window.location.href = base + "/pages/dashboard.html";
    } catch (error) {
      showMessage("Apple login failed: " + error.message, "error");
    }
  });
});

// =========================
// ✅ OBSERVADOR DE SESIÓN
// =========================
onAuthStateChanged(auth, (user) => {
  console.log("Event: onAuthStateChanged. User:", user);
  window.currentUser = user;
  updateHeaderUI(user); 

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

// =========================
// ✅ FUNCIONES AUXILIARES
// =========================
function showMessage(message, type) {
  const existingMessage = document.querySelector('.auth-message');
  if (existingMessage) existingMessage.remove();
  
  const messageDiv = document.createElement('div');
  messageDiv.className = `auth-message ${type}`;
  messageDiv.textContent = message;
  
  if (!document.querySelector('style[data-auth-message]')) {
    const styles = `
      .auth-message {
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        font-weight: 600;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      }
      
      .auth-message.success {
        background-color: #d4edda;
        color: #155724;
        border-left: 4px solid #28a745;
      }
      
      .auth-message.error {
        background-color: #f8d7da;
        color: #721c24;
        border-left: 4px solid #dc3545;
      }
      
      @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      
      @media (max-width: 768px) {
        .auth-message {
          right: 10px;
          left: 10px;
          top: 80px;
        }
      }
    `;
    
    const styleElement = document.createElement('style');
    styleElement.setAttribute('data-auth-message', '');
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);
  }
  
  document.body.appendChild(messageDiv);
  
  setTimeout(() => {
    messageDiv.style.animation = 'slideIn 0.3s ease reverse';
    setTimeout(() => messageDiv.remove(), 300);
  }, 4000);
}

function getErrorMessage(errorCode) {
  const errorMessages = {
    'auth/email-already-in-use': 'This email is already registered.',
    'auth/invalid-email': 'Invalid email address.',
    'auth/weak-password': 'Password should be at least 6 characters.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password.',
    'auth/too-many-requests': 'Too many attempts. Please try again later.',
    'auth/network-request-failed': 'Network error. Check your connection.',
    'auth/requires-recent-login': 'Please log in again to change your password.',
  };
  
  return errorMessages[errorCode] || 'An error occurred. Please try again.';
}
// =========================
// ✅ EXPORTAR FUNCIONES (CORREGIDO)
// =========================
// Hacemos que la referencia a la base de datos y la función 'get' sean accesibles globalmente.
window.db = db;
window.ref = ref;
window.get = get;



// =========================
// ✅ EXPORTAR FUNCIONES
// =========================
export { updateProfile, update, ref, db, auth, get, showMessage, getErrorMessage };