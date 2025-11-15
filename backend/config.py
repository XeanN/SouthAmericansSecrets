import os
from datetime import timedelta
from dotenv import load_dotenv

# Cargar variables del archivo .env
load_dotenv()

class Config:
    # Claves de seguridad
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key-change-in-production")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "jwt-secret-key-change-in-production")

    # Configuración JWT
    JWT_TOKEN_LOCATION = ["headers"]
    JWT_HEADER_NAME = "Authorization"
    JWT_HEADER_TYPE = "Bearer"
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)

    # CORS
    CORS_HEADERS = "Content-Type"

    # Base de datos SQLite
    DATABASE_PATH = os.path.join("database", "database.db")

    # Configuración opcional de email
    MAIL_USERNAME = os.getenv("MAIL_USERNAME")
    MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")

    # Carpeta para exportar archivos PDF
    EXPORT_FOLDER = "exports"
