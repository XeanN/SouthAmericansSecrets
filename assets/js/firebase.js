// Importar Firebase (Versión compatible Modular)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, browserLocalPersistence, setPersistence } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
// CAMBIO IMPORTANTE: Importamos Realtime Database
import { getDatabase, ref, push, set, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// ✅ TUS CREDENCIALES (Del proyecto secrets-74e91)
const firebaseConfig = {
  apiKey: "AIzaSyADWQW2m0LOHMLhjbv27iQwQjVKLvIiqEw",
  authDomain: "secrets-74e91.firebaseapp.com",
  databaseURL: "https://secrets-74e91.firebaseio.com", // Esto es OBLIGATORIO para Realtime DB
  projectId: "secrets-74e91",
  storageBucket: "secrets-74e91.appspot.com",
  messagingSenderId: "TU_SENDER_ID", 
  appId: "TU_APP_ID" 
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Servicios
const auth = getAuth(app);
const db = getDatabase(app); // 🔥 AHORA USAMOS REALTIME DATABASE
const googleProvider = new GoogleAuthProvider();

// Configurar persistencia
setPersistence(auth, browserLocalPersistence)
  .then(() => console.log("✅ Sesión persistente activada"))
  .catch((error) => console.error("Error auth:", error));

// Exportamos las funciones necesarias para guardar datos
export { auth, db, googleProvider, signInWithPopup, ref, push, set, serverTimestamp };