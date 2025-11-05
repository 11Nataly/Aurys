from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from sqlalchemy.orm import Session
import certifi
import os

from app.core.config import settings
from app.models.usuario import Usuario

os.environ['SSL_CERT_FILE'] = certifi.where()
# Todo ese archivo realizado por douglas   
def enviar_email(db: Session, destinatario: str, asunto: str, contenido_html: str):
    """
    Envía un correo electrónico a un destinatario específico.
    """
    usuario = db.query(Usuario).filter(Usuario.correo == destinatario).first()
    if not usuario:
        print(f"❌ No se encontró el usuario con el correo: {destinatario}")
        return False
    try:
        sg = SendGridAPIClient(settings.SENDGRID_API_KEY)
        message = Mail(
            from_email=("auryssalud@gmail.com", 'Soporte Aurys'),
            to_emails=destinatario,
            subject=asunto,
            html_content=contenido_html
        )
        respuesta = sg.send(message)
        print(f"✅ Correo enviado a {destinatario}, status: {respuesta.status_code}")
        return True
    except Exception as e:
        print("❌ Error al enviar el correo:", e)
        return False