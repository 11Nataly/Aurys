from datetime import datetime, timedelta
from typing import Optional
import re
from jose import jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from fastapi import HTTPException, status


from app.models.usuario import Usuario
from app.dtos.usuario_dto import UsuarioRegistroDTO, UsuarioLoginDTO,TokenData, Token

# Configuración de seguridad
SECRET_KEY = "tu_clave_secreta_super_segura"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# -----------------------------
# Funciones de seguridad
# -----------------------------
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


# -----------------------------
# Funciones de usuario
# -----------------------------
def registrar_usuario_service(usuario_dto: UsuarioRegistroDTO, db: Session):
    # Validar formato de contraseña
    if not re.match(r'^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{5,}$', usuario_dto.contrasena):
        raise HTTPException(
            status_code=400,
            detail="La contraseña debe tener mínimo 5 caracteres, incluir letras, números y un caracter especial."
        )

    # Verificar si el correo ya existe
    db_usuario = db.query(Usuario).filter(Usuario.correo == usuario_dto.correo).first()
    if db_usuario:
        raise HTTPException(status_code=409, detail="El correo ya está registrado.")

    # Crear usuario
    hashed_password = get_password_hash(usuario_dto.contrasena)
    nuevo_usuario = Usuario(
        nombre=usuario_dto.nombre,
        correo=usuario_dto.correo,
        contrasena=hashed_password,
        rol_id=1,
        activo=True
    )
    db.add(nuevo_usuario)
    db.commit()
    db.refresh(nuevo_usuario)
    
    return nuevo_usuario


def login_usuario_service(usuario_dto: UsuarioLoginDTO, db: Session):
    usuario = db.query(Usuario).filter(Usuario.correo == usuario_dto.correo).first()

    if not usuario or not verify_password(usuario_dto.contrasena, usuario.contrasena):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales incorrectas",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not usuario.activo:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Usuario inactivo",
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(usuario.id)}, expires_delta=access_token_expires
    )

    return {"access_token": access_token, "token_type": "bearer"}
