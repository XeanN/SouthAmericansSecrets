# routes/recommendations.py
# =======================================================
#  API DE RECOMENDACIONES PARA South Americans Secrets
#  Opción C: Carga desde CSV en /data (destinations, tours, interactions)
# =======================================================

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from pathlib import Path
import pandas as pd
import unicodedata
import re

from models.recommender import RecommendationEngine

recommendations_bp = Blueprint("recommendations", __name__)

# -------------------------------------------------------
# Rutas de los CSV locales (dentro del backend)
#   backend/
#     ├─ app.py
#     ├─ routes/
#     ├─ models/
#     └─ data/
#         ├─ destinations.csv
#         ├─ tours.csv
#         └─ user_interactions.csv
# -------------------------------------------------------
BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"

DESTINATIONS_CSV = DATA_DIR / "destinations.csv"
TOURS_CSV = DATA_DIR / "tours.csv"
INTERACTIONS_CSV = DATA_DIR / "user_interactions.csv"

# -------------------------------------------------------
# Helpers
# -------------------------------------------------------

def slugify(text: str) -> str:
    """Convierte un nombre de tour a slug tipo 'paracas-national-reserve'."""
    text = str(text)
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode("ascii")
    text = re.sub(r"[^a-zA-Z0-9\s-]", "", text).lower()
    text = re.sub(r"[\s_-]+", "-", text).strip("-")
    return text


def load_csv(path: Path) -> pd.DataFrame:
    """Carga un CSV y devuelve un DataFrame; si falla, devuelve DF vacío."""
    try:
        if not path.exists():
            print(f"⚠️ CSV no encontrado: {path}")
            return pd.DataFrame()
        df = pd.read_csv(path)
        return df
    except Exception as e:
        print(f"⚠️ Error leyendo {path.name}: {e}")
        return pd.DataFrame()


# -------------------------------------------------------
# Carga inicial de datos en memoria
# -------------------------------------------------------

destinations_df = load_csv(DESTINATIONS_CSV)
tours_df = load_csv(TOURS_CSV)
interactions_df = load_csv(INTERACTIONS_CSV)

# Asegurar columna ID para destinos
if not destinations_df.empty:
    if "id" not in destinations_df.columns:
        destinations_df = destinations_df.reset_index(drop=True)
        destinations_df["id"] = destinations_df.index + 1

# Asegurar columnas clave
for col in ["nombre", "pais", "categoria", "descripcion", "actividades", "precio_promedio", "rating"]:
    if col not in destinations_df.columns:
        destinations_df[col] = ""

# Instanciar motor de recomendaciones y cargar catálogo
recommender = RecommendationEngine()
if not destinations_df.empty:
    recommender.load_destinations(destinations_df.to_dict(orient="records"))
else:
    print("⚠️ destinations_df está vacío, el motor de recomendaciones sólo podrá responder con listas vacías.")


def destination_to_tour_json(row: pd.Series) -> dict:
    """
    Convierte una fila de destinations_df en el formato que el frontend usa:
      - id
      - name
      - region
      - url
      - image
    """
    dest_id = int(row.get("id", 0))
    name = str(row.get("nombre", ""))
    pais = str(row.get("pais", "Perú"))

    # Región simple para fallback (Costa / Sierra / Selva)
    region = "Costa"
    if "Nazca" in name or "Arequipa" in name or "Ica" in name:
        region = "Sierra"  # solo para segmentar un poco en el fallback

    slug = slugify(name)

    # URL actual basada en tu estructura de GitHub Pages
    # (Puedes ajustar si cambias la estructura de rutas)
    url = (
        f"https://xeann.github.io/SouthAmericansSecrets/"
        f"tour/coast-of-peru/nature/{slug}.html"
    )

    imagen = row.get("imagen_url", "")

    return {
        "id": dest_id,
        "name": name,
        "region": region,
        "country": pais,
        "url": url,
        "image": imagen,
        "rating": float(row.get("rating", 0)) if pd.notna(row.get("rating")) else 0.0,
    }


# =======================================================
# 1) Endpoint básico: listado de tours para el buscador
#    GET /api/recommendations/tours
# =======================================================

@recommendations_bp.route("/tours", methods=["GET"])
def get_tours():
    """
    Devuelve un listado de tours para el buscador del dashboard.
    El frontend espera data.destinations o data.tours → nosotros devolvemos 'tours'.
    """
    try:
        if destinations_df.empty:
            return jsonify({"tours": []}), 200

        tours_list = [destination_to_tour_json(row) for _, row in destinations_df.iterrows()]
        return jsonify({"tours": tours_list}), 200

    except Exception as e:
        print("❌ Error en /tours:", e)
        return jsonify({"tours": [], "error": str(e)}), 500


# =======================================================
# 2) Destinos populares (sin login)
#    GET /api/recommendations/popular?limit=5
# =======================================================

@recommendations_bp.route("/popular", methods=["GET"])
def popular_destinations():
    """
    Devuelve destinos populares basados en rating.
    Frontend espera: data.popular_destinations
    """
    try:
        limit = int(request.args.get("limit", 5))

        if recommender.destinations_df is None or recommender.destinations_df.empty:
            return jsonify({"popular_destinations": []}), 200

        recs = recommender.popularity_based(limit)

        # Enriquecer con URL, imagen, etc.
        results = []
        for r in recs:
            dest_id = r.get("destination_id")
            match = destinations_df[destinations_df["id"] == dest_id]
            if match.empty:
                continue
            row = match.iloc[0]
            tour_json = destination_to_tour_json(row)
            tour_json["score"] = r.get("score", 0)
            tour_json["algorithm"] = r.get("algorithm", "popularity")
            results.append(tour_json)

        return jsonify({"popular_destinations": results}), 200

    except Exception as e:
        print("❌ Error en /popular:", e)
        return jsonify({"popular_destinations": [], "error": str(e)}), 500


# =======================================================
# 3) Recomendaciones personalizadas (con JWT opcional)
#    GET /api/recommendations/personalized?limit=5
# =======================================================

@recommendations_bp.route("/personalized", methods=["GET"])
@jwt_required(optional=True)
def personalized_recommendations():
    """
    Devuelve recomendaciones personalizadas si hay JWT válido.
    Si no hay usuario o no hay interacciones, devuelve populares.

    Frontend espera: data.recommendations
    """
    try:
        limit = int(request.args.get("limit", 5))
        uid = get_jwt_identity()  # UID de Firebase si viene del backend_token

        # Si no hay catálogo, devolvemos vacío
        if recommender.destinations_df is None or recommender.destinations_df.empty:
            return jsonify({"recommendations": []}), 200

        # Por ahora, usamos populares como base.
        # Más adelante se puede mapear uid -> user_id y usar interactions_df.
        recs = recommender.popularity_based(limit)

        results = []
        for r in recs:
            dest_id = r.get("destination_id")
            match = destinations_df[destinations_df["id"] == dest_id]
            if match.empty:
                continue
            row = match.iloc[0]
            tour_json = destination_to_tour_json(row)
            tour_json["score"] = r.get("score", 0)
            tour_json["algorithm"] = r.get("algorithm", "popularity" if not uid else "personalized")
            results.append(tour_json)

        return jsonify({"recommendations": results, "uid": uid}), 200

    except Exception as e:
        print("❌ Error en /personalized:", e)
        return jsonify({"recommendations": [], "error": str(e)}), 500


# =======================================================
# 4) Endpoint de estado (debug)
#    GET /api/recommendations/status
# =======================================================

@recommendations_bp.route("/status", methods=["GET"])
def status():
    """
    Pequeño endpoint de debug para ver que todo está cargado.
    """
    return jsonify({
        "destinations_loaded": int(len(destinations_df)),
        "tours_loaded": int(len(tours_df)),
        "interactions_loaded": int(len(interactions_df)),
        "engine_ready": recommender.destinations_df is not None and not recommender.destinations_df.empty
    }), 200
