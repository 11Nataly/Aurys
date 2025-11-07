from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.services.envio_correos import enviar_correo_recuperacion, restablecer_contrasena
from app.dtos.usuario_dto import ForgotPasswordRequest, ResetPasswordRequest, Token

router = APIRouter(tags=["recuperación de contraseña"])

@router.post("/recuperar-contrasena")
def recuperar_contrasena(request: ForgotPasswordRequest, db: Session = Depends(get_db)):
    # Aquí podrías validar que el correo existe antes de enviar
    enviar_correo_recuperacion(request.correo, db)
    return {"msg": "Te hemos enviado un correo para recuperar tu contraseña."}

@router.post("/restablecer-contrasena/{token}")
def restablecer_contra(token: str, request: ResetPasswordRequest, db: Session = Depends(get_db)):
    return restablecer_contrasena(token, request.nueva_contrasena, db)
    # Todo ese archivo realizado por douglas   