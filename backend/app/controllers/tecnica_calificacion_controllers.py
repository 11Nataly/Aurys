from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.dtos.tecnica_calificacion_dto import (
    TecnicaCalificacionCreate,
    TecnicaCalificacionResponse
)
from app.services import tecnica_calificacion_service as service


router = APIRouter(prefix="/calificaciones", tags=["Calificaciones"])

# Este endpoint sirve para calificar y modificar la calificación de una técnica
@router.post("/", response_model=TecnicaCalificacionResponse)
def calificar_tecnica(calificacion_data: TecnicaCalificacionCreate, db: Session = Depends(get_db)):
    return service.crear_o_actualizar_calificacion(db, calificacion_data)

# ESte endpoint consulta una técnica de un usuario
@router.get("/{usuario_id}/{tecnica_id}", response_model=TecnicaCalificacionResponse)
def obtener_calificacion(usuario_id: int, tecnica_id: int, db: Session = Depends(get_db)):
    return service.obtener_calificacion_usuario(db, usuario_id, tecnica_id)

# Por ahora no usamos promedios

# @router.get("/promedio/{tecnica_id}")
# def promedio_calificacion(tecnica_id: int, db: Session = Depends(get_db)):
#     return {"tecnica_id": tecnica_id, "promedio": service.promedio_tecnica(db, tecnica_id)}
# Todo ese archivo realizado por douglas   