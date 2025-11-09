from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.models.tecnicaafrontamiento import TecnicaAfrontamiento
from app.dtos.tecnica_dto import (
    TecnicaCreateDTO,
    TecnicaUpdateDTO,
    CalificacionCreateDTO,
    CalificacionResponseDTO,
    TecnicaUpdateVideoDTO,
    TecnicaSubirVideoDTO
)
import cloudinary.uploader
import re


# ==============================
#   CALIFICACIONES
# ==============================

def crear_calificacion(db: Session, calificacion_dto: CalificacionCreateDTO) -> CalificacionResponseDTO:
    """
    Crea una calificación para una técnica de afrontamiento.
    """
    tecnica = db.query(TecnicaAfrontamiento).filter(
        TecnicaAfrontamiento.id == calificacion_dto.tecnica_id
    ).first()

    if not tecnica:
        raise HTTPException(status_code=404, detail="Técnica de afrontamiento no encontrada")

    # Guardar la calificación (número de estrellas)
    tecnica.calificacion = calificacion_dto.estrellas

    db.commit()
    db.refresh(tecnica)

    return CalificacionResponseDTO.model_validate(tecnica)


def obtener_calificaciones(db: Session):
    """
    Retorna todas las calificaciones (técnicas con calificación).
    """
    return db.query(TecnicaAfrontamiento).all()


def obtener_calificacion(db: Session, tecnica_id: int):
    """
    Retorna una calificación específica por ID de técnica.
    """
    return db.query(TecnicaAfrontamiento).filter(
        TecnicaAfrontamiento.id == tecnica_id
    ).first()


# ==============================
#   CRUD TÉCNICAS DE AFRONTAMIENTO
# ==============================

def crear_tecnica(db: Session, tecnica_dto: TecnicaCreateDTO):
    """
    Crea una nueva técnica de afrontamiento.
    Convierte horas/minutos/segundos en duración total (segundos).
    """
    tecnica = TecnicaAfrontamiento(
        usuario_id=tecnica_dto.usuario_id,
        nombre=tecnica_dto.nombre,
        descripcion=tecnica_dto.descripcion,
        instruccion=tecnica_dto.instruccion,
        duracion_video=tecnica_dto.horas * 3600 + tecnica_dto.minutos * 60 + tecnica_dto.segundos
    )
    db.add(tecnica)
    db.commit()
    db.refresh(tecnica)
    return tecnica


def actualizar_tecnica(db: Session, tecnica_id: int, tecnica_dto: TecnicaUpdateDTO):
    """
    Actualiza los campos de una técnica existente.
    Solo modifica los atributos enviados en el DTO.
    """
    tecnica = db.query(TecnicaAfrontamiento).filter(
        TecnicaAfrontamiento.id == tecnica_id
    ).first()

    if not tecnica:
        raise HTTPException(status_code=404, detail="Técnica no encontrada")

    # Actualizar solo los campos proporcionados
    if tecnica_dto.nombre is not None:
        tecnica.nombre = tecnica_dto.nombre
    if tecnica_dto.descripcion is not None:
        tecnica.descripcion = tecnica_dto.descripcion
    if tecnica_dto.instruccion is not None:
        tecnica.instruccion = tecnica_dto.instruccion
    if tecnica_dto.horas is not None or tecnica_dto.minutos is not None or tecnica_dto.segundos is not None:
        h = tecnica_dto.horas or 0
        m = tecnica_dto.minutos or 0
        s = tecnica_dto.segundos or 0
        tecnica.duracion_video = h * 3600 + m * 60 + s

    db.commit()
    db.refresh(tecnica)
    return tecnica


def obtener_tecnica_por_id(db: Session, tecnica_id: int) -> TecnicaAfrontamiento:
    """
    Retorna una técnica específica por su ID.
    """
    return db.query(TecnicaAfrontamiento).filter(
        TecnicaAfrontamiento.id == tecnica_id
    ).first()


def eliminar_tecnica(db: Session, tecnica_id: int):
    """
    Elimina una técnica por ID.
    Si tiene un video en Cloudinary, también lo elimina de la nube.
    """
    tecnica = db.query(TecnicaAfrontamiento).filter(
        TecnicaAfrontamiento.id == tecnica_id
    ).first()

    if not tecnica:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Técnica no encontrada")

    if tecnica.video:
        try:
            # Extraer el public_id del video desde la URL
            match = re.search(r"/([^/]+)\.mp4$", tecnica.video)
            if match:
                public_id = match.group(1)
                cloudinary.uploader.destroy(public_id, resource_type="video")
        except Exception as e:
            # Solo se loguea el error, no se detiene la eliminación en BD
            print(f"Error al eliminar video de Cloudinary: {str(e)}")

    db.delete(tecnica)
    db.commit()

    return {"message": "Técnica eliminada correctamente"}


# ==============================
#   UTILIDADES
# ==============================

def simplificar_duracion(segundos: int) -> str:
    """
    Convierte una duración en segundos a formato simplificado
    (ej: '2 horas', '15 minutos', '30 segundos').
    """
    if segundos >= 3600:
        horas = round(segundos / 3600)
        return f"{horas} hora{'s' if horas > 1 else ''}"
    elif segundos >= 60:
        minutos = round(segundos / 60)
        return f"{minutos} minuto{'s' if minutos > 1 else ''}"
    else:
        return f"{segundos} segundo{'s' if segundos > 1 else ''}"


# ==============================
#   SERVICIOS DE VIDEO
# ==============================

def actualizar_video_tecnica(db: Session, tecnica_id: int, tecnica_dto: TecnicaUpdateVideoDTO):
    """
    Actualiza solo el campo 'video' de una técnica existente.
    """
    tecnica = db.query(TecnicaAfrontamiento).filter(
        TecnicaAfrontamiento.id == tecnica_id
    ).first()

    if not tecnica:
        return None  # No se encontró la técnica

    tecnica.video = tecnica_dto.video
    db.commit()
    db.refresh(tecnica)

    return tecnica


def subir_video_tecnica(db: Session, tecnica_id: int, tecnica_dto: TecnicaSubirVideoDTO):
    """
    Asigna un video a una técnica existente (ej: subida desde Cloudinary).
    """
    tecnica = db.query(TecnicaAfrontamiento).filter(
        TecnicaAfrontamiento.id == tecnica_id
    ).first()

    if not tecnica:
        return None  # No se encontró la técnica

    tecnica.video = tecnica_dto.video
    db.commit()
    db.refresh(tecnica)

    return tecnica
