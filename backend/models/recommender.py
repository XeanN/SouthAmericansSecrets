import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
from datetime import datetime

# ▼ IA de contenido (nuestro modelo entrenado con TF-IDF + cosine)
from ml.predict import ContentRecommender

# Cargar modelo IA una sola vez
content_model = ContentRecommender()


class RecommendationEngine:
    """Motor de recomendación profesional basado en IA + filtrado colaborativo + popularidad."""

    def __init__(self):
        self.scaler = MinMaxScaler()
        self.destinations_df = None
        self.user_profiles = {}

    # ========================================================
    # 1) CARGA DEL CATÁLOGO (CSV o Firebase)
    # ========================================================
    def load_destinations(self, destinations):
        """
        Carga destinos desde SQLite y garantiza que todas las columnas
        necesarias existan sin destruir el 'id'.
        """

        df = pd.DataFrame(destinations)

        # Asegurar id numérico real
        if "id" not in df.columns:
            raise ValueError("La tabla 'destinations' debe incluir columna 'id' AUTOINCREMENT.")

        df["id"] = pd.to_numeric(df["id"], errors="coerce")
        df = df.dropna(subset=["id"])
        df["id"] = df["id"].astype(int)

        required_cols = {
            "nombre": "",
            "categoria": "",
            "actividades": "",
            "descripcion": "",
            "pais": "",
            "clima": "",
            "precio_promedio": 0.0,
            "rating": 4.5,
        }

        for col, default in required_cols.items():
            if col not in df.columns:
                df[col] = default

        df["precio_promedio"] = pd.to_numeric(df["precio_promedio"], errors="coerce").fillna(0)
        df["rating"] = pd.to_numeric(df["rating"], errors="coerce").fillna(4.5)

        self.destinations_df = df

        return self


    # ========================================================
    # 2) IA REAL (TF-IDF + Cosine Similarity)
    # ========================================================
    def content_based_filtering(self, destination_id, n_recommendations=5):
        """Usa el modelo IA entrenado para devolver destinos similares."""
        try:
            results = content_model.get_similar(destination_id, n_recommendations)

            for r in results:
                r["algorithm"] = "content_based"

            return results

        except Exception as e:
            print("⚠ Error en content_based_filtering:", e)
            return []

    # ========================================================
    # 3) FILTRADO COLABORATIVO
    # ========================================================
    def collaborative_filtering(self, user_id, user_interactions, n_recommendations=5):

        if not user_interactions:
            return self.popularity_based(n_recommendations)

        df = pd.DataFrame(user_interactions)

        user_prefs = df[df["user_id"] == user_id].copy()
        if len(user_prefs) == 0:
            return self.popularity_based(n_recommendations)

        user_prefs["score"] = (
            user_prefs["rating"].fillna(3) * 0.5 +
            user_prefs["clicked"] * 2 +
            user_prefs["favorito"] * 3
        )

        visited = set(user_prefs["destination_id"].values)
        all_destinations = set(self.destinations_df["id"].values)
        unvisited = list(all_destinations - visited)

        favorite_categories = (
            user_prefs.groupby("categoria")["score"]
            .mean()
            .sort_values(ascending=False)
        )

        recs = []

        for dest_id in unvisited[: n_recommendations * 2]:
            dest = self.destinations_df[self.destinations_df["id"] == dest_id].iloc[0]

            category_score = favorite_categories.get(dest["categoria"], 0)

            recs.append({
                "destination_id": int(dest_id),
                "nombre": dest["nombre"],
                "pais": dest["pais"],
                "categoria": dest["categoria"],
                "score": float(category_score),
                "algorithm": "collaborative"
            })

        recs.sort(key=lambda x: x["score"], reverse=True)

        return recs[:n_recommendations]

    # ========================================================
    # 4) HÍBRIDO (IA + colaborativo + popularidad)
    # ========================================================
    def hybrid_recommendation(self, user_id, user_interactions, current_destination_id=None, n_recommendations=10):

        results = []

        # IA de contenido (40%)
        if current_destination_id:
            content = self.content_based_filtering(current_destination_id, 4)
            for r in content:
                r["score"] *= 0.4
                results.append(r)

        # Colaborativo (40%)
        collab = self.collaborative_filtering(user_id, user_interactions, 4)
        for r in collab:
            r["score"] *= 0.4
            results.append(r)

        # Popularidad (20%)
        popular = self.popularity_based(2)
        for r in popular:
            r["score"] *= 0.2
            results.append(r)

        # Quitar duplicados
        seen = set()
        final = []
        for r in results:
            if r["destination_id"] not in seen:
                seen.add(r["destination_id"])
                final.append(r)

        final.sort(key=lambda x: x["score"], reverse=True)

        return final[:n_recommendations]

    # ========================================================
    # 5) POPULARIDAD
    # ========================================================
    def popularity_based(self, n_recommendations=5):

        popular = self.destinations_df.nlargest(n_recommendations, "rating")

        out = []
        for _, row in popular.iterrows():
            out.append({
                "destination_id": int(row["id"]),
                "nombre": row["nombre"],
                "pais": row["pais"],
                "categoria": row["categoria"],
                "score": float(row["rating"] / 5.0),
                "algorithm": "popularity"
            })

        return out

    # ========================================================
    # 6) RECOMENDACIONES PERSONALIZADAS
    # ========================================================
    def get_personalized_recommendations(self, user_id, user_interactions, user_preferences=None, n_recommendations=10):

        if self.destinations_df is None:
            raise ValueError("Debe cargar destinos primero.")

        if not user_interactions:
            return self.popularity_based(n_recommendations)

        return self.hybrid_recommendation(
            user_id,
            user_interactions,
            n_recommendations=n_recommendations
        )

    # ========================================================
    # 7) FILTRO POR PREFERENCIAS MANUALES
    # ========================================================
    def get_similar_destinations(self, preferences, n_recommendations=5):

        if self.destinations_df is None:
            return []

        df = self.destinations_df.copy()

        if "categoria" in preferences and preferences["categoria"]:
            df = df[df["categoria"].str.contains(preferences["categoria"], case=False, na=False)]

        if "actividades" in preferences and preferences["actividades"]:
            df = df[df["actividades"].str.contains(preferences["actividades"], case=False, na=False)]

        if "precio_max" in preferences:
            df = df[df["precio_promedio"] <= preferences["precio_max"]]

        df = df.nlargest(n_recommendations, "rating")

        out = []
        for _, row in df.iterrows():
            out.append({
                "destination_id": int(row["id"]),
                "nombre": row["nombre"],
                "pais": row["pais"],
                "categoria": row["categoria"],
                "descripcion": row["descripcion"],
                "precio_promedio": float(row["precio_promedio"]),
                "rating": float(row["rating"]),
                "score": float(row["rating"] / 5.0),
                "algorithm": "preference_based"
            })

        return out
