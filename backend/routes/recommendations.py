from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.recommender import RecommendationEngine
from database.db import (
    execute_query, 
    get_all_destinations, 
    insert_user_interaction,
    get_user_interactions
)
import json
from datetime import datetime

recommendations_bp = Blueprint('recommendations', __name__)

# Inicializar el motor de recomendación
recommender = RecommendationEngine()

def initialize_recommender():
    """Inicializar el motor con datos de destinos"""
    global recommender
    try:
        destinations = get_all_destinations()
        if destinations:
            recommender.load_destinations(destinations)
            print(f"Motor de IA cargado con {len(destinations)} destinos")
    except Exception as e:
        print(f"Error al inicializar recomendador: {e}")

# Inicializar al cargar el blueprint
initialize_recommender()

@recommendations_bp.route('/personalized', methods=['GET'])
@jwt_required()
def get_personalized_recommendations():
    """Obtener recomendaciones personalizadas basadas en IA"""
    try:
        user_id = get_jwt_identity()
        n_recommendations = int(request.args.get('limit', 10))
        
        # Obtener interacciones del usuario
        interactions = get_user_interactions(user_id)
        
        # Obtener preferencias del usuario
        user = execute_query(
            'SELECT preferencias FROM users WHERE id = ?',
            (user_id,),
            fetch='one'
        )
        
        preferences = json.loads(user['preferencias']) if user and user['preferencias'] else None
        
        # Generar recomendaciones con IA
        recommendations = recommender.get_personalized_recommendations(
            user_id=user_id,
            user_interactions=interactions,
            user_preferences=preferences,
            n_recommendations=n_recommendations
        )
        
        # Enriquecer con información completa del destino
        enriched_recommendations = []
        for rec in recommendations:
            dest = execute_query(
                'SELECT * FROM destinations WHERE id = ?',
                (rec['destination_id'],),
                fetch='one'
            )
            if dest:
                enriched_recommendations.append({
                    **rec,
                    'descripcion': dest['descripcion'],
                    'precio_promedio': dest['precio_promedio'],
                    'actividades': dest['actividades'],
                    'clima': dest['clima'],
                    'mejor_epoca': dest['mejor_epoca'],
                    'duracion_sugerida': dest['duracion_sugerida'],
                    'imagen_url': dest['imagen_url'],
                    'rating': dest['rating']
                })
        
        # Guardar recomendaciones generadas
        for rec in recommendations:
            execute_query(
                '''INSERT INTO recommendations 
                   (user_id, destination_id, score, algorithm)
                   VALUES (?, ?, ?, ?)''',
                (user_id, rec['destination_id'], rec['score'], rec['algorithm']),
                fetch=None
            )
        
        return jsonify({
            'recommendations': enriched_recommendations,
            'total': len(enriched_recommendations),
            'algorithms_used': list(set([r['algorithm'] for r in recommendations]))
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@recommendations_bp.route('/similar/<int:destination_id>', methods=['GET'])
def get_similar_destinations(destination_id):
    """Obtener destinos similares (content-based filtering)"""
    try:
        n_recommendations = int(request.args.get('limit', 5))
        
        # Verificar que el destino existe
        destination = execute_query(
            'SELECT * FROM destinations WHERE id = ?',
            (destination_id,),
            fetch='one'
        )
        
        if not destination:
            return jsonify({'error': 'Destino no encontrado'}), 404
        
        # Obtener recomendaciones similares
        recommendations = recommender.content_based_filtering(
            destination_id,
            n_recommendations=n_recommendations
        )
        
        # Enriquecer con información completa
        enriched = []
        for rec in recommendations:
            dest = execute_query(
                'SELECT * FROM destinations WHERE id = ?',
                (rec['destination_id'],),
                fetch='one'
            )
            if dest:
                enriched.append({
                    **rec,
                    'descripcion': dest['descripcion'],
                    'precio_promedio': dest['precio_promedio'],
                    'imagen_url': dest['imagen_url'],
                    'rating': dest['rating']
                })
        
        return jsonify({
            'current_destination': {
                'id': destination['id'],
                'nombre': destination['nombre'],
                'pais': destination['pais']
            },
            'similar_destinations': enriched,
            'total': len(enriched)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@recommendations_bp.route('/by-preferences', methods=['POST'])
@jwt_required()
def get_by_preferences():
    """Obtener recomendaciones basadas en preferencias específicas"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        n_recommendations = data.get('limit', 5)
        
        # Obtener recomendaciones basadas en preferencias
        recommendations = recommender.get_similar_destinations(
            preferences=data,
            n_recommendations=n_recommendations
        )
        
        return jsonify({
            'recommendations': recommendations,
            'total': len(recommendations),
            'preferences_used': data
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@recommendations_bp.route('/track-interaction', methods=['POST'])
@jwt_required()
def track_interaction():
    """Registrar interacción del usuario con un destino"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        if not data or not data.get('destination_id') or not data.get('interaction_type'):
            return jsonify({'error': 'destination_id e interaction_type son requeridos'}), 400
        
        # Registrar interacción
        interaction_id = insert_user_interaction(
            user_id=user_id,
            destination_id=data['destination_id'],
            interaction_type=data['interaction_type'],
            rating=data.get('rating'),
            tiempo_visualizacion=data.get('tiempo_visualizacion'),
            clicked=data.get('clicked', 0),
            favorito=data.get('favorito', 0)
        )
        
        return jsonify({
            'message': 'Interacción registrada',
            'interaction_id': interaction_id
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@recommendations_bp.route('/favorites', methods=['GET'])
@jwt_required()
def get_favorites():
    """Obtener destinos favoritos del usuario"""
    try:
        user_id = get_jwt_identity()
        
        favorites = execute_query(
            '''SELECT d.*, ui.timestamp as added_at
               FROM user_interactions ui
               JOIN destinations d ON ui.destination_id = d.id
               WHERE ui.user_id = ? AND ui.favorito = 1
               ORDER BY ui.timestamp DESC''',
            (user_id,)
        )
        
        return jsonify({
            'favorites': favorites,
            'total': len(favorites)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@recommendations_bp.route('/favorites/<int:destination_id>', methods=['POST', 'DELETE'])
@jwt_required()
def manage_favorite(destination_id):
    """Agregar o quitar de favoritos"""
    try:
        user_id = get_jwt_identity()
        
        if request.method == 'POST':
            # Agregar a favoritos
            insert_user_interaction(
                user_id=user_id,
                destination_id=destination_id,
                interaction_type='favorite',
                favorito=1
            )
            message = 'Agregado a favoritos'
        else:
            # Quitar de favoritos
            execute_query(
                '''UPDATE user_interactions 
                   SET favorito = 0 
                   WHERE user_id = ? AND destination_id = ?''',
                (user_id, destination_id),
                fetch=None
            )
            message = 'Quitado de favoritos'
        
        return jsonify({'message': message}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@recommendations_bp.route('/destinations', methods=['GET'])
def get_destinations():
    """Obtener todos los destinos disponibles"""
    try:
        categoria = request.args.get('categoria')
        pais = request.args.get('pais')
        precio_max = request.args.get('precio_max')
        
        query = 'SELECT * FROM destinations WHERE 1=1'
        params = []
        
        if categoria:
            query += ' AND categoria = ?'
            params.append(categoria)
        
        if pais:
            query += ' AND pais = ?'
            params.append(pais)
        
        if precio_max:
            query += ' AND precio_promedio <= ?'
            params.append(float(precio_max))
        
        query += ' ORDER BY rating DESC'
        
        destinations = execute_query(query, tuple(params) if params else None)
        
        return jsonify({
            'destinations': destinations,
            'total': len(destinations)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@recommendations_bp.route('/destinations/<int:destination_id>', methods=['GET'])
def get_destination_detail(destination_id):
    """Obtener detalles de un destino específico"""
    try:
        destination = execute_query(
            'SELECT * FROM destinations WHERE id = ?',
            (destination_id,),
            fetch='one'
        )
        
        if not destination:
            return jsonify({'error': 'Destino no encontrado'}), 404
        
        return jsonify(destination), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@recommendations_bp.route('/popular', methods=['GET'])
def get_popular_destinations():
    """Obtener destinos más populares"""
    try:
        n_results = int(request.args.get('limit', 10))
        
        recommendations = recommender.popularity_based(n_recommendations=n_results)
        
        # Enriquecer con información completa
        enriched = []
        for rec in recommendations:
            dest = execute_query(
                'SELECT * FROM destinations WHERE id = ?',
                (rec['destination_id'],),
                fetch='one'
            )
            if dest:
                enriched.append({
                    **rec,
                    'descripcion': dest['descripcion'],
                    'precio_promedio': dest['precio_promedio'],
                    'imagen_url': dest['imagen_url']
                })
        
        return jsonify({
            'popular_destinations': enriched,
            'total': len(enriched)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500