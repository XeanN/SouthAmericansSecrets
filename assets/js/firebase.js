import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, browserLocalPersistence, setPersistence } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getDatabase, ref, push, set, update, get, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// Credenciales del proyecto de tu amigo (secrets-74e91)
const firebaseConfig = {
  apiKey: "AIzaSyADWQW2m0LOHMLhjbv27iQwQjVKLvIiqEw",
  authDomain: "secrets-74e91.firebaseapp.com",
  databaseURL: "https://secrets-74e91.firebaseio.com", 
  projectId: "secrets-74e91",
  storageBucket: "secrets-74e91.appspot.com",
  messagingSenderId: "TU_SENDER_ID", 
  appId: "TU_APP_ID" 
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app); // REALTIME DATABASE
const googleProvider = new GoogleAuthProvider();

// Persistencia
setPersistence(auth, browserLocalPersistence).catch((error) => console.error("Error auth:", error));

export { auth, db, googleProvider, signInWithPopup, ref, push, set, update, get, serverTimestamp };