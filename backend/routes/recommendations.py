from flask import Blueprint, request, jsonify
from firebase_admin import auth as firebase_auth
from models.recommender import RecommendationEngine
from database.db import (
    execute_query,
    get_all_destinations,
    insert_user_interaction,
    get_user_interactions
)
import json

recommendations_bp = Blueprint("recommendations", __name__)

# ============================================================
#  UTILIDAD — OBTENER UID DE FIREBASE DESDE EL TOKEN
# ============================================================

def current_user_firebase_uid():
    """Obtiene el UID verificando el Bearer Token con Firebase."""
    auth_header = request.headers.get("Authorization")

    if not auth_header:
        raise Exception("No se envió token Authorization")

    token = auth_header.replace("Bearer ", "").strip()

    decoded = firebase_auth.verify_id_token(token)
    return decoded["uid"]


# ============================================================
#  INICIALIZAR MOTOR IA
# ============================================================

recommender = RecommendationEngine()

def initialize_recommender():
    try:
        destinations = get_all_destinations()
        if destinations:
            recommender.load_destinations(destinations)
            print(f"Motor de IA cargado con {len(destinations)} destinos")
        else:
            print("⚠ No se encontraron destinos")
    except Exception as e:
        print("Error al inicializar recomendador:", e)

initialize_recommender()

# ============================================================
#  RECOMENDACIONES PERSONALIZADAS
# ============================================================

@recommendations_bp.route("/personalized", methods=["GET"])
def get_personalized_recommendations():
    """Recomendaciones personalizadas usando IA + interacciones del usuario."""
    try:
        uid = current_user_firebase_uid()
        limit = int(request.args.get("limit", 10))

        # Interacciones
        interactions = get_user_interactions(uid)

        # Preferencias (si las guardas en SQLite o Firebase)
        user = execute_query(
            "SELECT preferencias FROM users WHERE id = ?",
            (uid,),
            fetch="one"
        )

        preferences = json.loads(user["preferencias"]) if user and user["preferencias"] else {}

        # IA híbrida
        recommendations = recommender.get_personalized_recommendations(
            user_id=uid,
            user_interactions=interactions,
            user_preferences=preferences,
            n_recommendations=limit
        )

        # Enriquecer datos
        enriched = []
        for rec in recommendations:
            dest = execute_query(
                "SELECT * FROM destinations WHERE id = ?",
                (rec["destination_id"],),
                fetch="one"
            )
            if dest:
                enriched.append({
                    **rec,
                    **dest
                })

        return jsonify({
            "recommendations": enriched,
            "total": len(enriched)
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ============================================================
#  DESTINOS SIMILARES (CONTENT BASED IA)
# ============================================================

@recommendations_bp.route("/similar/<int:destination_id>", methods=["GET"])
def get_similar_destinations(destination_id):
    try:
        limit = int(request.args.get("limit", 5))

        # Confirmar que existe
        destination = execute_query(
            "SELECT * FROM destinations WHERE id = ?",
            (destination_id,),
            fetch="one"
        )

        if not destination:
            return jsonify({"error": "Destino no encontrado"}), 404

        # IA contenido
        sims = recommender.content_based_filtering(destination_id, n_recommendations=limit)

        enriched = []
        for rec in sims:
            dest = execute_query(
                "SELECT * FROM destinations WHERE id = ?",
                (rec["destination_id"],),
                fetch="one"
            )
            if dest:
                enriched.append({**rec, **dest})

        return jsonify({
            "current_destination": {
                "id": destination["id"],
                "nombre": destination["nombre"],
                "pais": destination["pais"]
            },
            "similar_destinations": enriched,
            "total": len(enriched)
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ============================================================
#  RECOMENDACIONES POR PREFERENCIAS MANUALES
# ============================================================

@recommendations_bp.route("/by-preferences", methods=["POST"])
def get_by_preferences():
    try:
        uid = current_user_firebase_uid()
        data = request.get_json()

        limit = data.get("limit", 5)

        results = recommender.get_similar_destinations(
            preferences=data,
            n_recommendations=limit
        )

        return jsonify({
            "recommendations": results,
            "total": len(results),
            "preferences_used": data
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ============================================================
#  REGISTRAR INTERACCIÓN DEL USUARIO
# ============================================================

@recommendations_bp.route("/track-interaction", methods=["POST"])
def track_interaction():
    try:
        uid = current_user_firebase_uid()
        data = request.get_json()

        if not data.get("destination_id") or not data.get("interaction_type"):
            return jsonify({"error": "destination_id e interaction_type son requeridos"}), 400

        interaction_id = insert_user_interaction(
            user_id=uid,
            destination_id=data["destination_id"],
            interaction_type=data["interaction_type"],
            rating=data.get("rating"),
            tiempo_visualizacion=data.get("tiempo_visualizacion"),
            clicked=data.get("clicked", 0),
            favorito=data.get("favorito", 0)
        )

        return jsonify({"message": "Interacción registrada", "id": interaction_id}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ============================================================
#  FAVORITOS
# ============================================================

@recommendations_bp.route("/favorites", methods=["GET"])
def get_favorites():
    try:
        uid = current_user_firebase_uid()

        favorites = execute_query(
            """SELECT d.*, ui.timestamp AS added_at
               FROM user_interactions ui
               JOIN destinations d ON ui.destination_id = d.id
               WHERE ui.user_id = ? AND ui.favorito = 1
               ORDER BY ui.timestamp DESC""",
            (uid,)
        )

        return jsonify({
            "favorites": favorites,
            "total": len(favorites)
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@recommendations_bp.route("/favorites/<int:destination_id>", methods=["POST", "DELETE"])
def manage_favorite(destination_id):
    try:
        uid = current_user_firebase_uid()

        if request.method == "POST":
            insert_user_interaction(
                user_id=uid,
                destination_id=destination_id,
                interaction_type="favorite",
                favorito=1
            )
            msg = "Agregado a favoritos"
        else:
            execute_query(
                """UPDATE user_interactions
                   SET favorito = 0
                   WHERE user_id = ? AND destination_id = ?""",
                (uid, destination_id),
                fetch=None
            )
            msg = "Quitado de favoritos"

        return jsonify({"message": msg}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ============================================================
#  LISTAR TODOS LOS DESTINOS
# ============================================================

@recommendations_bp.route("/destinations", methods=["GET"])
def get_destinations():
    try:
        categoria = request.args.get("categoria")
        pais = request.args.get("pais")
        precio_max = request.args.get("precio_max")

        query = "SELECT * FROM destinations WHERE 1=1"
        params = []

        if categoria:
            query += " AND categoria = ?"
            params.append(categoria)

        if pais:
            query += " AND pais = ?"
            params.append(pais)

        if precio_max:
            query += " AND precio_promedio <= ?"
            params.append(float(precio_max))

        query += " ORDER BY rating DESC"

        destinations = execute_query(query, tuple(params) if params else None)

        return jsonify({"destinations": destinations, "total": len(destinations)}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ============================================================
#  DETALLES DE DESTINO
# ============================================================

@recommendations_bp.route("/destinations/<int:destination_id>", methods=["GET"])
def get_destination_detail(destination_id):
    try:
        destination = execute_query(
            "SELECT * FROM destinations WHERE id = ?",
            (destination_id,),
            fetch="one"
        )

        if not destination:
            return jsonify({"error": "Destino no encontrado"}), 404

        return jsonify(destination), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ============================================================
#  LISTAR TOURS (ALIAS DE DESTINATIONS)
# ============================================================

@recommendations_bp.route("/tours", methods=["GET"])
def list_tours():
    """
    Devuelve la lista de tours (alias de la tabla destinations).
    Permite usar ?limit=10 para limitar resultados.
    """
    try:
        limit = request.args.get("limit", type=int)

        # Usamos el helper que ya existe y funciona
        tours = get_all_destinations()  # lista de dicts

        if limit:
            tours = tours[:limit]

        return jsonify({
            "tours": tours,
            "total": len(tours)
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ============================================================
#  DETALLE DE UN TOUR
# ============================================================

@recommendations_bp.route("/tours/<int:tour_id>", methods=["GET"])
def get_tour_detail(tour_id):
    """
    Detalles de un tour específico (tomado de destinations).
    """
    try:
        tour = execute_query(
            "SELECT * FROM destinations WHERE id = ?",
            (tour_id,),
            fetch="one"
        )

        if not tour:
            return jsonify({"error": "Tour no encontrado"}), 404

        return jsonify(tour), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ============================================================
#  TOURS POPULARES (PARA USUARIOS SIN LOGIN)
# ============================================================

@recommendations_bp.route("/popular", methods=["GET"])
def get_popular_tours():
    """
    Lista de tours populares.
    Primero intenta ordenando por rating (si existe la columna).
    Si falla, usa un fallback simple con los primeros N destinos.
    """
    try:
        limit = request.args.get("limit", 10, type=int)

        try:
            # Intento principal: ordenar por rating
            sql = """
                SELECT * FROM destinations
                ORDER BY rating DESC
                LIMIT ?
            """
            popular = execute_query(sql, (limit,))
        except Exception:
            # Fallback: simplemente tomar los primeros N
            all_dest = get_all_destinations()
            popular = all_dest[:limit]

        return jsonify({
            "popular_destinations": popular,
            "total": len(popular)
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ============================================================
#  BUSCAR TOURS POR TEXTO
# ============================================================

@recommendations_bp.route("/tours/search", methods=["GET"])
def search_tours():
    """
    Búsqueda simple por nombre de tour.
    GET /api/recommendations/tours/search?q=cusco
    """
    try:
        q = request.args.get("q", "").strip().lower()

        if not q:
            return jsonify({"tours": [], "total": 0}), 200

        like = f"%{q}%"

        sql = """
            SELECT * FROM destinations
            WHERE lower(nombre) LIKE ?
        """
        tours = execute_query(sql, (like,))

        return jsonify({"tours": tours, "total": len(tours)}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
# ============================================================
#  FIN DEL ARCHIVO