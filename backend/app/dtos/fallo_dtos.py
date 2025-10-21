from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class FalloCreateDTO(BaseModel):
    promesa_id: int
    descripcion: Optional[str] = None

class FalloResponseDTO(BaseModel):
    id: int
    promesa_id: int
    descripcion: Optional[str] = None
    fecha: datetime

    class Config:
        orm_mode = True
