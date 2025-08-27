from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.dtos.tecnica_dto import TecnicaCreateDTO, TecnicaUpdateDTO, TecnicaResponseDTO, TecnicaUpdateVideoDTO
from app.services.subir_tecnica import crear_tecnica, actualizar_tecnica, obtener_tecnica_por_id, eliminar_tecnica, simplificar_duracion
from app.models.tecnicaafrontamiento import TecnicaAfrontamiento
from app.services.cloudinary_service import upload_video




router = APIRouter(tags=["tecnicas"])

@router.post("/tecnica", response_model=dict)
async def crear_tecnica_endpoint(tecnica_dto: TecnicaCreateDTO, db: Session = Depends(get_db)):
    """Endpoint para registrar una nueva técnica de afrontamiento."""
    tecnica = crear_tecnica(db, tecnica_dto)
    return {"id": tecnica.id, "mensaje": "Técnica creada exitosamente"}


@router.put("/tecnica/{tecnica_id}", response_model=dict)
async def actualizar_tecnica_endpoint(tecnica_id: int, tecnica_dto: TecnicaUpdateDTO, db: Session = Depends(get_db)):
    """Endpoint para actualizar una técnica de afrontamiento."""
    tecnica = actualizar_tecnica(db, tecnica_id, tecnica_dto)
    return {
        "id": tecnica.id,
        "nombre": tecnica.nombre,
        "descripcion": tecnica.descripcion,
        "instruccion": tecnica.instruccion,
        "duracion": simplificar_duracion(tecnica.duracion_video) if tecnica.duracion_video else None,
        "mensaje": "Técnica actualizada exitosamente"
    }


@router.get(
    "/tecnica_get/{tecnica_id}",
    response_model=TecnicaResponseDTO,
    summary="Obtiene una técnica de afrontamiento por ID"
)
def obtener_tecnica_endpoint(tecnica_id: int, db: Session = Depends(get_db)):
    """
    Endpoint para obtener los detalles de una técnica de afrontamiento.
    """
    tecnica = obtener_tecnica_por_id(db, tecnica_id)
    if not tecnica:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Técnica no encontrada"
        )
    
    # Transformar duración antes de responder
    duracion_simplificada = simplificar_duracion(tecnica.duracion_video) if tecnica.duracion_video else None

    return TecnicaResponseDTO(
    id=tecnica.id,
    usuario_id=tecnica.usuario_id,
    nombre=tecnica.nombre,
    descripcion=tecnica.descripcion,
    video=tecnica.video,
    instruccion=tecnica.instruccion,
    calificacion=tecnica.calificacion,
    duracion_user=simplificar_duracion(tecnica.duracion_video) if tecnica.duracion_video else None,
    activo=tecnica.activo
    )

@router.put("/tecnica_update_video/{tecnica_id}")
async def actualizar_video(
    tecnica_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    try:
        # 🚀 Pasamos directamente el stream del archivo
        video_url = upload_video(file.file)

        tecnica = db.query(TecnicaAfrontamiento).filter(TecnicaAfrontamiento.id == tecnica_id).first()
        if not tecnica:
            raise HTTPException(status_code=404, detail="Técnica no encontrada")

        tecnica.video = video_url
        db.commit()
        db.refresh(tecnica)

        return {"message": "Video actualizado correctamente", "video_url": video_url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error actualizando video: {str(e)}")


@router.delete("/eliminar_tecnica/{tecnica_id}", status_code=status.HTTP_200_OK)
async def eliminar_tecnica_endpoint(tecnica_id: int, db: Session = Depends(get_db)):
    """
    Endpoint para eliminar una técnica de afrontamiento por ID.
    """
    eliminar_tecnica(db, tecnica_id)
    return {"message": "Técnica eliminada correctamente"}
