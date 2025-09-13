from pydantic import BaseModel
from datetime import datetime

class TecnicaFavoritaBase(BaseModel):
    usuario_id: int
    tecnica_id: int

class TecnicaFavoritaCreate(TecnicaFavoritaBase):
    pass

class TecnicaFavoritaResponse(TecnicaFavoritaBase):
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
