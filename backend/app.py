# ================================
#  FIX GLOBAL PARA UTF-8
# ================================
import sys, os
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(BACKEND_DIR))

# ================================
#  INICIO DEL BACKEND
# ================================
from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from routes.auth import auth_bp
from routes.recommendations import recommendations_bp
from routes.automation import automation_bp
from database.db import init_db
from database.firebase_admin import init_firebase
from config import Config

# Inicializar Firebase
firebase_db = init_firebase()

# Crear Flask App
app = Flask(__name__)
app.config.from_object(Config)

# CORS – Producción + Local
CORS(app, resources={
    r"/api/*": {
        "origins": [
            "https://xeann.github.io",
            "http://localhost:*"
        ],
        "methods": ["GET", "POST", "PUT", "DELETE"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# JWT
jwt = JWTManager(app)

# Base de datos
init_db()

# Blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(recommendations_bp, url_prefix='/api/recommendations')
app.register_blueprint(automation_bp, url_prefix='/api/automation')

# ================================
#          RUTAS
# ================================
@app.route('/')
def index():
    return jsonify({
        "message": "South Americans Secrets API",
        "status": "running",
        "env": os.environ.get("FLASK_ENV", "unknown")
    })

@app.errorhandler(404)
def not_found(e):
    return jsonify({'error': 'No encontrado'}), 404

@app.errorhandler(500)
def server_error(e):
    return jsonify({'error': 'Error interno del servidor'}), 500

# ================================
#    MODO LOCAL VS PRODUCCIÓN
# ================================
if __name__ == "__main__":
    # Local
    app.run(debug=True, port=5000)
else:
    # Producción (Render usa Gunicorn)
    application = app
