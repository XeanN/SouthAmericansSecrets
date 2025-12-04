// api.js
import { getBackendToken } from "./tokenManager.js";

const API_URL = "https://southamericanssecrets.onrender.com/api";

export async function apiGet(endpoint) {
  const token = getBackendToken();

  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Authorization": "Bearer " + token
    }
  });

  return res.json();
}

export async function apiPost(endpoint, body) {
  const token = getBackendToken();

  const res = await fetch(`${API_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify(body)
  });

  return res.json();
}
