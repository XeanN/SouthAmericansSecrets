import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler

# IA de contenido
from ml.predict import ContentRecommender

# Cargar modelo IA
content_model = ContentRecommender()


class RecommendationEngine:
    """Motor de recomendación basado en IA + Filtrado Colaborativo + Popularidad."""

    def __init__(self):
        self.scaler = MinMaxScaler()
        self.destinations_df = None
        self.user_profiles = {}

    # ========================================================
    # 1) CARGA DEL CATÁLOGO DESDE JSON / FIREBASE / CSV
    # ========================================================
    def load_destinations(self, destinations):
        """
        Carga destinos desde JSON o Firebase.
        Asegura que todas las columnas necesarias existan.
        """

        df = pd.DataFrame(destinations)

        # id obligatorio
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
            "pais": "Perú",
            "clima": "",
            "precio_promedio": 0.0,
            "rating": 4.5
        }

        for col, default in required_cols.items():
            if col not in df.columns:
                df[col] = default

        df["precio_promedio"] = pd.to_numeric(df["precio_promedio"], errors="coerce").fillna(0)
        df["rating"] = pd.to_numeric(df["rating"], errors="coerce").fillna(4.5)

        self.destinations_df = df

        return self

    # ========================================================
    # 2) IA REAL (TF-IDF)
    # ========================================================
    def content_based_filtering(self, destination_id, n_recommendations=5):
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
            row = self.destinations_df[self.destinations_df["id"] == dest_id].iloc[0]

            category_score = favorite_categories.get(row["categoria"], 0)

            recs.append({
                "destination_id": int(dest_id),
                "nombre": row["nombre"],
                "pais": row["pais"],
                "categoria": row["categoria"],
                "score": float(category_score),
                "algorithm": "collaborative"
            })

        recs.sort(key=lambda x: x["score"], reverse=True)

        return recs[:n_recommendations]

    # ========================================================
    # 4) POPULARIDAD
    # ========================================================
    def popularity_based(self, n_recommendations=5):
        popular = self.destinations_df.nlargest(n_recommendations, "rating")

        results = []
        for _, row in popular.iterrows():
            results.append({
                "destination_id": int(row["id"]),
                "nombre": row["nombre"],
                "pais": row["pais"],
                "categoria": row["categoria"],
                "score": float(row["rating"] / 5.0),
                "algorithm": "popularity"
            })

        return results

    # ========================================================
    # 5) HÍBRIDO
    # ========================================================
    def hybrid_recommendation(self, user_id, interactions, current_destination_id=None, n_recommendations=10):

        results = []

        # IA de contenido (40%)
        if current_destination_id:
            content = self.content_based_filtering(current_destination_id, 4)
            for r in content:
                r["score"] *= 0.4
                results.append(r)

        # Filtrado colaborativo (40%)
        collab = self.collaborative_filtering(user_id, interactions, 4)
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
            dest_id = r["destination_id"]
            if dest_id not in seen:
                seen.add(dest_id)
                final.append(r)

        final.sort(key=lambda x: x["score"], reverse=True)

        return final[:n_recommendations]

    # ========================================================
    # 6) RECOMENDACIONES POR PREFERENCIAS MANUALES
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

        results = []

        for _, row in df.iterrows():
            results.append({
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

        return results
