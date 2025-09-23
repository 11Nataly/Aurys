from pydantic import BaseModel
from typing import Optional

class RolCreateDTO(BaseModel):
    nombre: str

