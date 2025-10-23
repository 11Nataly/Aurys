# app/controllers/motivacion_controller.py
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.services.motivacion_service import MotivacionService
from app.dtos.motivacion_dto import (
    MotivacionCreateDTO,
    MotivacionUpdateDTO,
    MotivacionResponseDTO
)

router = APIRouter(
    prefix="/motivaciones",
    tags=["Motivaciones"]
)


# -------------------------------------------------------
# ✅ GET - Listar motivaciones activas por usuario
# -------------------------------------------------------
@router.get("/listar/{usuario_id}", response_model=List[MotivacionResponseDTO])
def listar_motivaciones(usuario_id: int, db: Session = Depends(get_db)):
    """
    Lista todas las motivaciones activas de un usuario.
    Si la motivación está inactiva (activo = 0), no se muestra.
    """
    return MotivacionService.listar_por_usuario(usuario_id, db)


# -------------------------------------------------------
# ✅ POST - Agregar nueva motivación con imagen opcional
# -------------------------------------------------------
@router.post("/agregar", response_model=MotivacionResponseDTO)
def agregar_motivacion(
    titulo: str = Form(...),
    descripcion: str = Form(...),
    id_categoria: int = Form(...),
    id_usuario: int = Form(...),
    imagen: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    """
    Agrega una nueva motivación con formato multipart/form-data.
    Ejemplo de cuerpo (form-data):
    - titulo: "Mi primera motivación"
    - descripcion: "Logré algo importante"
    - id_categoria: 1
    - id_usuario: 2
    - imagen: archivo.jpg (opcional)
    """
    dto = MotivacionCreateDTO(
        titulo=titulo,
        descripcion=descripcion,
        id_categoria=id_categoria,
        id_usuario=id_usuario
    )
    return MotivacionService.agregar(db, dto, imagen)


# -------------------------------------------------------
# ✅ PUT - Alternar “me gusta / no me gusta” (favorita)
# -------------------------------------------------------
@router.put("/{id}/favorita", response_model=dict)
def cambiar_favorita(
    id: int,
    favorita: bool | None = None,
    db: Session = Depends(get_db)
):
    """
    Cambia el estado de 'esFavorito' (corazón).
    - Si no se envía 'favorita', alterna automáticamente.
    - Si se envía 'favorita=true' o 'favorita=false', lo actualiza según el valor.
    """
    return MotivacionService.cambiar_favorita(db, id, favorita)


# -------------------------------------------------------
# ✅ PUT - Editar motivación (solo texto)
# -------------------------------------------------------
@router.put("/{motivacion_id}/editar", response_model=MotivacionResponseDTO)
def editar_motivacion(
    motivacion_id: int,
    dto: MotivacionUpdateDTO,
    db: Session = Depends(get_db)
):
    """
    Edita el título, descripción o categoría de una motivación.
    """
    return MotivacionService.editar(motivacion_id, dto, db)


# -------------------------------------------------------
# ✅ PUT - Cambiar estado (activar/desactivar)
# -------------------------------------------------------
@router.put("/{motivacion_id}/estado", response_model=MotivacionResponseDTO)
def cambiar_estado(motivacion_id: int, estado: bool, db: Session = Depends(get_db)):
    """
    Cambia el estado activo/inactivo de la motivación.
    """
    return MotivacionService.cambiar_estado(motivacion_id, estado, db)