from pydantic import BaseModel
from typing import Optional

class PapeleraItemDTO(BaseModel):
    id: int
    tipo: str
    titulo: Optional[str] = None
    descripcion: Optional[str] = None
    fecha_eliminacion: Optional[str] = None
