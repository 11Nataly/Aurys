from fastapi import APIRouter, Depends, status
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from jose import jwt, JWTError
from urllib.parse import unquote_plus

from app.db.database import get_db, SessionLocal
from app.models.usuario import Usuario
from app.dtos.usuario_dto import UsuarioRegistroDTO, UsuarioLoginDTO, Token, UsuarioResponseDTO
from app.services.loginRegister_service import registrar_usuario_service, login_usuario_service
from app.services.usuario_service import listar_usuarios, cambiar_estado_usuario
from app.core.config import settings

router = APIRouter(tags=["autenticacion"], prefix="/auth")

# ============================
# Registro
# ============================
@router.post("/register", status_code=status.HTTP_201_CREATED)
async def registrar_usuario(usuario_dto: UsuarioRegistroDTO, db: Session = Depends(get_db)):
    return registrar_usuario_service(usuario_dto, db)

# ============================
# Confirmación de correo
# ============================
@router.get("/confirmar-email")
def confirmar_email(token: str):
    db: Session = SessionLocal()
    try:
        # Decodificamos el token URL-safe
        token_decoded = unquote_plus(token)
        payload = jwt.decode(token_decoded, settings.SECRET_KEY, algorithms=["HS256"])
        user_id = int(payload.get("sub"))
    except (JWTError, ValueError):
        return RedirectResponse(f"{settings.Settings_Frontend_URL}/ver-registroexitoso?error=token_invalido")

    usuario = db.query(Usuario).filter(Usuario.id == user_id).first()
    if not usuario:
        return RedirectResponse(f"{settings.Settings_Frontend_URL}/ver-registroexitoso?error=usuario_no_encontrado")

    if not usuario.activo:
        usuario.activo = True
        db.commit()
        db.refresh(usuario)

    return RedirectResponse(f"{settings.Settings_Frontend_URL}/ver-registroexitoso?success=1")

# ============================
# Login
# ============================
@router.post("/login", response_model=Token)
async def login_usuario(usuario_dto: UsuarioLoginDTO, db: Session = Depends(get_db)):
    return login_usuario_service(usuario_dto, db)

# ============================
# Administrador
# ============================
@router.get("/listar_usuario_admin", response_model=list[UsuarioResponseDTO])
def get_usuarios(db: Session = Depends(get_db)):
    return listar_usuarios(db)

@router.put("/cambiar_estado_usuario_admin/{usuario_id}")
def put_cambiar_estado(usuario_id: int, db: Session = Depends(get_db)):
    return cambiar_estado_usuario(usuario_id, db)
