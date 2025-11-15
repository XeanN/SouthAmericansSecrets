-- ===========================================
--  TABLA: Usuarios
-- ===========================================
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    preferencias TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================
--  TABLA: Destinos turísticos
-- ===========================================
CREATE TABLE IF NOT EXISTS destinations (
    id INTEGER PRIMARY KEY,
    nombre TEXT NOT NULL,
    pais TEXT NOT NULL,
    categoria TEXT NOT NULL,
    descripcion TEXT,
    actividades TEXT,
    precio_promedio REAL,
    mejor_epoca TEXT,
    clima TEXT,
    duracion_sugerida INTEGER,
    imagen_url TEXT,
    rating REAL DEFAULT 4.5
);

-- ===========================================
--  TABLA: Interacciones del usuario
-- ===========================================
CREATE TABLE IF NOT EXISTS user_interactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    destination_id INTEGER NOT NULL,
    interaction_type TEXT NOT NULL, -- click, view, favorite, rate
    rating INTEGER DEFAULT NULL,
    tiempo_visualizacion INTEGER DEFAULT 0,
    clicked INTEGER DEFAULT 0,
    favorito INTEGER DEFAULT 0,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (destination_id) REFERENCES destinations(id)
);

-- ===========================================
--  TABLA: Recomendaciones generadas
-- ===========================================
CREATE TABLE IF NOT EXISTS recommendations (
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

-- ===========================================
--  TABLA: Tareas automatizadas
-- ===========================================
CREATE TABLE IF NOT EXISTS automated_tasks (
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
