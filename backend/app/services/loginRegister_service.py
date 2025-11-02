from datetime import datetime, timedelta
from typing import Optional
import re
from jose import jwt, JWTError
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.core.config import settings
from app.models.usuario import Usuario
from app.models.rol import Rol
from app.dtos.usuario_dto import UsuarioRegistroDTO, UsuarioLoginDTO, Token
from app.services.envio_correo import enviar_email
# Todo ese archivo realizado por douglas   
# Configuración de seguridad
SECRET_KEY = settings.SECRET_KEY
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
EMAIL_CONFIRMATION_EXPIRE_MINUTES = 60
MAX_LOGIN_ATTEMPTS = 3
LOCKOUT_TIME_MINUTES = 15

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Diccionarios en memoria para la lógica temporal
confirmation_tokens_in_memory = {}
login_attempts_in_memory = {}

# --- Funciones de seguridad ---
def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# --- Funciones de usuario ---
def registrar_usuario_service(usuario_dto: UsuarioRegistroDTO, db: Session):
    if not re.match(r'^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{5,}$', usuario_dto.contrasena):
        raise HTTPException(
            status_code=400,
            detail="La contraseña debe tener mínimo 5 caracteres, incluir letras, números y un caracter especial."
        )

    db_usuario = db.query(Usuario).filter(Usuario.correo == usuario_dto.correo).first()
    if db_usuario and db_usuario.activo:
        raise HTTPException(status_code=409, detail="El correo ya está registrado y activo.")

    # Se inicializa la variable 'usuario_a_enviar' fuera de los bloques condicionales.
    usuario_a_enviar = None

    if db_usuario and not db_usuario.activo:
        # Si el usuario existe pero no está activo, lo re-usamos.
        usuario_a_enviar = db_usuario
    else:
        # Si el usuario no existe, creamos uno nuevo.
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

    confirmation_token_data = {"sub": str(usuario_a_enviar.id)}
    confirmation_token = jwt.encode(confirmation_token_data, SECRET_KEY, algorithm=ALGORITHM)
    
    confirmation_tokens_in_memory[usuario_a_enviar.id] = {
        "token": confirmation_token,
        "expires": datetime.utcnow() + timedelta(minutes=EMAIL_CONFIRMATION_EXPIRE_MINUTES)
    }

    confirmation_url = f"http://localhost:8000/auth/confirm-email?token={confirmation_token}"
    html_content = f"""
        <html>
        <body>
            <h2>¡Bienvenido!</h2>
            <p>Gracias por registrarte. Por favor, haz clic en el siguiente enlace para confirmar tu correo electrónico:</p>
            <p><a href="{confirmation_url}">Confirmar mi cuenta</a></p>
            <p>Este enlace expirará en {EMAIL_CONFIRMATION_EXPIRE_MINUTES} minutos.</p>
        </body>
        </html>
    """
    enviar_email(db, usuario_a_enviar.correo, "Confirma tu cuenta", html_content)
    
    return {"message": "Usuario registrado exitosamente. Por favor, revisa tu correo para confirmar tu cuenta."}

def confirm_email_service(token: str, db: Session):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = int(payload.get("sub"))
    except (JWTError, ValueError):
        raise HTTPException(status_code=400, detail="Token de confirmación no válido.")

    if user_id not in confirmation_tokens_in_memory or confirmation_tokens_in_memory[user_id]["token"] != token:
        raise HTTPException(status_code=400, detail="Token de confirmación no válido.")
    
    if confirmation_tokens_in_memory[user_id]["expires"] < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Token de confirmación expirado.")
        
    usuario = db.query(Usuario).filter(Usuario.id == user_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado.")

    if usuario.activo:
        return {"message": "El correo ya ha sido confirmado."}

    usuario.activo = True
    db.commit()
    db.refresh(usuario)

    del confirmation_tokens_in_memory[user_id]
    
    return {"message": "Correo confirmado exitosamente. Ahora puedes iniciar sesión."}


def login_usuario_service(usuario_dto: UsuarioLoginDTO, db: Session):
    usuario = db.query(Usuario).filter(Usuario.correo == usuario_dto.correo).first()
    user_email = usuario_dto.correo
    
    if user_email in login_attempts_in_memory:
        attempts_info = login_attempts_in_memory[user_email]
        if attempts_info["count"] >= MAX_LOGIN_ATTEMPTS:
            time_since_last_attempt = datetime.utcnow() - attempts_info["last_attempt"]
            if time_since_last_attempt < timedelta(minutes=LOCKOUT_TIME_MINUTES):
                remaining_time = timedelta(minutes=LOCKOUT_TIME_MINUTES) - time_since_last_attempt
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail=f"Cuenta bloqueada temporalmente. Intenta de nuevo en {int(remaining_time.total_seconds() // 60)} minutos."
                )
            else:
                del login_attempts_in_memory[user_email]

    if not usuario or not verify_password(usuario_dto.contrasena, usuario.contrasena):
        if user_email not in login_attempts_in_memory:
            login_attempts_in_memory[user_email] = {"count": 0, "last_attempt": datetime.utcnow()}
        
        login_attempts_in_memory[user_email]["count"] += 1
        login_attempts_in_memory[user_email]["last_attempt"] = datetime.utcnow()
        
        if login_attempts_in_memory[user_email]["count"] >= MAX_LOGIN_ATTEMPTS:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Has superado el número de intentos. Tu cuenta ha sido bloqueada por 15 minutos."
            )
            
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales incorrectas",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not usuario.activo:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Usuario inactivo. Por favor, revisa tu correo para confirmar tu cuenta."
        )

    if user_email in login_attempts_in_memory:
        del login_attempts_in_memory[user_email]
        
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(usuario.id)}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer", "id": usuario.id, "nombre_rol": usuario.rol.nombre}