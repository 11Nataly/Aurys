from pydantic import BaseModel, EmailStr
from datetime import date
from typing import Optional

class UsuarioRegistroDTO(BaseModel):
    nombre: str
    correo: EmailStr
    contrasena: str
   

class UsuarioLoginDTO(BaseModel):  # Asegúrate de tener también DTO para login
    correo: EmailStr
    contrasena: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
     id: Optional[int] = None

class ForgotPasswordRequest(BaseModel):
     correo: EmailStr

class ResetPasswordRequest(BaseModel):
     nueva_contrasena: str
