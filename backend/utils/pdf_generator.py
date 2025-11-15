# utils/pdf_generator.py

from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
import os

def generate_itinerary_pdf(itinerary_data, output_path):
    """
    Genera un PDF simple para el itinerario.
    itinerary_data debe ser un diccionario con claves:
    'destino', 'dias', 'actividades'
    """

    # Crear carpeta si no existe
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    c = canvas.Canvas(output_path, pagesize=letter)
    width, height = letter

    c.setFont("Helvetica-Bold", 18)
    c.drawString(50, height - 50, "Itinerario de Viaje")

    c.setFont("Helvetica", 12)
    y = height - 100

    for key, value in itinerary_data.items():
        c.drawString(50, y, f"{key.capitalize()}: {value}")
        y -= 20

    c.save()

    return output_path
