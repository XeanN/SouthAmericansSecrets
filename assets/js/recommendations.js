// ============================
// CONFIG
// ============================

// Cambia esto por tu dominio backend Flask
const API_URL = "https://TUBACKEND/recommendations/get";

// Obtenemos token o userId desde localStorage
function getCurrentUserToken() {
    return localStorage.getItem("token") || null;
}

// ============================
// OBTENER RECOMENDACIONES
// ============================
async function fetchRecommendations() {
    const token = getCurrentUserToken();

    if (!token) {
        console.warn("⚠ No user token found. Guest mode.");
    }

    try {
        const res = await fetch(API_URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token ? `Bearer ${token}` : ""
            }
        });

        if (!res.ok) {
            console.error("❌ API error:", res.status);
            return [];
        }

        const data = await res.json();
        console.log("🎯 RECOMMENDATIONS:", data);

        return data.recommendations || [];

    } catch (err) {
        console.error("⚠ Error fetching recommendations", err);
        return [];
    }
}

// ============================
// PINTAR TARJETAS EN EL FRONT
// ============================
function renderRecommendations(tours) {
    const container = document.getElementById("recommended-container");

    if (!container) {
        console.error("No container for recommendations found.");
        return;
    }

    container.innerHTML = "";

    if (tours.length === 0) {
        container.innerHTML = "<p>No recommendations available right now.</p>";
        return;
    }

    tours.forEach(t => {
        container.innerHTML += `
            <div class="recommended-card">
                <img src="${t.image_url}" alt="${t.nombre}" class="rec-img">

                <h3>${t.nombre}</h3>
                <p>${t.descripcion}</p>

                <button onclick="openTour(${t.id})" class="rec-btn">
                    View Tour
                </button>
            </div>
        `;
    });
}

// ============================
// INICIALIZAR MODULO
// ============================
async function initRecommendations() {
    const tours = await fetchRecommendations();
    renderRecommendations(tours);
}

document.addEventListener("DOMContentLoaded", initRecommendations);
