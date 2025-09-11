from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.dtos.tecnica_dto import (
    TecnicaCreateDTO,
    TecnicaUpdateDTO,
    TecnicaResponseDTO,
    CalificacionCreateDTO,
    CalificacionResponseDTO
)
from app.services.subir_tecnica import (
    crear_tecnica,
    actualizar_tecnica,
    obtener_tecnica_por_id,
    eliminar_tecnica,
    crear_calificacion,
    calificar_tecnica,
    simplificar_duracion
)
from app.models.tecnicaafrontamiento import TecnicaAfrontamiento
from app.services.cloudinary_service import upload_video

router = APIRouter(
    prefix="/tecnicas",
    tags=["Técnicas de Afrontamiento"]
)

# -------------------
# Crear técnica
# -------------------
@router.post("/crear_tecnica", response_model=TecnicaResponseDTO, status_code=status.HTTP_201_CREATED)
def crear_tecnica_endpoint(dto: TecnicaCreateDTO, db: Session = Depends(get_db)):
    return crear_tecnica(db, dto)

# -------------------
# Obtener técnica por ID
# -------------------
@router.get("/obtener_tecnica/{tecnica_id}", response_model=TecnicaResponseDTO)
def obtener_tecnica_endpoint(tecnica_id: int, db: Session = Depends(get_db)):
    tecnica = obtener_tecnica_por_id(db, tecnica_id)
    if not tecnica:
        raise HTTPException(status_code=404, detail="Técnica no encontrada")
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

# -------------------
# Actualizar técnica
# -------------------
@router.put("/actualizar_tecnica", response_model=TecnicaResponseDTO)
def actualizar_tecnica_endpoint(dto: TecnicaUpdateDTO, db: Session = Depends(get_db)):
    tecnica = actualizar_tecnica(db, dto.id, dto)  # DTO debe contener 'id'
    if not tecnica:
        raise HTTPException(status_code=404, detail="Técnica no encontrada")
    return tecnica

# -------------------
# Eliminar técnica
# -------------------
@router.delete("/eliminar_tecnica", status_code=status.HTTP_200_OK)
def eliminar_tecnica_endpoint(dto: dict, db: Session = Depends(get_db)):
    tecnica_id = dto.get("id")
    if not tecnica_id:
        raise HTTPException(status_code=400, detail="Se requiere 'id'")
    return eliminar_tecnica(db, tecnica_id)

# -------------------
# Subir / Actualizar video
# -------------------
@router.post("/subir_video/{tecnica_id}")
async def actualizar_video_endpoint(tecnica_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    tecnica = db.query(TecnicaAfrontamiento).filter(TecnicaAfrontamiento.id == tecnica_id).first()
    if not tecnica:
        raise HTTPException(status_code=404, detail="Técnica no encontrada")
    try:
        video_url = upload_video(file.file)
        tecnica.video = video_url
        db.commit()
        db.refresh(tecnica)
        return {"message": "Video actualizado correctamente", "video_url": video_url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error subiendo video: {str(e)}")

# -------------------
# Crear calificación
# -------------------
@router.post("/crear_calificacion", response_model=CalificacionResponseDTO)
def crear_calificacion_endpoint(dto: CalificacionCreateDTO, db: Session = Depends(get_db)):
    return crear_calificacion(db, dto)

# -------------------
# Calificar técnica por usuario
# -------------------
@router.post("/calificar_tecnica", response_model=CalificacionResponseDTO)
def calificar_endpoint(dto: CalificacionCreateDTO, usuario_id: int, db: Session = Depends(get_db)):
    return calificar_tecnica(db, usuario_id, dto.tecnica_id, dto)
