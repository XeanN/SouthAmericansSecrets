
// Importar Firebase v9 modular
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, browserLocalPersistence, setPersistence } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getDatabase, ref, set, update, push } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyADWQW2m0LOHMLhjbv27iQwQjVKLvIiqEw",
  authDomain: "secrets-74e91.firebaseapp.com",
  databaseURL: "https://secrets-74e91.firebaseio.com",
  projectId: "secrets-74e91"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

setPersistence(auth, browserLocalPersistence)
  .then(() => console.log("✅ Auth persistence enabled"))
  .catch(console.error);


  
const googleProvider = new GoogleAuthProvider();

export { auth, db, googleProvider, signInWithPopup, ref, set, update, push };
