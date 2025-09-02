from pydantic import BaseModel
from typing import Optional



class AgregarDiarioDtos(BaseModel):
    usuario_id: int
    titulo: str 
    contenido: str

class DiarioResponde(BaseModel):
    usuario_id: int
    titulo: str 
    contenido: str
        

    