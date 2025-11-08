from datetime import datetime, timedelta
from typing import Optional
import re
from urllib.parse import quote_plus

from jose import jwt, JWTError
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from fastapi import HTTPException

from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, Email, To, Content

from app.models.usuario import Usuario
from app.dtos.usuario_dto import UsuarioRegistroDTO, UsuarioLoginDTO
from app.core.config import settings  # SECRET_KEY y SENDGRID_API_KEY

# ======================
# Configuración
# ======================
SECRET_KEY = settings.SECRET_KEY
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
EMAIL_CONFIRMATION_EXPIRE_MINUTES = 60
MAX_LOGIN_ATTEMPTS = 3
LOCKOUT_TIME_MINUTES = 15

SETTINGS_BACKEND_URL = "http://localhost:8000"
SETTINGS_FRONTEND_URL = "http://localhost:5173"

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
login_attempts_in_memory = {}

# ======================
# Seguridad
# ======================
def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# ======================
# Envío de correo con SendGrid
# ======================
def enviar_email(to_email: str, subject: str, html_content: str):
    try:
        message = Mail(
            from_email=Email("auryssalud@gmail.com", "Soporte Aurys"),
            to_emails=To(to_email),
            subject=subject,
            html_content=Content("text/html", html_content)
        )
        sg = SendGridAPIClient(settings.SENDGRID_API_KEY)
        response = sg.send(message)
        print(f"✅ Correo enviado a {to_email}, status: {response.status_code}")
        return True
    except Exception as e:
        print(f"❌ Error al enviar correo a {to_email}: {e}")
        return False

# ======================
# Registro de usuario
# ======================
def registrar_usuario_service(usuario_dto: UsuarioRegistroDTO, db: Session):
    if not re.match(r'^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{5,}$', usuario_dto.contrasena):
        raise HTTPException(status_code=400, detail="Contraseña inválida.")

    db_usuario = db.query(Usuario).filter(Usuario.correo == usuario_dto.correo).first()
    if db_usuario and db_usuario.activo:
        raise HTTPException(status_code=409, detail="Correo ya registrado y activo.")

    usuario_a_enviar = db_usuario if db_usuario and not db_usuario.activo else None
    if not usuario_a_enviar:
        hashed_password = get_password_hash(usuario_dto.contrasena)
        nuevo_usuario = Usuario(
            nombre=usuario_dto.nombre,
            correo=usuario_dto.correo,
            contrasena=hashed_password,
            rol_id=1,
            activo=False
        )
        db.add(nuevo_usuario)
        db.commit()
        db.refresh(nuevo_usuario)
        usuario_a_enviar = nuevo_usuario

    # Token de confirmación
    token = jwt.encode({"sub": str(usuario_a_enviar.id)}, SECRET_KEY, algorithm=ALGORITHM)
    token_url_safe = quote_plus(token)
    confirmation_url = f"{SETTINGS_BACKEND_URL}/auth/confirmar-email?token={token_url_safe}"

    html_content = f"""
        <h2>¡Bienvenido!</h2>
        <p>Haz clic en el enlace para confirmar tu correo:</p>
        <p><a href="{confirmation_url}">Confirmar mi cuenta</a></p>
        <p>Expira en {EMAIL_CONFIRMATION_EXPIRE_MINUTES} minutos.</p>
    """
    enviar_email(usuario_a_enviar.correo, "Confirma tu cuenta", html_content)
    return {"message": "Usuario registrado. Revisa tu correo para confirmar la cuenta."}

# ======================
# Confirmación de correo
# ======================
def confirm_email_service(token: str, db: Session):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = int(payload.get("sub"))
    except (JWTError, ValueError):
        raise HTTPException(status_code=400, detail="Token inválido.")

    usuario = db.query(Usuario).filter(Usuario.id == user_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado.")

    if usuario.activo:
        return {"message": "Correo ya confirmado."}

    usuario.activo = True
    db.commit()
    db.refresh(usuario)
    return {"message": "Correo confirmado. Ahora puedes iniciar sesión."}

# ======================
# Login de usuario
# ======================
def login_usuario_service(usuario_dto: UsuarioLoginDTO, db: Session):
    usuario = db.query(Usuario).filter(Usuario.correo == usuario_dto.correo).first()
    user_email = usuario_dto.correo

    if user_email in login_attempts_in_memory:
        info = login_attempts_in_memory[user_email]
        if info["count"] >= MAX_LOGIN_ATTEMPTS:
            tiempo = datetime.utcnow() - info["last_attempt"]
            if tiempo < timedelta(minutes=LOCKOUT_TIME_MINUTES):
                remaining = timedelta(minutes=LOCKOUT_TIME_MINUTES) - tiempo
                raise HTTPException(status_code=429, detail=f"Cuenta bloqueada. Intenta en {int(remaining.total_seconds()//60)} min.")
            else:
                del login_attempts_in_memory[user_email]

    if not usuario or not verify_password(usuario_dto.contrasena, usuario.contrasena):
        if user_email not in login_attempts_in_memory:
            login_attempts_in_memory[user_email] = {"count":0, "last_attempt": datetime.utcnow()}
        login_attempts_in_memory[user_email]["count"] += 1
        login_attempts_in_memory[user_email]["last_attempt"] = datetime.utcnow()
        raise HTTPException(status_code=401, detail="Credenciales incorrectas.")

    if not usuario.activo:
        raise HTTPException(status_code=403, detail="Usuario inactivo. Revisa tu correo para confirmar la cuenta.")

    if user_email in login_attempts_in_memory:
        del login_attempts_in_memory[user_email]

    access_token = create_access_token({"sub": str(usuario.id)})
    return {"access_token": access_token, "token_type": "bearer", "id": usuario.id, "nombre_rol": usuario.rol.nombre}
