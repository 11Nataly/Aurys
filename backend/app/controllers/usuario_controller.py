from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.dtos.usuario_dto import UsuarioRegistroDTO, UsuarioLoginDTO, Token
from app.services.loginRegister_service import registrar_usuario_service, login_usuario_service, confirm_email_service

router = APIRouter(tags=["autenticacion"], prefix="/auth")

@router.post("/register", status_code=status.HTTP_201_CREATED)
async def registrar_usuario(usuario_dto: UsuarioRegistroDTO, db: Session = Depends(get_db)):
    return registrar_usuario_service(usuario_dto, db)

@router.get("/confirm-email", status_code=status.HTTP_200_OK)
async def confirm_email(token: str, db: Session = Depends(get_db)):
    return confirm_email_service(token, db)
    
@router.post("/login", response_model=Token)
async def login_usuario(usuario_dto: UsuarioLoginDTO, db: Session = Depends(get_db)):
    return login_usuario_service(usuario_dto, db)