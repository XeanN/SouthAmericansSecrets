# backend/database/firebase_admin.py

import os
import json
import firebase_admin
from firebase_admin import credentials, db

def init_firebase():
    """
    Inicializa Firebase Admin usando la variable de entorno
    GOOGLE_APPLICATION_CREDENTIALS_JSON
    """
    if firebase_admin._apps:
        return firebase_admin.get_app()

    # Leer JSON desde variable de entorno
    json_str = os.getenv("GOOGLE_APPLICATION_CREDENTIALS_JSON")

    if not json_str:
        raise RuntimeError("ERROR: GOOGLE_APPLICATION_CREDENTIALS_JSON NO ESTÁ DEFINIDO")

    # Convertir string → diccionario
    service_account_info = json.loads(json_str)

    # Crear credenciales desde dict
    cred = credentials.Certificate(service_account_info)

    firebase_admin.initialize_app(cred, {
        "databaseURL": "https://secrets-74e91-default-rtdb.firebaseio.com/"
    })

    return db
