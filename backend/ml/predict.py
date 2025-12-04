import pickle
from pathlib import Path
import numpy as np

BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "model.pkl"

class ContentRecommender:
    def __init__(self):
        with open(MODEL_PATH, "rb") as f:
            model = pickle.load(f)

        self.vectorizer = model["vectorizer"]
        self.similarity_matrix = model["similarity_matrix"]
        self.ids = model["ids"]
        self.df = model["dataframe"]

    def get_similar(self, destination_id, top_n=5):
        """
        Retorna destinos similares usando la matriz de similitud.
        """
        if destination_id not in self.ids:
            return []

        idx = self.ids.index(destination_id)
        scores = list(enumerate(self.similarity_matrix[idx]))
        scores = sorted(scores, key=lambda x: x[1], reverse=True)

        # excluir el mismo destino
        scores = scores[1 : top_n + 1]

        results = []
        for i, score in scores:
            row = self.df.iloc[i]
            results.append({
                "destination_id": int(row["id"]),
                "nombre": row["nombre"],
                "score": float(score),
                "categoria": row["categoria"],
                "imagen_url": row["imagen_url"]
            })

        return results

    def find_by_text(self, query, top_n=5):
        """
        Encuentra destinos similares a un texto (para el buscador tipo AI).
        """
        query_vec = self.vectorizer.transform([query])
        scores = np.dot(query_vec, self.similarity_matrix).flatten()

        best = scores.argsort()[::-1][:top_n]

        results = []
        for idx in best:
            row = self.df.iloc[idx]
            results.append({
                "destination_id": int(row["id"]),
                "nombre": row["nombre"],
                "score": float(scores[idx]),
                "categoria": row["categoria"],
                "imagen_url": row["imagen_url"]
            })

        return results
