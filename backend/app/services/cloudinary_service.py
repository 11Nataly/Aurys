import cloudinary
import cloudinary.uploader
from app.core.config import settings

# Configuración de Cloudinary
cloudinary.config( 
    cloud_name = settings.CLOUDINARY_CLOUD_NAME, 
    api_key = settings.CLOUDINARY_API_KEY, 
    api_secret = settings.CLOUDINARY_API_SECRET,
    secure=True
)# Todo ese archivo realizado por douglas   

def upload_video(file_path: str):
    """Sube un video a Cloudinary y devuelve la URL segura."""
    result = cloudinary.uploader.upload(
        file_path,
        resource_type="video"  # 👈 necesario para videos
    )
    return result.get("secure_url")
