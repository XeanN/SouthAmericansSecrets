import sqlite3
import os
from pathlib import Path

DB_PATH = Path(__file__).resolve().parent / "database.db"

# ==========================
#   CONEXIÓN A BASE DE DATOS
# ==========================
def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

# =======================================
#   EJECUTAR QUERIES (unificados)
# =======================================
def execute_query(query, params=(), fetch=None):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute(query, params)

    if fetch == "one":
        row = cursor.fetchone()
        conn.close()
        return dict(row) if row else None

    if fetch == "all":
        rows = cursor.fetchall()
        conn.close()
        return [dict(r) for r in rows]

    conn.commit()
    conn.close()
    return None

# =======================================
#      CREAR BD Y TABLAS INICIALES
# =======================================
def init_db():
    print("🛠 Creando estructura de base de datos...")

    if DB_PATH.exists():
        print("✓ Base de datos ya existe")
        return

    conn = get_db()
    cursor = conn.cursor()

    cursor.executescript("""

    -- TABLA DE USUARIOS
    CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        preferencias TEXT,
        last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- TABLA DE DESTINOS
        CREATE TABLE destinations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        pais TEXT,
        region TEXT,
        categoria TEXT,
        descripcion TEXT,
        precio_promedio REAL,
        rating REAL DEFAULT 4.5,
        latitud REAL,
        longitud REAL,
        url TEXT NOT NULL,
        imagen TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- TABLA DE INTERACCIONES
    CREATE TABLE user_interactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        destination_id INTEGER NOT NULL,
        interaction_type TEXT NOT NULL,
        rating INTEGER DEFAULT NULL,
        tiempo_visualizacion INTEGER DEFAULT 0,
        clicked INTEGER DEFAULT 0,
        favorito INTEGER DEFAULT 0,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (destination_id) REFERENCES destinations(id)
    );

    -- TABLA DE RECOMENDACIONES
    CREATE TABLE recommendations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        destination_id INTEGER NOT NULL,
        score REAL,
        algorithm TEXT,
        viewed INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (destination_id) REFERENCES destinations(id)
    );

    -- TABLA DE TAREAS AUTOMATIZADAS
    CREATE TABLE automated_tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        task_type TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        parameters TEXT,
        result TEXT,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
    );

    """)

    conn.commit()
    conn.close()

    print("✓ Base de datos creada correctamente")
    load_initial_destinations()

# =======================================
#   CARGAR DESTINOS DESDE CSV
# =======================================
def load_initial_destinations():
    import csv
    csv_path = Path("data/destinations.csv")

    if not csv_path.exists():
        print("⚠️ No se encontró data/destinations.csv")
        return

    conn = get_db()
    cursor = conn.cursor()

    with open(csv_path, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            cursor.execute("""
                INSERT INTO destinations
                (nombre, pais, categoria, descripcion, actividades,
                 precio_promedio, mejor_epoca, clima, duracion_sugerida, imagen_url, rating)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                row.get("nombre") or row.get("title"),
                row.get("pais") or row.get("country"),
                row.get("categoria") or row.get("category"),
                row.get("descripcion") or "",
                row.get("actividades") or "",
                float(row.get("precio_promedio") or row.get("price") or 0),
                row.get("mejor_epoca") or "",
                row.get("clima") or "",
                int(row.get("duracion_sugerida") or 3),
                row.get("imagen_url") or row.get("image") or "",
                float(row.get("rating") or 4.5)
            ))

    conn.commit()
    conn.close()
    print("✓ Destinos iniciales importados")

# =======================================
#   FUNCIONES PARA ROUTES
# =======================================
def get_all_destinations():
    return execute_query("SELECT * FROM destinations", fetch="all")

def get_destination_by_id(dest_id):
    return execute_query(
        "SELECT * FROM destinations WHERE id = ?",
        (dest_id,),
        fetch="one"
    )

def insert_user_interaction(user_id, destination_id, interaction_type,
                            rating=None, tiempo_visualizacion=None,
                            clicked=0, favorito=0):

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO user_interactions
        (user_id, destination_id, interaction_type, rating,
         tiempo_visualizacion, clicked, favorito)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        user_id, destination_id, interaction_type,
        rating, tiempo_visualizacion, clicked, favorito
    ))

    conn.commit()
    interaction_id = cursor.lastrowid
    conn.close()
    return interaction_id

def get_user_interactions(user_id):
    return execute_query(
        "SELECT * FROM user_interactions WHERE user_id = ? ORDER BY timestamp DESC",
        (user_id,),
        fetch="all"
    )
