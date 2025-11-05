from pydantic import BaseModel, Field

# Clase base que define la validación común para las estrellas.
# Esto asegura que todas las clases que hereden de ella tengan
# la validación de 1 a 5 estrellas.
class TecnicaCalificacionBase(BaseModel):
    estrellas: int = Field(..., ge=1, le=5, description="Número de estrellas (1 a 5)")

# Este DTO se usa para crear una nueva calificación.
class TecnicaCalificacionCreate(TecnicaCalificacionBase):
    usuario_id: int
    tecnica_id: int

# Este DTO se usa para actualizar una calificación existente.
class TecnicaCalificacionUpdate(TecnicaCalificacionBase):
    pass 

# Este DTO se usa para las respuestas de la API.
class TecnicaCalificacionResponse(TecnicaCalificacionBase):
    id: int
    usuario_id: int
    tecnica_id: int

    class Config:
        from_attributes = True
# Todo ese archivo realizado por douglas   