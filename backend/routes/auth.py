# ============================================
#   AUTENTICACIÓN 100% FIREBASE
# ============================================

from flask import Blueprint, request, jsonify
from firebase_admin import auth as firebase_auth
from flask_jwt_extended import create_access_token

auth_bp = Blueprint("auth", __name__)

# ============================================================
# 1) VERIFICAR TOKEN DE FIREBASE (LOGIN REAL)
# ============================================================

@auth_bp.route("/firebase/verify", methods=["POST"])
def verify_firebase_token():
    """
    Recibe desde el frontend un token ID de Firebase,
    lo valida en Firebase Admin y devuelve los datos del usuario.
    """
    try:
        data = request.get_json(silent=True) or {}
        token = data.get("token")

        if not token:
            return jsonify({"error": "Token requerido"}), 400

        # Verifica token contra Firebase
        decoded = firebase_auth.verify_id_token(token)

        uid = decoded["uid"]
        email = decoded.get("email", "")
        name = decoded.get("name", "")
        picture = decoded.get("picture", "")

        # Token interno opcional del backend
        backend_token = create_access_token(identity=uid)

        return jsonify({
            "message": "Token válido",
            "user": {
                "uid": uid,
                "email": email,
                "name": name,
                "picture": picture
            },
            "backend_token": backend_token
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 401


# ============================================================
# 2) OBTENER USUARIO DESDE ID TOKEN (PARA DEBUG)
# ============================================================

@auth_bp.route("/firebase/user", methods=["GET"])
def get_user_from_token():
    """
    Permite leer el usuario actual enviando un Bearer Token.
    (Útil para debug o apps móviles)
    """
    try:
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            return jsonify({"error": "Authorization requerido"}), 400

        token = auth_header.replace("Bearer ", "").strip()
        decoded = firebase_auth.verify_id_token(token)

        return jsonify({
            "uid": decoded["uid"],
            "email": decoded.get("email"),
            "name": decoded.get("name"),
            "picture": decoded.get("picture"),
            "provider": decoded.get("firebase", {}).get("sign_in_provider", "unknown")
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 401


# ============================================================
# 3) OPCIONAL: CERRAR SESIÓN (solo informativo)
# ============================================================

@auth_bp.route("/logout", methods=["POST"])
def logout():
    """
    Firebase no utiliza logout del backend,
    pero para coherencia enviamos una respuesta OK.
    """
    return jsonify({"message": "Logout manejado desde frontend (Firebase Auth)."}), 200
