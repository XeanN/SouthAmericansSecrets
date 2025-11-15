from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from database.db import execute_query
from datetime import datetime
import json

auth_bp = Blueprint("auth", __name__)

# ============================================================
#                   REGISTRO DE USUARIO
# ============================================================
@auth_bp.route("/register", methods=["POST"])
def register():
    try:
        data = request.get_json()

        if not data:
            return jsonify({"error": "Cuerpo JSON requerido"}), 400

        # Validación mínima
        email = data.get("email")
        password = data.get("password")
        nombre = data.get("nombre")
        preferencias = data.get("preferencias", {})

        if not email or not password or not nombre:
            return jsonify({"error": "Email, password y nombre son requeridos"}), 400

        # Verificar si el usuario ya existe
        existing = execute_query(
            "SELECT id FROM users WHERE email = ?",
            (email,),
            fetch="one"
        )

        if existing:
            return jsonify({"error": "El email ya está registrado"}), 400

        # Hash del password
        password_hash = generate_password_hash(password)

        # Insertar usuario
        execute_query(
            """
            INSERT INTO users (email, password_hash, nombre, preferencias)
            VALUES (?, ?, ?, ?)
            """,
            (email, password_hash, nombre, json.dumps(preferencias)),
            fetch=None
        )

        # Obtener ID del usuario recién creado
        user = execute_query(
            "SELECT id FROM users WHERE email = ?",
            (email,),
            fetch="one"
        )

        user_id = user["id"]

        # Crear token JWT (CORREGIDO: usar string)
        access_token = create_access_token(identity=str(user_id))

        return jsonify({
            "message": "Usuario registrado exitosamente",
            "user": {
                "id": user_id,
                "email": email,
                "nombre": nombre
            },
            "access_token": access_token
        }), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ============================================================
#                      LOGIN DE USUARIO
# ============================================================
@auth_bp.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json()

        if not data:
            return jsonify({"error": "Cuerpo JSON requerido"}), 400

        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return jsonify({"error": "Email y password son requeridos"}), 400

        # Buscar usuario
        user = execute_query(
            "SELECT * FROM users WHERE email = ?",
            (email,),
            fetch="one"
        )

        if not user:
            return jsonify({"error": "Credenciales inválidas"}), 401

        # Validación de password
        if not check_password_hash(user["password_hash"], password):
            return jsonify({"error": "Credenciales inválidas"}), 401

        # Actualizar último login
        execute_query(
            "UPDATE users SET last_login = ? WHERE id = ?",
            (datetime.now(), user["id"]),
            fetch=None
        )

        # Crear token JWT (CORREGIDO: usar string)
        access_token = create_access_token(identity=str(user["id"]))

        preferencias = json.loads(user["preferencias"]) if user["preferencias"] else {}

        return jsonify({
            "message": "Login exitoso",
            "user": {
                "id": user["id"],
                "email": user["email"],
                "nombre": user["nombre"],
                "preferencias": preferencias
            },
            "access_token": access_token
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ============================================================
#                PERFIL DEL USUARIO AUTENTICADO
# ============================================================
@auth_bp.route("/profile", methods=["GET"])
@jwt_required()
def get_profile():
    try:
        user_id = get_jwt_identity()

        user = execute_query(
            """
            SELECT id, email, nombre, preferencias, created_at, last_login
            FROM users WHERE id = ?
            """,
            (user_id,),
            fetch="one"
        )

        if not user:
            return jsonify({"error": "Usuario no encontrado"}), 404

        preferencias = json.loads(user["preferencias"]) if user["preferencias"] else {}

        # Estadísticas
        interactions = execute_query(
            "SELECT COUNT(*) AS total FROM user_interactions WHERE user_id = ?",
            (user_id,),
            fetch="one"
        )
        favorites = execute_query(
            "SELECT COUNT(*) AS total FROM user_interactions WHERE user_id = ? AND favorito = 1",
            (user_id,),
            fetch="one"
        )

        return jsonify({
            "user": {
                "id": user["id"],
                "email": user["email"],
                "nombre": user["nombre"],
                "preferencias": preferencias,
                "created_at": user["created_at"],
                "last_login": user["last_login"]
            },
            "stats": {
                "total_interactions": interactions["total"],
                "favorites": favorites["total"]
            }
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ============================================================
#                     ACTUALIZAR PERFIL
# ============================================================
@auth_bp.route("/profile", methods=["PUT"])
@jwt_required()
def update_profile():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()

        updates = []
        params = []

        if "nombre" in data:
            updates.append("nombre = ?")
            params.append(data["nombre"])

        if "preferencias" in data:
            updates.append("preferencias = ?")
            params.append(json.dumps(data["preferencias"]))

        if not updates:
            return jsonify({"error": "No hay datos para actualizar"}), 400

        params.append(user_id)

        query = f"UPDATE users SET {', '.join(updates)} WHERE id = ?"
        execute_query(query, tuple(params), fetch=None)

        return jsonify({"message": "Perfil actualizado correctamente"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ============================================================
#             GUARDAR SOLO PREFERENCIAS DEL USUARIO
# ============================================================
@auth_bp.route("/preferences", methods=["POST"])
@jwt_required()
def save_preferences():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()

        execute_query(
            "UPDATE users SET preferencias = ? WHERE id = ?",
            (json.dumps(data), user_id),
            fetch=None
        )

        return jsonify({
            "message": "Preferencias guardadas",
            "preferencias": data
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
