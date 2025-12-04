import sqlite3
import re
from pathlib import Path

DB_PATH = Path(__file__).resolve().parents[1] / "database" / "database.db"

conn = sqlite3.connect(DB_PATH)
conn.row_factory = sqlite3.Row
cur = conn.cursor()

def to_slug(name):
    """Convierte 'Paracas National Reserve' → 'ParacasNationalReserve'."""
    text = re.sub(r'[^a-zA-Z0-9 ]', '', name)
    return text.title().replace(" ", "")

CATEGORY_MAP = {
    "Paracas y Islas Ballestas": "tour/Coast-of-Peru/Paracas-y-Islas-Ballestas/",
    "Ica y Huacachina":          "tour/Coast-of-Peru/Ica-y-Huacachina/",
    "Lima":                      "tour/Coast-of-Peru/Lima/",
    "Líneas de Nazca":           "tour/Coast-of-Peru/Nazca-Lines/",
    "Costa Norte":               "tour/Coast-of-Peru/North-Coast/",
    "Arequipa":                  "tour/The-Highlands/Arequipa/",
    "Cuzco":                     "tour/The-Highlands/Cuzco/",
    "Lake Titicaca":             "tour/The-Highlands/Lake-Titicaca/",
    "Manu Reserve":              "tour/Rainforest/Manu-Reserve/",
    "Tambopata Rainforest":      "tour/Rainforest/Tambopata-Rainforest/"
}

cur.execute("SELECT id, nombre, categoria FROM destinations")
rows = cur.fetchall()

print("\n📌 Generando rutas HTML…\n")

for row in rows:
    tid = row["id"]
    name = row["nombre"]
    cat  = row["categoria"]

    folder = CATEGORY_MAP.get(cat)
    if not folder:
        print(f"⚠ Sin carpeta para categoría: {cat} ({name})")
        continue

    slug = to_slug(name)
    filename = f"tour{slug}.html"

    html_path = folder + filename

    cur.execute("""
        UPDATE destinations
        SET html_path = ?
        WHERE id = ?
    """, (html_path, tid))

    print(f"✔ {name} → {html_path}")

conn.commit()
conn.close()

print("\n🎉 COMPLETADO: todas las rutas HTML fueron generadas.")
