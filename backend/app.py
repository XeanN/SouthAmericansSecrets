# ================================
#  FIX GLOBAL PARA UTF-8 Y RUTAS
# ================================
import sys, os
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(BACKEND_DIR))
os.chdir(BACKEND_DIR)   # ← CORRIGE ERROR UTF-8 EN Render

# ================================
#  INICIO DEL BACKEND
# ================================
from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from datetime import timedelta

from routes.auth import auth_bp
from routes.recommendations import recommendations_bp
from routes.automation import automation_bp
from database.db import init_db
from config import Config

# ================================
#  FLASK APP
# ================================
app = Flask(__name__)
app.config.from_object(Config)

# ================================
#  CORS
# ================================
CORS(app, resources={
    r"/api/*": {
        "origins": [
            "https://xeann.github.io",
            "http://localhost:*",
            "https://southamericanssecrets.onrender.com"
        ],
        "methods": ["GET", "POST", "PUT", "DELETE"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# ================================
#  JWT
# ================================
jwt = JWTManager(app)

# ================================
#  BASE DE DATOS
# ================================
init_db()

# ================================
#  BLUEPRINTS
# ================================
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(recommendations_bp, url_prefix="/api/recommendations")
app.register_blueprint(automation_bp, url_prefix='/api/automation')

# ================================
#  INDEX
# ================================
@app.route('/')
def index():
    return jsonify({
        'message': 'South Americans Secrets API',
        'version': '1.0'
    })

# ================================
#  ERRORES
# ================================
@app.errorhandler(404)
def not_found(e):
    return jsonify({'error': 'No encontrado'}), 404

@app.errorhandler(500)
def server_error(e):
    return jsonify({'error': 'Error interno del servidor'}), 500

# ================================
#  EXPORTACIÓN WSGI PARA GUNICORN
# ================================
# Render NECESITA esto: application = app
application = app

# ================================
#  MODO LOCAL (NO USADO EN RENDER)
# ================================
if __name__ == '__main__':
    os.makedirs('data', exist_ok=True)
    os.makedirs('exports', exist_ok=True)
    app.run(debug=True, port=5000)
