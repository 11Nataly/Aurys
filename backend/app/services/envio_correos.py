from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.usuario import Usuario
from app.core.security import hash_password, verify_password, create_access_token
from app.core.config import settings
from itsdangerous import URLSafeTimedSerializer,BadSignature, SignatureExpired
from app.services.verificacion_correo import enviar_email
from datetime import datetime



# Crear serializador
def generar_serializer():
    return URLSafeTimedSerializer(settings.SECRET_KEY, salt='recuperar-contrasena')

# Generar token seguro
def generar_token_email(correo: str):
    return generar_serializer().dumps(correo)

# Verificar token (con tiempo de expiración)
def verificar_token_email(token: str, max_age=600):
    try:
        return generar_serializer().loads(token, max_age=max_age)
    except SignatureExpired:
        raise HTTPException(status_code=400, detail="El enlace ha expirado.")
    except BadSignature:
        raise HTTPException(status_code=400, detail="Token inválido.")
    
# Enviar correo de recuperación
def enviar_correo_recuperacion(correo: str, db: Session):
    usuario = db.query(Usuario).filter(Usuario.correo == correo).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado.")

#Token de autentificacion token que se utiliza 

    token = generar_token_email(correo)
    enlace = f"{settings.Settings_Frontend_URL}/ver-recuperar"

    asunto = "Recuperación de contraseña"
    cuerpo_html = f"""
    <p>Hola {usuario.nombre},</p>
    <p>Haz clic en el siguiente enlace para restablecer tu contraseña. 
    Este enlace expirará en <b>1 hora</b>.</p>
    <a href="{enlace}">Restablecer contraseña</a>
    <p>Si no solicitaste este cambio, puedes ignorar este mensaje.</p>
    """

    enviar_email(db, correo, asunto, cuerpo_html)
    return {"msg": "Correo de recuperación enviado."}

# Restablecer contraseña usando el token
def restablecer_contrasena(token: str, nueva_contrasena: str, db: Session):
    correo = verificar_token_email(token)  # aquí ya valida expiración

    usuario = db.query(Usuario).filter(Usuario.correo == correo).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado.")

    usuario.contrasena = hash_password(nueva_contrasena)
    db.commit()
    return {"msg": "Contraseña restablecida con éxito."}



# Todo ese archivo realizado por douglas   