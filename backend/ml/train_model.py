import pandas as pd
import numpy as np
import pickle
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "model.pkl"

spanish_stopwords = [
    "de", "la", "el", "los", "las", "un", "una", "unos", "unas",
    "en", "y", "o", "para", "por", "con", "sobre", "sin", "al",
    "del", "que", "se", "a", "es", "no", "lo", "como", "más"
]


def train_content_model(csv_path):
    df = pd.read_csv(csv_path)

    # ✔ Crear ID automáticamente si no existe
    if "id" not in df.columns:
        df.insert(0, "id", range(1, len(df) + 1))

    # Crear un campo combinado para embeddings
    df["combined"] = (
        df["categoria"].fillna("") + " " +
        df["descripcion"].fillna("") + " " +
        df["actividades"].fillna("") + " " +
        df["clima"].fillna("")
    )

    # TF-IDF
    vectorizer = TfidfVectorizer(stop_words=spanish_stopwords)
    tfidf_matrix = vectorizer.fit_transform(df["combined"])

    # Similaridad
    similarity_matrix = cosine_similarity(tfidf_matrix, tfidf_matrix)

    # Guardamos el modelo
    model = {
        "vectorizer": vectorizer,
        "similarity_matrix": similarity_matrix,
        "ids": df["id"].tolist(),
        "dataframe": df
    }

    with open(MODEL_PATH, "wb") as f:
        pickle.dump(model, f)

    print("✅ Modelo de contenido entrenado y guardado en:", MODEL_PATH)


if __name__ == "__main__":
    csv_path = BASE_DIR.parent / "data" / "destinations.csv"
    train_content_model(csv_path)
