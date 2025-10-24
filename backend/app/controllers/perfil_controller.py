from fastapi import APIRouter, Depends, UploadFile, File, Form, Request, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.dtos.perfil_dto import PerfilUpdateDTO, PerfilResponseDTO
from app.services.perfil_service import PerfilService
import os

router = APIRouter(prefix="/perfil", tags=["Perfil"])

# ✅ Listar perfiles (usuarios con foto incluida)
@router.get("/listar", response_model=list[PerfilResponseDTO])
def get_perfiles(request: Request, db: Session = Depends(get_db)):
    return PerfilService.listar_perfiles(db, request)

# ✅ Actualizar información del perfil (nombre, correo, contraseña)
@router.put("/actualizar/{usuario_id}", response_model=PerfilResponseDTO)
def put_actualizar_perfil(usuario_id: int, dto: PerfilUpdateDTO, db: Session = Depends(get_db)):
    return PerfilService.actualizar_perfil(usuario_id, dto, db)

# ✅ Actualizar solo la foto de perfil
@router.put("/foto/{usuario_id}")
def put_actualizar_foto(
    usuario_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    request: Request = None
):
    return PerfilService.actualizar_foto_perfil(usuario_id, file, db, request)

# ✅ Actualizar perfil completo (nombre, correo, foto) vía FormData
@router.put("/editar/{usuario_id}")
async def put_editar_perfil(
    usuario_id: int,
    nombre: str = Form(...),
    correo: str = Form(...),
    foto: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    return await PerfilService.actualizar_perfil_completo(usuario_id, nombre, correo, foto, db)

# ✅ Servir imágenes desde uploads/fotos/
@router.get("/foto/mostrar/{nombre_archivo}")
def get_foto(nombre_archivo: str):
    file_path = os.path.join("uploads/fotos", nombre_archivo)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Archivo no encontrado")
    return FileResponse(file_path)
