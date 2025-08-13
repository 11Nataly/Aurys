from pydantic import BaseModel, EmailStr
from datetime import date

class UsuarioCreateDTO(BaseModel):
    nombre: str
    correo: EmailStr
    contrasena: str
    fechaCreacion: date  # Opcional si no está en el modelo, ajusta según necesidad

    class Config:
        from_attributes = True  # Reemplaza orm_mode por from_attributes
