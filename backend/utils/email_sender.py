import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from config import Config
import os

def send_recommendation_email(to_email, user_name, recommendations):
    """
    Enviar email con recomendaciones personalizadas
    
    Para usar Gmail:
    1. Habilitar verificación en dos pasos
    2. Generar contraseña de aplicación: https://myaccount.google.com/apppasswords
    3. Configurar variables de entorno:
       export MAIL_USERNAME="tu_email@gmail.com"
       export MAIL_PASSWORD="contraseña_aplicacion"
    """
    try:
        # Verificar configuración
        if not Config.MAIL_USERNAME or not Config.MAIL_PASSWORD:
            print("Advertencia: Email no configurado. Simulando envío...")
            return simulate_email_send(to_email, user_name, recommendations)
        
        # Crear mensaje
        msg = MIMEMultipart('alternative')
        msg['Subject'] = f'🌎 Tus Recomendaciones Personalizadas - South Americans Secrets'
        msg['From'] = Config.MAIL_USERNAME
        msg['To'] = to_email
        
        # Crear contenido HTML
        html_content = generate_email_html(user_name, recommendations)
        
        # Adjuntar contenido
        html_part = MIMEText(html_content, 'html')
        msg.attach(html_part)
        
        # Enviar email
        with smtplib.SMTP(Config.MAIL_SERVER, Config.MAIL_PORT) as server:
            server.starttls()
            server.login(Config.MAIL_USERNAME, Config.MAIL_PASSWORD)
            server.send_message(msg)
        
        print(f"Email enviado exitosamente a {to_email}")
        return True
        
    except Exception as e:
        print(f"Error al enviar email: {e}")
        return False

def simulate_email_send(to_email, user_name, recommendations):
    """Simular envío de email para desarrollo/testing"""
    print("\n" + "="*60)
    print("📧 SIMULACIÓN DE ENVÍO DE EMAIL")
    print("="*60)
    print(f"Para: {to_email}")
    print(f"Usuario: {user_name}")
    print(f"\nRecomendaciones ({len(recommendations)}):")
    for i, rec in enumerate(recommendations, 1):
        print(f"\n{i}. {rec['nombre']} - {rec['pais']}")
        print(f"   Categoría: {rec['categoria']}")
        print(f"   Rating: {rec['rating']}/5")
        print(f"   Precio: ${rec['precio_promedio']}/día")
    print("="*60 + "\n")
    return True

def generate_email_html(user_name, recommendations):
    """Generar contenido HTML del email"""
    
    recommendations_html = ""
    for rec in recommendations:
        recommendations_html += f"""
        <div style="margin: 20px 0; padding: 20px; background: #f8f9fa; border-radius: 10px; border-left: 4px solid #007bff;">
            <h3 style="margin: 0 0 10px 0; color: #333;">{rec['nombre']}, {rec['pais']}</h3>
            <p style="color: #666; margin: 5px 0;">
                <strong>Categoría:</strong> {rec['categoria']}
            </p>
            <p style="color: #666; margin: 5px 0;">
                <strong>Rating:</strong> ⭐ {rec['rating']}/5
            </p>
            <p style="color: #666; margin: 5px 0;">
                <strong>Precio promedio:</strong> ${rec['precio_promedio']}/día
            </p>
            <p style="color: #555; margin: 10px 0 0 0;">
                {rec.get('descripcion', 'Descubre este increíble destino')}
            </p>
        </div>
        """
    
    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🌎 South Americans Secrets</h1>
            <p style="color: #f0f0f0; margin: 10px 0 0 0;">Descubre los secretos de Sudamérica</p>
        </div>
        
        <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none;">
            <h2 style="color: #333; margin-top: 0;">¡Hola {user_name}! 👋</h2>
            
            <p style="font-size: 16px; color: #555;">
                Basándonos en tus preferencias, hemos seleccionado estos destinos especialmente para ti:
            </p>
            
            {recommendations_html}
            
            <div style="margin: 30px 0; text-align: center;">
                <a href="https://xeann.github.io/SouthAmericansSecrets/" 
                   style="display: inline-block; background: #007bff; color: white; padding: 15px 30px; 
                          text-decoration: none; border-radius: 5px; font-weight: bold;">
                    Ver Más Destinos
                </a>
            </div>
            
            <p style="color: #777; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
                <strong>Sistema Inteligente de Recomendación</strong><br>
                Powered by IA • Machine Learning • Python
            </p>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #777; border-radius: 0 0 10px 10px;">
            <p style="margin: 0;">
                © 2025 South Americans Secrets | Sistema de Recomendación Inteligente
            </p>
        </div>
    </body>
    </html>
    """
    
    return html

def send_itinerary_email(to_email, user_name, itinerary):
    """Enviar itinerario por email"""
    try:
        if not Config.MAIL_USERNAME or not Config.MAIL_PASSWORD:
            print("Email no configurado. Simulando envío de itinerario...")
            print(f"Itinerario para {user_name}: {itinerary['titulo']}")
            return True
        
        msg = MIMEMultipart('alternative')
        msg['Subject'] = f'📋 Tu Itinerario Personalizado - {itinerary["titulo"]}'
        msg['From'] = Config.MAIL_USERNAME
        msg['To'] = to_email
        
        # Generar HTML del itinerario
        destinations_html = ""
        for dest in itinerary['destinos']:
            destinations_html += f"""
            <div style="margin: 15px 0; padding: 15px; background: #f8f9fa; border-radius: 8px;">
                <h4 style="margin: 0 0 10px 0; color: #007bff;">{dest['nombre']}, {dest['pais']}</h4>
                <p style="margin: 5px 0;"><strong>Duración:</strong> {dest['dias_asignados']} días</p>
                <p style="margin: 5px 0;"><strong>Costo estimado:</strong> ${dest['costo_estimado']:.2f}</p>
                <p style="margin: 5px 0;"><strong>Mejor época:</strong> {dest['mejor_epoca']}</p>
            </div>
            """
        
        html = f"""
        <!DOCTYPE html>
        <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2>¡Tu Itinerario Está Listo, {user_name}! ✈️</h2>
            <h3>{itinerary['titulo']}</h3>
            <p><strong>Duración total:</strong> {itinerary['duracion_dias']} días</p>
            <p><strong>Costo total estimado:</strong> ${itinerary['costo_total_estimado']:.2f}</p>
            
            <h3>Destinos Incluidos:</h3>
            {destinations_html}
            
            <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #777; font-size: 14px;">
                Este itinerario fue generado automáticamente por nuestro sistema de IA.
            </p>
        </body>
        </html>
        """
        
        html_part = MIMEText(html, 'html')
        msg.attach(html_part)
        
        with smtplib.SMTP(Config.MAIL_SERVER, Config.MAIL_PORT) as server:
            server.starttls()
            server.login(Config.MAIL_USERNAME, Config.MAIL_PASSWORD)
            server.send_message(msg)
        
        return True
        
    except Exception as e:
        print(f"Error al enviar itinerario: {e}")
        return False