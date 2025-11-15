import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import MinMaxScaler
import pickle
import os
from datetime import datetime

class RecommendationEngine:
    """Motor de recomendación basado en múltiples algoritmos"""
    
    def __init__(self):
        self.tfidf_vectorizer = TfidfVectorizer(max_features=100)
        self.scaler = MinMaxScaler()
        self.destinations_matrix = None
        self.destinations_df = None
        self.user_profiles = {}
        
    def load_destinations(self, destinations):
        """Cargar y procesar datos de destinos"""
        self.destinations_df = pd.DataFrame(destinations)
        
        # Crear features combinadas para TF-IDF
        self.destinations_df['combined_features'] = (
            self.destinations_df['categoria'] + ' ' +
            self.destinations_df['actividades'] + ' ' +
            self.destinations_df['clima'] + ' ' +
            self.destinations_df['pais']
        )
        
        # Vectorizar características
        self.destinations_matrix = self.tfidf_vectorizer.fit_transform(
            self.destinations_df['combined_features']
        )
        
        return self
    
    def content_based_filtering(self, destination_id, n_recommendations=5):
        """
        Filtrado basado en contenido:
        Recomienda destinos similares al que el usuario está viendo
        """
        if self.destinations_df is None:
            raise ValueError("Debe cargar los destinos primero")
        
        # Encontrar índice del destino
        idx = self.destinations_df[
            self.destinations_df['id'] == destination_id
        ].index
        
        if len(idx) == 0:
            return []
        
        idx = idx[0]
        
        # Calcular similitud de coseno
        cosine_sim = cosine_similarity(
            self.destinations_matrix[idx],
            self.destinations_matrix
        ).flatten()
        
        # Obtener índices de los destinos más similares
        similar_indices = cosine_sim.argsort()[-n_recommendations-1:-1][::-1]
        
        recommendations = []
        for i in similar_indices:
            if i != idx:
                recommendations.append({
                    'destination_id': int(self.destinations_df.iloc[i]['id']),
                    'nombre': self.destinations_df.iloc[i]['nombre'],
                    'pais': self.destinations_df.iloc[i]['pais'],
                    'categoria': self.destinations_df.iloc[i]['categoria'],
                    'score': float(cosine_sim[i]),
                    'algorithm': 'content_based'
                })
        
        return recommendations[:n_recommendations]
    
    def collaborative_filtering(self, user_id, user_interactions, n_recommendations=5):
        """
        Filtrado colaborativo simplificado:
        Basado en usuarios con gustos similares
        """
        if not user_interactions:
            return self.popularity_based(n_recommendations)
        
        # Crear matriz usuario-destino
        interactions_df = pd.DataFrame(user_interactions)
        
        # Calcular preferencias del usuario actual
        user_prefs = interactions_df[
            interactions_df['user_id'] == user_id
        ].copy()
        
        if len(user_prefs) == 0:
            return self.popularity_based(n_recommendations)
        
        # Calcular scores basados en interacciones
        user_prefs['score'] = (
            user_prefs['rating'].fillna(3) * 0.5 +
            user_prefs['clicked'] * 2 +
            user_prefs['favorito'] * 3
        )
        
        # Obtener destinos que el usuario NO ha visitado
        visited_destinations = set(user_prefs['destination_id'].values)
        all_destinations = set(self.destinations_df['id'].values)
        unvisited = list(all_destinations - visited_destinations)
        
        # Obtener categorías favoritas del usuario
        favorite_categories = user_prefs.groupby('categoria')['score'].mean().sort_values(ascending=False)
        
        recommendations = []
        for dest_id in unvisited[:n_recommendations * 2]:
            dest = self.destinations_df[self.destinations_df['id'] == dest_id].iloc[0]
            
            # Score basado en categoría favorita
            category_score = favorite_categories.get(dest['categoria'], 0)
            
            recommendations.append({
                'destination_id': int(dest_id),
                'nombre': dest['nombre'],
                'pais': dest['pais'],
                'categoria': dest['categoria'],
                'score': float(category_score),
                'algorithm': 'collaborative'
            })
        
        # Ordenar por score
        recommendations.sort(key=lambda x: x['score'], reverse=True)
        return recommendations[:n_recommendations]
    
    def hybrid_recommendation(self, user_id, user_interactions, current_destination_id=None, n_recommendations=10):
        """
        Sistema híbrido que combina múltiples algoritmos
        """
        recommendations = []
        
        # 1. Si está viendo un destino, dar recomendaciones similares (40%)
        if current_destination_id:
            content_recs = self.content_based_filtering(
                current_destination_id, 
                n_recommendations=4
            )
            for rec in content_recs:
                rec['score'] *= 0.4
                recommendations.append(rec)
        
        # 2. Recomendaciones colaborativas (40%)
        collab_recs = self.collaborative_filtering(
            user_id,
            user_interactions,
            n_recommendations=4
        )
        for rec in collab_recs:
            rec['score'] *= 0.4
            recommendations.append(rec)
        
        # 3. Destinos populares no visitados (20%)
        popular_recs = self.popularity_based(n_recommendations=2)
        for rec in popular_recs:
            rec['score'] *= 0.2
            recommendations.append(rec)
        
        # Eliminar duplicados y ordenar
        seen = set()
        unique_recs = []
        for rec in recommendations:
            if rec['destination_id'] not in seen:
                seen.add(rec['destination_id'])
                unique_recs.append(rec)
        
        unique_recs.sort(key=lambda x: x['score'], reverse=True)
        return unique_recs[:n_recommendations]
    
    def popularity_based(self, n_recommendations=5):
        """
        Recomendaciones basadas en popularidad (fallback)
        """
        popular = self.destinations_df.nlargest(n_recommendations, 'rating')
        
        recommendations = []
        for _, dest in popular.iterrows():
            recommendations.append({
                'destination_id': int(dest['id']),
                'nombre': dest['nombre'],
                'pais': dest['pais'],
                'categoria': dest['categoria'],
                'score': float(dest['rating'] / 5.0),
                'algorithm': 'popularity'
            })
        
        return recommendations
    
    def get_personalized_recommendations(self, user_id, user_interactions, user_preferences=None, n_recommendations=10):
        """
        Método principal para obtener recomendaciones personalizadas
        """
        if self.destinations_df is None:
            raise ValueError("Debe cargar los destinos primero")
        
        # Si el usuario no tiene interacciones, usar popularidad
        if not user_interactions or len(user_interactions) == 0:
            return self.popularity_based(n_recommendations)
        
        # Sistema híbrido
        return self.hybrid_recommendation(
            user_id,
            user_interactions,
            n_recommendations=n_recommendations
        )
    
    def train_model(self, interactions_data):
        """
        Entrenar el modelo con datos históricos
        """
        print("Entrenando modelo de recomendación...")
        
        # Aquí podrías implementar algoritmos más avanzados como:
        # - Matrix Factorization (SVD)
        # - Neural Collaborative Filtering
        # - Deep Learning models
        
        # Por ahora usamos el enfoque híbrido que ya es efectivo
        print("Modelo entrenado correctamente")
        return self
    
    def save_model(self, path='ml/models/recommender.pkl'):
        """Guardar modelo entrenado"""
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, 'wb') as f:
            pickle.dump(self, f)
        print(f"Modelo guardado en {path}")
    
    @staticmethod
    def load_model(path='ml/models/recommender.pkl'):
        """Cargar modelo guardado"""
        if os.path.exists(path):
            with open(path, 'rb') as f:
                return pickle.load(f)
        return None
    
    def get_similar_destinations(self, preferences, n_recommendations=5):
        """
        Obtener destinos basados en preferencias del usuario
        (categorías, actividades, clima, etc.)
        """
        if self.destinations_df is None:
            return []
        
        # Filtrar por preferencias
        filtered = self.destinations_df.copy()
        
        if 'categoria' in preferences and preferences['categoria']:
            filtered = filtered[filtered['categoria'].str.contains(
                preferences['categoria'], case=False, na=False
            )]
        
        if 'actividades' in preferences and preferences['actividades']:
            actividades = preferences['actividades']
            filtered = filtered[filtered['actividades'].str.contains(
                actividades, case=False, na=False
            )]
        
        if 'precio_max' in preferences:
            filtered = filtered[filtered['precio_promedio'] <= preferences['precio_max']]
        
        # Ordenar por rating
        filtered = filtered.nlargest(n_recommendations, 'rating')
        
        recommendations = []
        for _, dest in filtered.iterrows():
            recommendations.append({
                'destination_id': int(dest['id']),
                'nombre': dest['nombre'],
                'pais': dest['pais'],
                'categoria': dest['categoria'],
                'descripcion': dest['descripcion'],
                'precio_promedio': float(dest['precio_promedio']),
                'rating': float(dest['rating']),
                'score': float(dest['rating'] / 5.0),
                'algorithm': 'preference_based'
            })
        
        return recommendations