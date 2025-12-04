# ============================================================
#   CARGA UNIFICADA DEL CATÁLOGO DE TOURS (JSON OFICIAL)
# ============================================================

import json
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
TOURS_JSON = DATA_DIR / "tours.json"


def load_tours_json():
    """
    Carga el archivo tours.json desde /backend/data.
    Si falla, devuelve lista vacía.
    """
    try:
        if not TOURS_JSON.exists():
            print(f"⚠️ tours.json no encontrado en: {TOURS_JSON}")
            return []

        with open(TOURS_JSON, "r", encoding="utf-8") as f:
            data = json.load(f)

        if "tours" not in data:
            print("⚠️ tours.json no contiene la clave 'tours'")
            return []

        return data["tours"]

    except Exception as e:
        print(f"❌ Error cargando tours.json: {e}")
        return []
