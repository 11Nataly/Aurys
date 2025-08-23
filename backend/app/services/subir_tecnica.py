from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.models.tecnicaafrontamiento import TecnicaAfrontamiento
from app.dtos.tecnica_dto import TecnicaCreateDTO, TecnicaUpdateDTO
import cloudinary.uploader
import re

def crear_tecnica(db: Session, tecnica_dto: TecnicaCreateDTO):
    tecnica = TecnicaAfrontamiento(
        usuario_id=tecnica_dto.usuario_id,
        nombre=tecnica_dto.nombre,
        descripcion=tecnica_dto.descripcion,
        instruccion=tecnica_dto.instruccion,
    )
    db.add(tecnica)
    db.commit()
    db.refresh(tecnica)
    return tecnica


def actualizar_tecnica(db: Session, tecnica_id: int, tecnica_dto: TecnicaUpdateDTO):
    tecnica = db.query(TecnicaAfrontamiento).filter(
        TecnicaAfrontamiento.id == tecnica_id
    ).first()

    if not tecnica:
        raise HTTPException(status_code=404, detail="Técnica no encontrada")

    # Solo actualiza lo que venga en el DTO
    if tecnica_dto.nombre is not None:
        tecnica.nombre = tecnica_dto.nombre
    if tecnica_dto.descripcion is not None:
        tecnica.descripcion = tecnica_dto.descripcion
    if tecnica_dto.instruccion is not None:
        tecnica.instruccion = tecnica_dto.instruccion

    db.commit()
    db.refresh(tecnica)
    return tecnica

def obtener_tecnica_por_id(db: Session, tecnica_id: int) -> TecnicaAfrontamiento:
    """
    Busca y devuelve una técnica de afrontamiento por su ID.
    """
    return db.query(TecnicaAfrontamiento).filter(TecnicaAfrontamiento.id == tecnica_id).first()







def eliminar_tecnica(db: Session, tecnica_id: int):
    """
    Elimina una técnica de afrontamiento por su ID, incluyendo el video asociado en Cloudinary.
    """
    tecnica = db.query(TecnicaAfrontamiento).filter(TecnicaAfrontamiento.id == tecnica_id).first()

    if not tecnica:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Técnica no encontrada")

    if tecnica.video:
        try:
            # Extraer el public_id del video
            match = re.search(r"/([^/]+)\.mp4$", tecnica.video)
            if match:
                public_id = match.group(1)
                cloudinary.uploader.destroy(public_id, resource_type="video")
        except Exception as e:
            # Manejar el error de Cloudinary sin detener la eliminación de la base de datos
            print(f"Error al eliminar video de Cloudinary: {str(e)}")
    
    db.delete(tecnica)
    db.commit()

    return {"message": "Técnica eliminada correctamente"}