from datetime import datetime, timedelta
from typing import Optional
import re

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session

# Importa el módulo de la base de datos desde la ruta correcta
from app.db.database import get_db
from app.models.usuario import Usuario
from pydantic import BaseModel

class UsuarioRegisterDTO(BaseModel):
    nombre: str
    correo: str
    contrasena: str
    # rol_id eliminado del DTO, ya que siempre será 1

class UsuarioLoginDTO(BaseModel):
    correo: str
    contrasena: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    id: Optional[int] = None

# Configuración de seguridad
SECRET_KEY = "tu_clave_secreta_super_segura"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

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

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

router = APIRouter(tags=["autenticacion"])

@router.post("/register", response_model=dict, status_code=status.HTTP_201_CREATED)
async def registrar_usuario(usuario_dto: UsuarioRegisterDTO, db: Session = Depends(get_db)):
    # 3. Validar que todos los campos estén presentes
    if not usuario_dto.nombre or not usuario_dto.correo or not usuario_dto.contrasena:
        raise HTTPException(status_code=400, detail="Complete todos los campos.")

    # 1. Validar formato de contraseña: al menos 5 caracteres, letras, números y un caracter especial
    if not re.match(r'^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{5,}$', usuario_dto.contrasena):
        raise HTTPException(
            status_code=400,
            detail="La contraseña debe tener mínimo 5 caracteres, incluir letras, números y un caracter especial."
        )

    # 4. Verificar si el correo ya existe
    db_usuario = db.query(Usuario).filter(Usuario.correo == usuario_dto.correo).first()
    if db_usuario:
        raise HTTPException(status_code=409, detail="El correo ya está registrado.")

    # 2. Rol siempre será 1 y activo por defecto será True
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
    
    return {"message": "Usuario registrado exitosamente", "id": nuevo_usuario.id}

@router.post("/login", response_model=Token)
async def login_usuario(usuario_dto: UsuarioLoginDTO, db: Session = Depends(get_db)):
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
