// verifyToken.js
import { auth } from "./firebase.js";

const BACKEND_URL = "https://southamericanssecrets.onrender.com/api";

export async function verifyFirebaseTokenOnBackend() {
  const user = auth.currentUser;
  if (!user) return null;

  try {
    // Token de Firebase
    const firebaseToken = await user.getIdToken(true);

    const res = await fetch(`${BACKEND_URL}/auth/firebase/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: firebaseToken })
    });

    const data = await res.json();

    if (data.backend_token) {
      localStorage.setItem("backend_token", data.backend_token);
    }

    return data;

  } catch (error) {
    console.error("❌ Error verifying token on backend:", error);
    return null;
  }
}
