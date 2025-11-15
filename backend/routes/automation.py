from flask import Blueprint, request, jsonify, send_file
from flask_jwt_extended import jwt_required, get_jwt_identity
from database.db import execute_query
from utils.email_sender import send_recommendation_email
from utils.pdf_generator import generate_itinerary_pdf
import json
from datetime import datetime
import os

automation_bp = Blueprint('automation', __name__)

@automation_bp.route('/generate-itinerary', methods=['POST'])
@jwt_required()
def generate_itinerary():
    """Generar itinerario personalizado automáticamente"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        if not data or not data.get('destination_ids'):
            return jsonify({'error': 'destination_ids es requerido'}), 400
        
        destination_ids = data['destination_ids']
        dias = data.get('dias', 7)
        presupuesto = data.get('presupuesto')
        
        # Obtener información de los destinos
        destinations = []
        for dest_id in destination_ids:
            dest = execute_query(
                'SELECT * FROM destinations WHERE id = ?',
                (dest_id,),
                fetch='one'
            )
            if dest:
                destinations.append(dest)
        
        if not destinations:
            return jsonify({'error': 'No se encontraron destinos válidos'}), 404
        
        # Generar itinerario automatizado
        itinerary = {
            'titulo': f"Viaje por {', '.join([d['pais'] for d in destinations])}",
            'duracion_dias': dias,
            'presupuesto_estimado': presupuesto,
            'destinos': [],
            'generado_en': datetime.now().isoformat()
        }
        
        # Calcular días por destino
        dias_por_destino = dias // len(destinations)
        dias_restantes = dias % len(destinations)
        
        costo_total = 0
        
        for i, dest in enumerate(destinations):
            dias_asignados = dias_por_destino + (1 if i < dias_restantes else 0)
            costo_destino = dest['precio_promedio'] * dias_asignados
            costo_total += costo_destino
            
            actividades_list = dest['actividades'].split(',') if dest['actividades'] else []
            
            # Generar plan diario
            plan_diario = []
            for dia in range(1, dias_asignados + 1):
                actividad = actividades_list[(dia - 1) % len(actividades_list)] if actividades_list else 'Exploración libre'
                plan_diario.append({
                    'dia': dia,
                    'actividad': actividad.strip(),
                    'descripcion': f'Día {dia} en {dest["nombre"]}'
                })
            
            itinerary['destinos'].append({
                'nombre': dest['nombre'],
                'pais': dest['pais'],
                'dias_asignados': dias_asignados,
                'costo_estimado': costo_destino,
                'mejor_epoca': dest['mejor_epoca'],
                'clima': dest['clima'],
                'plan_diario': plan_diario,
                'recomendaciones': dest['descripcion']
            })
        
        itinerary['costo_total_estimado'] = costo_total
        
        # Agregar recomendaciones generales
        itinerary['recomendaciones_generales'] = [
            'Reservar vuelos con 2-3 meses de anticipación',
            'Contratar seguro de viaje',
            'Verificar requisitos de visa',
            'Llevar adaptador de corriente universal',
            'Descargar mapas offline'
        ]
        
        # Registrar tarea de automatización
        task_id = execute_query(
            '''INSERT INTO automated_tasks 
               (user_id, task_type, status, parameters, result)
               VALUES (?, ?, ?, ?, ?)''',
            (user_id, 'generate_itinerary', 'completed', 
             json.dumps(data), json.dumps(itinerary)),
            fetch=None
        )
        
        return jsonify({
            'message': 'Itinerario generado exitosamente',
            'task_id': task_id,
            'itinerary': itinerary
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@automation_bp.route('/send-recommendations-email', methods=['POST'])
@jwt_required()
def send_recommendations_by_email():
    """Enviar recomendaciones por correo automáticamente"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        # Obtener usuario
        user = execute_query(
            'SELECT email, nombre FROM users WHERE id = ?',
            (user_id,),
            fetch='one'
        )
        
        if not user:
            return jsonify({'error': 'Usuario no encontrado'}), 404
        
        # Obtener recomendaciones recientes
        recommendations = execute_query(
            '''SELECT d.*, r.score
               FROM recommendations r
               JOIN destinations d ON r.destination_id = d.id
               WHERE r.user_id = ? AND r.viewed = 0
               ORDER BY r.score DESC
               LIMIT 5''',
            (user_id,)
        )
        
        if not recommendations:
            return jsonify({'error': 'No hay recomendaciones disponibles'}), 404
        
        # Enviar email
        email_sent = send_recommendation_email(
            to_email=user['email'],
            user_name=user['nombre'],
            recommendations=recommendations
        )
        
        if email_sent:
            # Marcar recomendaciones como vistas
            execute_query(
                'UPDATE recommendations SET viewed = 1 WHERE user_id = ? AND viewed = 0',
                (user_id,),
                fetch=None
            )
            
            # Registrar tarea
            task_id = execute_query(
                '''INSERT INTO automated_tasks 
                   (user_id, task_type, status, parameters, executed_at)
                   VALUES (?, ?, ?, ?, ?)''',
                (user_id, 'send_email', 'completed', 
                 json.dumps({'to': user['email']}), datetime.now()),
                fetch=None
            )
            
            return jsonify({
                'message': 'Email enviado exitosamente',
                'task_id': task_id,
                'email': user['email']
            }), 200
        else:
            return jsonify({'error': 'Error al enviar email'}), 500
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@automation_bp.route('/export-itinerary-pdf', methods=['POST'])
@jwt_required()
def export_itinerary_pdf():
    """Exportar itinerario a PDF automáticamente"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        if not data or not data.get('itinerary'):
            return jsonify({'error': 'itinerary es requerido'}), 400
        
        itinerary = data['itinerary']
        
        # Obtener usuario
        user = execute_query(
            'SELECT nombre FROM users WHERE id = ?',
            (user_id,),
            fetch='one'
        )
        
        # Generar PDF
        pdf_path = generate_itinerary_pdf(
            itinerary=itinerary,
            user_name=user['nombre'] if user else 'Usuario'
        )
        
        if pdf_path and os.path.exists(pdf_path):
            # Registrar tarea
            task_id = execute_query(
                '''INSERT INTO automated_tasks 
                   (user_id, task_type, status, parameters, result, executed_at)
                   VALUES (?, ?, ?, ?, ?, ?)''',
                (user_id, 'generate_pdf', 'completed', 
                 json.dumps({'itinerary_title': itinerary.get('titulo')}),
                 pdf_path, datetime.now()),
                fetch=None
            )
            
            # Enviar archivo
            return send_file(
                pdf_path,
                mimetype='application/pdf',
                as_attachment=True,
                download_name=f'itinerario_{datetime.now().strftime("%Y%m%d")}.pdf'
            )
        else:
            return jsonify({'error': 'Error al generar PDF'}), 500
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@automation_bp.route('/generate-report', methods=['POST'])
@jwt_required()
def generate_user_report():
    """Generar reporte de actividad del usuario automáticamente"""
    try:
        user_id = get_jwt_identity()
        
        # Obtener estadísticas del usuario
        user = execute_query(
            'SELECT nombre, email, created_at FROM users WHERE id = ?',
            (user_id,),
            fetch='one'
        )
        
        # Total de interacciones
        total_interactions = execute_query(
            'SELECT COUNT(*) as total FROM user_interactions WHERE user_id = ?',
            (user_id,),
            fetch='one'
        )
        
        # Destinos visitados
        visited_destinations = execute_query(
            '''SELECT d.nombre, d.pais, d.categoria, ui.timestamp
               FROM user_interactions ui
               JOIN destinations d ON ui.destination_id = d.id
               WHERE ui.user_id = ?
               ORDER BY ui.timestamp DESC''',
            (user_id,)
        )
        
        # Favoritos
        favorites = execute_query(
            '''SELECT COUNT(*) as total FROM user_interactions 
               WHERE user_id = ? AND favorito = 1''',
            (user_id,),
            fetch='one'
        )
        
        # Categorías favoritas
        favorite_categories = execute_query(
            '''SELECT d.categoria, COUNT(*) as count
               FROM user_interactions ui
               JOIN destinations d ON ui.destination_id = d.id
               WHERE ui.user_id = ?
               GROUP BY d.categoria
               ORDER BY count DESC
               LIMIT 5''',
            (user_id,)
        )
        
        # Recomendaciones recibidas
        recommendations_count = execute_query(
            'SELECT COUNT(*) as total FROM recommendations WHERE user_id = ?',
            (user_id,),
            fetch='one'
        )
        
        report = {
            'usuario': {
                'nombre': user['nombre'],
                'email': user['email'],
                'miembro_desde': user['created_at']
            },
            'estadisticas': {
                'total_interacciones': total_interactions['total'],
                'destinos_explorados': len(visited_destinations),
                'favoritos': favorites['total'],
                'recomendaciones_recibidas': recommendations_count['total']
            },
            'destinos_visitados': visited_destinations[:10],  # Top 10
            'categorias_favoritas': favorite_categories,
            'generado_en': datetime.now().isoformat()
        }
        
        # Registrar tarea
        task_id = execute_query(
            '''INSERT INTO automated_tasks 
               (user_id, task_type, status, result, executed_at)
               VALUES (?, ?, ?, ?, ?)''',
            (user_id, 'generate_report', 'completed',
             json.dumps(report), datetime.now()),
            fetch=None
        )
        
        return jsonify({
            'message': 'Reporte generado exitosamente',
            'task_id': task_id,
            'report': report
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@automation_bp.route('/tasks', methods=['GET'])
@jwt_required()
def get_user_tasks():
    """Obtener historial de tareas automatizadas del usuario"""
    try:
        user_id = get_jwt_identity()
        
        tasks = execute_query(
            '''SELECT * FROM automated_tasks 
               WHERE user_id = ?
               ORDER BY created_at DESC
               LIMIT 50''',
            (user_id,)
        )
        
        return jsonify({
            'tasks': tasks,
            'total': len(tasks)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@automation_bp.route('/tasks/<int:task_id>', methods=['GET'])
@jwt_required()
def get_task_detail(task_id):
    """Obtener detalles de una tarea específica"""
    try:
        user_id = get_jwt_identity()
        
        task = execute_query(
            'SELECT * FROM automated_tasks WHERE id = ? AND user_id = ?',
            (task_id, user_id),
            fetch='one'
        )
        
        if not task:
            return jsonify({'error': 'Tarea no encontrada'}), 404
        
        # Parsear JSON fields
        if task['parameters']:
            task['parameters'] = json.loads(task['parameters'])
        if task['result']:
            task['result'] = json.loads(task['result'])
        
        return jsonify(task), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500