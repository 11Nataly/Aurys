from pydantic import BaseModel
from typing import Optional
from datetime import date

class AgregarDiarioDtos(BaseModel):
    usuario_id: int
    titulo: str 
    contenido: str

class DiarioResponde(BaseModel):
    usuario_id: int
    titulo: str 
    contenido: str
    

class AgregarDiarioDtos(BaseModel):
    titulo: str
    contenido: str

class EditarDiarioDtos(BaseModel):
    titulo: str | None = None
    contenido: str | None = None

class DiarioResponde(BaseModel):
    id: int
    titulo: str
    contenido: str
    fecha_creacion: date

    class Config:
        orm_mode = True


        

    