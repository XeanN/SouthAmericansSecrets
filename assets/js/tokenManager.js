// tokenManager.js

// =======================
// 🔹 Guardar
// =======================
export function saveBackendToken(token) {
  localStorage.setItem("backend_token", token);
}

export function saveFirebaseUser(user) {
  localStorage.setItem("sas_user", JSON.stringify({
    uid: user.uid,
    email: user.email,
    name: user.displayName,
    photo: user.photoURL
  }));
}

// =======================
// 🔹 Obtener
// =======================
export function getBackendToken() {
  return localStorage.getItem("backend_token");
}

export function getFirebaseUser() {
  const data = localStorage.getItem("sas_user");
  return data ? JSON.parse(data) : null;
}

// =======================
// 🔹 Borrar
// =======================
export function logoutAll() {
  localStorage.removeItem("sas_user");
  localStorage.removeItem("backend_token");
}
