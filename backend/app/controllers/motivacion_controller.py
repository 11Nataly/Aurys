from fastapi import APIRouter, Depends, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.services.motivacion_service import MotivacionService
from app.dtos.motivacion_dto import MotivacionCreateDTO, MotivacionUpdateDTO, MotivacionResponseDTO

router = APIRouter(
    prefix="/motivaciones",
    tags=["Motivaciones"]
)


# ✅ GET - Listar motivaciones activas por usuario
@router.get("/listar/{usuario_id}", response_model=List[MotivacionResponseDTO])
def listar_motivaciones(usuario_id: int, db: Session = Depends(get_db)):
    return MotivacionService.listar_por_usuario(usuario_id, db)


# ✅ POST - Agregar nueva motivación
@router.post("/agregar", response_model=MotivacionResponseDTO)
def agregar_motivacion(
    titulo: str = Form(...),
    descripcion: str = Form(...),
    categoria_id: int = Form(...),
    usuario_id: int = Form(...),
    imagen: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    """
    Crea una nueva motivación (opcionalmente con imagen).
    """
    dto = MotivacionCreateDTO(
        titulo=titulo,
        descripcion=descripcion,
        categoria_id=categoria_id,
        usuario_id=usuario_id
    )
    return MotivacionService.agregar(db, dto, imagen)


# ✅ PUT - Cambiar favorita
@router.put("/{motivacion_id}/favorita", response_model=dict)
def cambiar_favorita(
    motivacion_id: int,
    favorita: bool | None = None,
    db: Session = Depends(get_db)
):
    """
    Cambia el estado de 'favorita' de una motivación (toggle o asignación directa).
    """
    return MotivacionService.cambiar_favorita(db, motivacion_id, favorita)


# ✅ PUT - Editar texto (sin imagen)
@router.put("/{motivacion_id}/editar", response_model=MotivacionResponseDTO)
def editar_motivacion(
    motivacion_id: int,
    dto: MotivacionUpdateDTO,
    db: Session = Depends(get_db)
):
    """
    Edita los campos de texto de una motivación (título, descripción, categoría).
    """
    return MotivacionService.editar(db, motivacion_id, dto)


# ✅ PUT - Cambiar estado (activo/inactivo)
@router.put("/{motivacion_id}/estado", response_model=MotivacionResponseDTO)
def cambiar_estado(
    motivacion_id: int,
    estado: bool,
    db: Session = Depends(get_db)
):
    """
    Cambia el estado activo/inactivo de una motivación.
    """
    # ✅ Orden de parámetros corregido
    return MotivacionService.cambiar_estado(motivacion_id, estado, db)


# ✅ PUT - Editar solo la imagen
@router.put("/{motivacion_id}/editar-imagen", response_model=MotivacionResponseDTO)
def editar_imagen_motivacion(
    motivacion_id: int,
    imagen: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    Reemplaza solo la imagen asociada a una motivación.
    """
    return MotivacionService.editar_imagen(db, motivacion_id, imagen)


# ✅ DELETE - Eliminar una motivación (definitivamente)
@router.delete("/{motivacion_id}")
def eliminar_motivacion(
    motivacion_id: int,
    db: Session = Depends(get_db)
):
    """
    Elimina una motivación permanentemente sin afectar su categoría.
    """
    return MotivacionService.eliminar_motivacion(db, motivacion_id)
