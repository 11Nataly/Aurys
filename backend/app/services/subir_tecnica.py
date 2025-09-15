from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.models.tecnicaafrontamiento import TecnicaAfrontamiento
from app.dtos.tecnica_dto import (
    TecnicaCreateDTO,
    TecnicaUpdateDTO
)
import re
import cloudinary.uploader
# ==============================
#   CRUD TÉCNICAS DE AFRONTAMIENTO
# ==============================

def crear_tecnica(db: Session, tecnica_dto: TecnicaCreateDTO, usuario_id: int):
    """
    Crea una nueva técnica de afrontamiento.
    El usuario_id ahora viene del token (admin autenticado).
    Convierte horas/minutos/segundos en duración total (segundos).
    """
    tecnica = TecnicaAfrontamiento(
        usuario_id=usuario_id,  #  tomado del token
        nombre=tecnica_dto.nombre,
        descripcion=tecnica_dto.descripcion,
        instruccion=tecnica_dto.instruccion,
        duracion_video=(tecnica_dto.horas * 3600) + (tecnica_dto.minutos * 60) + tecnica_dto.segundos
    )
    db.add(tecnica)
    db.commit()
    db.refresh(tecnica)
    return tecnica

def actualizar_tecnica(db: Session, tecnica_id: int, dto: TecnicaUpdateDTO):
    tecnica = db.query(TecnicaAfrontamiento).filter(TecnicaAfrontamiento.id == tecnica_id).first()
    if not tecnica:
        raise HTTPException(status_code=404, detail="Técnica no encontrada")

    if dto.nombre is not None:
        tecnica.nombre = dto.nombre
    if dto.descripcion is not None:
        tecnica.descripcion = dto.descripcion
    if dto.instruccion is not None:
        tecnica.instruccion = dto.instruccion
    if dto.horas is not None or dto.minutos is not None or dto.segundos is not None:
        h = dto.horas or 0
        m = dto.minutos or 0
        s = dto.segundos or 0
        tecnica.duracion_video = h * 3600 + m * 60 + s

    db.commit()
    db.refresh(tecnica)
    return tecnica

def obtener_tecnica_por_id(db: Session, tecnica_id: int):
    return db.query(TecnicaAfrontamiento).filter(TecnicaAfrontamiento.id == tecnica_id).first()

def eliminar_tecnica(db: Session, tecnica_id: int):
    tecnica = db.query(TecnicaAfrontamiento).filter(TecnicaAfrontamiento.id == tecnica_id).first()
    if not tecnica:
        raise HTTPException(status_code=404, detail="Técnica no encontrada")

    if tecnica.video:
        try:
            match = re.search(r"/([^/]+)\.mp4$", tecnica.video)
            if match:
                public_id = match.group(1)
                cloudinary.uploader.destroy(public_id, resource_type="video")
        except Exception as e:
            print(f"Error eliminando video: {str(e)}")

    db.delete(tecnica)
    db.commit()
    return {"message": "Técnica eliminada correctamente"}

def simplificar_duracion(segundos: int) -> str:
    if segundos >= 3600:
        horas = round(segundos / 3600)
        return f"{horas} hora{'s' if horas > 1 else ''}"
    elif segundos >= 60:
        minutos = round(segundos / 60)
        return f"{minutos} minuto{'s' if minutos > 1 else ''}"
    else:
        return f"{segundos} segundo{'s' if segundos > 1 else ''}"

## se elimino la parte de calificaciones porque ya no va en este modelo    
