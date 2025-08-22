from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.dtos.usuario_dto import UsuarioRegistroDTO, UsuarioLoginDTO, Token
from app.services.loginRegister_service import registrar_usuario_service, login_usuario_service

router = APIRouter(tags=["autenticacion"])


@router.post("/register", response_model=dict, status_code=status.HTTP_201_CREATED)
async def registrar_usuario(usuario_dto: UsuarioRegistroDTO, db: Session = Depends(get_db)):
    nuevo_usuario = registrar_usuario_service(usuario_dto, db)
    return {"message": "Usuario registrado exitosamente", "id": nuevo_usuario.id}


@router.post("/login", response_model=Token)
async def login_usuario(usuario_dto: UsuarioLoginDTO, db: Session = Depends(get_db)):
    return login_usuario_service(usuario_dto, db)
