from pydantic import BaseModel, EmailStr, Field

from datetime import date
from typing import Optional

class UsuarioRegistroDTO(BaseModel):
    nombre: str = Field(min_length=1)
    correo: EmailStr
    contrasena: str = Field(min_length=5)

   

class UsuarioLoginDTO(BaseModel):  # Asegúrate de tener también DTO para login
    correo: EmailStr
    contrasena: str

class Token(BaseModel):
    id: int
    access_token: str
    token_type: str
    nombre_rol : str

class TokenData(BaseModel):
     id: Optional[int] = None

class ForgotPasswordRequest(BaseModel):
     correo: EmailStr

class ResetPasswordRequest(BaseModel):
     nueva_contrasena: str
