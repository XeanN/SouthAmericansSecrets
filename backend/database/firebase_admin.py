# backend/database/firebase_admin.py
import firebase_admin
from firebase_admin import credentials, db
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
SERVICE_KEY_PATH = BASE_DIR / "serviceAccountKey.json"

def init_firebase():
    """
    Inicializa Firebase Admin SDK.
    """
    if not firebase_admin._apps:
        cred = credentials.Certificate(str(SERVICE_KEY_PATH))

        firebase_admin.initialize_app(cred, {
            "databaseURL": "https://secrets-74e91-default-rtdb.firebaseio.com/"
        })

    return db
