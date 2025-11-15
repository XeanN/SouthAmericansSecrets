# 🌎 South Americans Secrets - Sistema Inteligente de Recomendación

**Desarrollo de un Sistema Inteligente de Recomendación y Automatización de Procesos Web Basado en Inteligencia Artificial**

---

## 📋 Descripción del Proyecto

Sistema modular inteligente que combina:
- **Motor de Recomendación** con Machine Learning
- **Automatización de Procesos Web**
- **API REST** con Flask
- **Autenticación JWT**
- **Base de datos SQLite**

### Características Principales

✅ **Recomendaciones Personalizadas con IA**
- Filtrado colaborativo
- Filtrado basado en contenido
- Sistema híbrido que combina múltiples algoritmos
- Aprendizaje continuo del comportamiento del usuario

✅ **Automatización de Tareas**
- Generación automática de itinerarios
- Envío de correos con recomendaciones
- Exportación de planes de viaje en PDF
- Generación de reportes de actividad

✅ **Panel de Usuario**
- Dashboard personalizado
- Historial de interacciones
- Gestión de favoritos
- Estadísticas de uso

---

## 🏗️ Arquitectura del Sistema

```
backend/
├── app.py                      # Aplicación Flask principal
├── config.py                   # Configuraciones
├── requirements.txt            # Dependencias
│
├── database/
│   ├── db.py                   # Gestión de BD
│   └── southamerican_secrets.db # SQLite (se crea automáticamente)
│
├── models/
│   ├── recommender.py          # Motor de IA
│   ├── user.py                 # Modelo de usuario
│   └── destination.py          # Modelo de destinos
│
├── routes/
│   ├── auth.py                 # Autenticación JWT
│   ├── recommendations.py      # API de recomendaciones
│   └── automation.py           # Tareas automatizadas
│
├── ml/
│   ├── models/                 # Modelos entrenados
│   ├── train_model.py          # Entrenamiento
│   └── predict.py              # Predicciones
│
└── utils/
    ├── email_sender.py         # Envío de correos
    └── pdf_generator.py        # Generación de PDFs
```

---

## 🚀 Instalación y Configuración

### Requisitos Previos

- Python 3.8 o superior
- pip (gestor de paquetes de Python)
- Git

### Paso 1: Clonar el Repositorio

```bash
git clone https://github.com/XeanN/SouthAmericansSecrets.git
cd SouthAmericansSecrets
```

### Paso 2: Crear Entorno Virtual

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

### Paso 3: Instalar Dependencias

```bash
pip install -r requirements.txt
```

### Paso 4: Configurar Variables de Entorno (Opcional)

Crear archivo `.env` en la raíz del proyecto:

```env
SECRET_KEY=tu_clave_secreta_aqui
JWT_SECRET_KEY=tu_jwt_secret_aqui

# Para envío de correos (opcional)
MAIL_USERNAME=tu_email@gmail.com
MAIL_PASSWORD=tu_app_password
```

**Nota:** Para usar Gmail:
1. Habilitar verificación en dos pasos
2. Generar contraseña de aplicación: https://myaccount.google.com/apppasswords

### Paso 5: Inicializar Base de Datos

```bash
python -c "from database.db import init_db; init_db()"
```

### Paso 6: Ejecutar el Servidor

```bash
python app.py
```

El servidor estará disponible en: `http://localhost:5000`

---

## 📡 Endpoints de la API

### Autenticación

#### Registro de Usuario
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "password123",
  "nombre": "Juan Pérez",
  "preferencias": {
    "categoria": "Naturaleza",
    "actividades": "trekking,fotografía"
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "password123"
}

Response:
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJ...",
  "user": {
    "id": 1,
    "email": "usuario@example.com",
    "nombre": "Juan Pérez"
  }
}
```

#### Obtener Perfil
```http
GET /api/auth/profile
Authorization: Bearer {token}
```

### Recomendaciones

#### Obtener Recomendaciones Personalizadas (IA)
```http
GET /api/recommendations/personalized?limit=10
Authorization: Bearer {token}

Response:
{
  "recommendations": [
    {
      "destination_id": 1,
      "nombre": "Machu Picchu",
      "pais": "Perú",
      "categoria": "Arqueología",
      "score": 0.85,
      "algorithm": "hybrid",
      "rating": 4.8,
      "precio_promedio": 150.0
    }
  ],
  "algorithms_used": ["collaborative", "content_based", "popularity"]
}
```

#### Destinos Similares
```http
GET /api/recommendations/similar/1?limit=5

Response:
{
  "current_destination": {
    "id": 1,
    "nombre": "Machu Picchu",
    "pais": "Perú"
  },
  "similar_destinations": [...]
}
```

#### Registrar Interacción
```http
POST /api/recommendations/track-interaction
Authorization: Bearer {token}
Content-Type: application/json

{
  "destination_id": 1,
  "interaction_type": "view",
  "rating": 5,
  "tiempo_visualizacion": 45,
  "clicked": 1,
  "favorito": 0
}
```

#### Gestionar Favoritos
```http
POST /api/recommendations/favorites/1
DELETE /api/recommendations/favorites/1
Authorization: Bearer {token}
```

### Automatización

#### Generar Itinerario Automáticamente
```http
POST /api/automation/generate-itinerary
Authorization: Bearer {token}
Content-Type: application/json

{
  "destination_ids": [1, 3, 7],
  "dias": 10,
  "presupuesto": 2000
}

Response:
{
  "itinerary": {
    "titulo": "Viaje por Perú, Brasil",
    "duracion_dias": 10,
    "costo_total_estimado": 1850.0,
    "destinos": [...]
  }
}
```

#### Exportar Itinerario a PDF
```http
POST /api/automation/export-itinerary-pdf
Authorization: Bearer {token}
Content-Type: application/json

{
  "itinerary": {...}
}

Response: archivo PDF descargable
```

#### Enviar Recomendaciones por Email
```http
POST /api/automation/send-recommendations-email
Authorization: Bearer {token}

Response:
{
  "message": "Email enviado exitosamente",
  "email": "usuario@example.com"
}
```

#### Generar Reporte de Usuario
```http
POST /api/automation/generate-report
Authorization: Bearer {token}

Response:
{
  "report": {
    "usuario": {...},
    "estadisticas": {
      "total_interacciones": 25,
      "destinos_explorados": 15,
      "favoritos": 5
    }
  }
}
```

---

## 🤖 Algoritmos de IA Implementados

### 1. Content-Based Filtering
Recomienda destinos similares basándose en:
- Categoría (arqueología, naturaleza, playa, etc.)
- Actividades disponibles
- Clima
- País

**Técnica:** TF-IDF + Similitud de Coseno

### 2. Collaborative Filtering
Recomienda basándose en usuarios con gustos similares:
- Analiza interacciones de usuarios
- Identifica patrones de comportamiento
- Sugiere destinos que gustaron a usuarios similares

### 3. Sistema Híbrido
Combina ambos algoritmos:
- 40% Content-Based (destinos similares)
- 40% Collaborative (preferencias de usuarios)
- 20% Popularity (destinos más valorados)

### 4. Popularity-Based (Fallback)
Para usuarios nuevos sin historial:
- Recomienda destinos mejor valorados
- Basado en ratings generales

---

## 📊 Base de Datos

### Tablas Principales

#### users
- `id`, `email`, `password_hash`, `nombre`
- `preferencias` (JSON)
- `created_at`, `last_login`

#### destinations
- `id`, `nombre`, `pais`, `categoria`
- `descripcion`, `precio_promedio`
- `actividades`, `clima`, `mejor_epoca`
- `rating`, `imagen_url`

#### user_interactions
- `user_id`, `destination_id`
- `interaction_type`, `rating`
- `tiempo_visualizacion`, `clicked`, `favorito`
- `timestamp`

#### recommendations
- `user_id`, `destination_id`
- `score`, `algorithm`
- `generated_at`, `viewed`

#### automated_tasks
- `user_id`, `task_type`, `status`
- `parameters`, `result`
- `created_at`, `executed_at`

---

## 🎨 Integración con Frontend

Copiar el archivo `frontend_example.js` a tu proyecto y usarlo así:

```javascript
// Inicializar API
const api = new SouthAmericansAPI();

// Login
await api.login('email@example.com', 'password');

// Obtener recomendaciones personalizadas
const recs = await api.getPersonalizedRecommendations(10);

// Mostrar recomendaciones
recs.recommendations.forEach(rec => {
    console.log(`${rec.nombre} - Score IA: ${rec.score}`);
});

// Generar itinerario
const itinerary = await api.generateItinerary([1, 3, 7], 10);

// Exportar a PDF
await api.exportItineraryPDF(itinerary.itinerary);
```

---

## 🧪 Pruebas

### Probar la API con cURL

```bash
# Registro
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","nombre":"Test User"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# Recomendaciones (reemplazar TOKEN)
curl http://localhost:5000/api/recommendations/personalized?limit=5 \
  -H "Authorization: Bearer TOKEN"
```

### Con Postman

1. Importar colección desde: [Postman Collection Link]
2. Configurar variable `base_url`: `http://localhost:5000/api`
3. Ejecutar los requests en orden

---

## 📈 Resultados Esperados

### Métricas del Sistema

- ✅ **Precisión del modelo:** >80% en recomendaciones
- ✅ **Tiempo de respuesta:** <500ms por request
- ✅ **Tasa de acierto:** 75-85% en recomendaciones personalizadas

### Funcionalidades Implementadas

- ✅ Motor de IA funcional con 3 algoritmos
- ✅ Autenticación JWT completa
- ✅ Base de datos con 10+ destinos reales
- ✅ Generación automática de itinerarios
- ✅ Exportación a PDF
- ✅ Sistema de tracking de interacciones
- ✅ Gestión de favoritos
- ✅ Envío de emails automatizado
- ✅ Generación de reportes

---

## 🔧 Solución de Problemas

### Error: "ModuleNotFoundError"
```bash
pip install -r requirements.txt
```

### Error: "Database locked"
```bash
# Reiniciar el servidor
python app.py
```

### Error: "CORS"
Verificar que `Flask-CORS` esté configurado en `app.py`

### Emails no se envían
- Configurar variables de entorno `MAIL_USERNAME` y `MAIL_PASSWORD`
- Verificar que sea una contraseña de aplicación de Gmail

---

## 📚 Bibliografía

- Géron, A. (2019). *Hands-On Machine Learning with Scikit-Learn and TensorFlow.* O'Reilly.
- Chollet, F. (2021). *Deep Learning with Python.* Manning.
- McKinney, W. (2022). *Python for Data Analysis.* O'Reilly.
- Documentación oficial de Flask: https://flask.palletsprojects.com/
- Documentación de Scikit-learn: https://scikit-learn.org/

---

## 👥 Autores

- Angel Jean Pierre Ponce Bonifacio - U24231257
- Maria de los Angeles Vera Quispe - U24231470
- Nicolas Michael Serrano Quispe - U24266808

**Docente:** Jose Antonio Espinal Teves  
**Asignatura:** Análisis y Diseño de Algoritmos  
**Universidad Tecnológica del Perú - 2025**

---

## 📝 Licencia

Este proyecto es parte de un trabajo académico para la Universidad Tecnológica del Perú.

---

## 🚀 Próximos Pasos

- [ ] Desplegar en Heroku/Railway
- [ ] Implementar cache con Redis
- [ ] Agregar más algoritmos de ML
- [ ] Implementar sistema de reviews
- [ ] Integración con APIs externas (Google Maps, Weather)
- [ ] Procesamiento de Lenguaje Natural (NLP)
- [ ] Chatbot con IA

---

**¡Sistema listo para presentar el domingo! 🎉**