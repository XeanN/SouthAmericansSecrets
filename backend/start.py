#!/usr/bin/env python3
"""
Script de inicio rápido para South Americans Secrets
Sistema Inteligente de Recomendación
"""

import os
import sys
import subprocess
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(BACKEND_DIR))

def print_header():
    """Mostrar header del sistema"""
    print("\n" + "="*70)
    print("🌎 SOUTH AMERICANS SECRETS")
    print("Sistema Inteligente de Recomendación y Automatización")
    print("="*70 + "\n")

def check_python_version():
    """Verificar versión de Python"""
    version = sys.version_info
    print(f"✓ Python {version.major}.{version.minor}.{version.micro}")
    
    if version.major < 3 or (version.major == 3 and version.minor < 8):
        print("❌ ERROR: Se requiere Python 3.8 o superior")
        return False
    return True

def create_directories():
    """Crear directorios necesarios"""
    directories = ['database', 'data', 'exports', 'ml/models', 'logs']
    
    for directory in directories:
        Path(directory).mkdir(parents=True, exist_ok=True)
    
    print("✓ Directorios creados")

def check_dependencies():
    """Verificar si las dependencias están instaladas"""
    try:
        import flask
        import flask_cors
        import flask_jwt_extended
        import pandas
        import sklearn
        import numpy
        print("✓ Dependencias instaladas")
        return True
    except ImportError:
        print("⚠️  Algunas dependencias no están instaladas")
        return False

def install_dependencies():
    """Instalar dependencias"""
    print("\n📦 Instalando dependencias...")
    
    try:
        subprocess.check_call([
            sys.executable, "-m", "pip", "install", "-r", "requirements.txt"
        ])
        print("✓ Dependencias instaladas correctamente")
        return True
    except subprocess.CalledProcessError:
        print("❌ Error al instalar dependencias")
        return False

def initialize_database():
    """Inicializar base de datos"""
    print("\n💾 Inicializando base de datos...")
    
    try:
        from database.db import init_db
        init_db()
        print("✓ Base de datos inicializada con datos de ejemplo")
        return True
    except Exception as e:
        print(f"❌ Error al inicializar BD: {e}")
        return False

def show_api_info():
    """Mostrar información de la API"""
    print("\n" + "="*70)
    print("📡 INFORMACIÓN DE LA API")
    print("="*70)
    print("\n🔗 URL Base: http://localhost:5000/api")
    print("\n📚 Endpoints principales:")
    print("\n  Autenticación:")
    print("    POST /api/auth/register     - Registrar usuario")
    print("    POST /api/auth/login        - Iniciar sesión")
    print("    GET  /api/auth/profile      - Obtener perfil")
    print("\n  Recomendaciones (con IA):")
    print("    GET  /api/recommendations/personalized  - Recomendaciones personalizadas")
    print("    GET  /api/recommendations/similar/{id}  - Destinos similares")
    print("    POST /api/recommendations/track-interaction - Registrar interacción")
    print("    GET  /api/recommendations/favorites     - Ver favoritos")
    print("\n  Automatización:")
    print("    POST /api/automation/generate-itinerary     - Generar itinerario")
    print("    POST /api/automation/export-itinerary-pdf  - Exportar a PDF")
    print("    POST /api/automation/send-recommendations-email - Enviar email")
    print("    POST /api/automation/generate-report        - Generar reporte")
    print("\n" + "="*70)

def show_test_commands():
    """Mostrar comandos de prueba"""
    print("\n💡 COMANDOS DE PRUEBA CON cURL:")
    print("\n1. Registrar usuario:")
    print('   curl -X POST http://localhost:5000/api/auth/register \\')
    print('     -H "Content-Type: application/json" \\')
    print('     -d \'{"email":"test@example.com","password":"test123","nombre":"Usuario Test"}\'')
    
    print("\n2. Login:")
    print('   curl -X POST http://localhost:5000/api/auth/login \\')
    print('     -H "Content-Type: application/json" \\')
    print('     -d \'{"email":"test@example.com","password":"test123"}\'')
    
    print("\n3. Obtener recomendaciones (reemplazar TOKEN):")
    print('   curl http://localhost:5000/api/recommendations/personalized?limit=5 \\')
    print('     -H "Authorization: Bearer TOKEN"')
    print()

def create_env_file():
    """Crear archivo .env de ejemplo si no existe"""
    env_file = Path('.env')
    
    if not env_file.exists():
        print("\n📝 Creando archivo .env de ejemplo...")
        
        env_content = """# Configuración del Sistema
SECRET_KEY=dev-secret-key-change-in-production
JWT_SECRET_KEY=jwt-secret-key-change-in-production

# Configuración de Email (Opcional - Para envío de correos)
# MAIL_USERNAME=tu_email@gmail.com
# MAIL_PASSWORD=tu_app_password_de_gmail

# Nota: Para usar Gmail:
# 1. Habilitar verificación en dos pasos
# 2. Generar contraseña de aplicación: https://myaccount.google.com/apppasswords
"""
        
        with open(env_file, 'w') as f:
            f.write(env_content)
        
        print("✓ Archivo .env creado")
        print("⚠️  Edita .env para configurar email (opcional)")

def start_server():
    """Iniciar el servidor Flask"""
    print("\n🚀 Iniciando servidor...")
    print("\n" + "="*70)
    print("🎉 SISTEMA LISTO")
    print("="*70)
    print("\n📍 Servidor ejecutándose en: http://localhost:5000")
    print("📍 Documentación API: http://localhost:5000")
    print("\n💡 Presiona Ctrl+C para detener el servidor\n")
    print("="*70 + "\n")
    
    try:
        from app import app
        app.run(debug=True, host='0.0.0.0', port=5000)
    except KeyboardInterrupt:
        print("\n\n👋 Servidor detenido")
        print("="*70 + "\n")
    except Exception as e:
        print(f"\n❌ Error al iniciar servidor: {e}")

def main():
    """Función principal"""
    print_header()
    
    # 1. Verificar Python
    if not check_python_version():
        sys.exit(1)
    
    # 2. Crear directorios
    create_directories()
    
    # 3. Verificar/Instalar dependencias
    if not check_dependencies():
        response = input("\n¿Desea instalar las dependencias ahora? (s/n): ")
        if response.lower() == 's':
            if not install_dependencies():
                sys.exit(1)
        else:
            print("\n⚠️  Instala las dependencias manualmente:")
            print("   pip install -r requirements.txt\n")
            sys.exit(1)
    
    # 4. Crear archivo .env
    create_env_file()
    
    # 5. Inicializar base de datos
    if not initialize_database():
        response = input("\n¿Continuar sin base de datos? (s/n): ")
        if response.lower() != 's':
            sys.exit(1)
    
    # 6. Mostrar información
    show_api_info()
    show_test_commands()
    
    # 7. Preguntar si iniciar servidor
    response = input("\n¿Desea iniciar el servidor ahora? (s/n): ")
    if response.lower() == 's':
        start_server()
    else:
        print("\n💡 Para iniciar el servidor manualmente:")
        print("   python app.py")
        print("\n👋 ¡Hasta luego!\n")

if __name__ == "__main__":
    main()