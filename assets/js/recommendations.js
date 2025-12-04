// recommendations.js

const API_URL = "https://southamericanssecrets.onrender.com/api/recommendations/get";

function getCurrentUserToken() {
    return localStorage.getItem("backend_token") || null;
}

async function fetchRecommendations() {
    const token = getCurrentUserToken();

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
        return data.recommendations || [];

    } catch (err) {
        console.error("⚠ Error fetching recommendations", err);
        return [];
    }
}

function renderRecommendations(tours) {
    const container = document.getElementById("recommended-container");

    if (!container) return;

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
                <button onclick="openTour(${t.id})" class="rec-btn">View Tour</button>
            </div>
        `;
    });
}

async function initRecommendations() {
    const tours = await fetchRecommendations();
    renderRecommendations(tours);
}

document.addEventListener("DOMContentLoaded", initRecommendations);
