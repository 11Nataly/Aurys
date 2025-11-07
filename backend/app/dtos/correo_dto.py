# app/dtos/dtos.py
from pydantic import BaseModel, EmailStr
from typing import Optional

class CorreoDTO(BaseModel):
    correo: EmailStr
# Todo ese archivo realizado por douglas   