from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.models.tecnica_calificacion import TecnicaCalificacion
from app.dtos.tecnica_calificacion_dto import (
    TecnicaCalificacionCreate,
    TecnicaCalificacionUpdate
)
from sqlalchemy import func



def crear_o_actualizar_calificacion(db: Session, calificacion_data: TecnicaCalificacionCreate):
    """# Todo ese archivo realizado por douglas   
    Calificar una técnica de 1 a 5 estrellas para un usuario.
    O cambiar la calificación dada
    """
    calificacion = db.query(TecnicaCalificacion).filter(
        TecnicaCalificacion.usuario_id == calificacion_data.usuario_id,
        TecnicaCalificacion.tecnica_id == calificacion_data.tecnica_id
    ).first()

    if calificacion:
        calificacion.estrellas = calificacion_data.estrellas
    else:
        calificacion = TecnicaCalificacion(**calificacion_data.dict())
        db.add(calificacion)

    db.commit()
    db.refresh(calificacion)
    return calificacion

def obtener_calificacion_usuario(db: Session, usuario_id: int, tecnica_id: int):
    """
    Obtener la calificacion por medio de la tecnica y el usuario
    """
    calificacion = db.query(TecnicaCalificacion).filter_by(
        usuario_id=usuario_id, tecnica_id=tecnica_id
    ).first()
    if not calificacion:
        raise HTTPException(status_code=404, detail="No se encontró calificación")
    return calificacion


# Por si se quería promedio, pero no es el caso

# def promedio_tecnica(db: Session, tecnica_id: int):
#     """
#     Obtener la calificacion por medio de la tecnica y el usuario
#     """
#     promedio = db.query(func.avg(TecnicaCalificacion.estrellas)).filter(
#         TecnicaCalificacion.tecnica_id == tecnica_id
#     ).scalar()
#     return round(promedio, 2) if promedio else 0
