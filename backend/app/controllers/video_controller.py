# app/controllers/video_controller.py

from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
import cloudinary
import cloudinary.uploader
from app.db.database import get_db
from app.models.tecnicaafrontamiento import TecnicaAfrontamiento
from app.core.config import settings

# Configuración de Cloudinary
cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET,
)

router = APIRouter(tags=["videos"], prefix="/videos")


@router.post("/upload/{tecnica_id}")
async def upload_video(tecnica_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    """Sube un video a Cloudinary y lo asocia a una técnica existente."""
    try:
        # Verificar si la técnica existe
        tecnica = db.query(TecnicaAfrontamiento).filter(TecnicaAfrontamiento.id == tecnica_id).first()
        if not tecnica:
            raise HTTPException(status_code=404, detail="Técnica no encontrada")

        # Subir el video a Cloudinary
        upload_result = cloudinary.uploader.upload(file.file, resource_type="video")

        # Guardar la URL en el campo 'video'
        video_url = upload_result.get("secure_url")
        tecnica.video = video_url
        db.commit()
        db.refresh(tecnica)

        return {
            "mensaje": "Video subido correctamente",
            "tecnica_id": tecnica.id,
            "video": tecnica.video
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al subir video: {str(e)}")
# Todo ese archivo realizado por douglas   