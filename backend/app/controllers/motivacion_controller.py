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
    id_categoria: int = Form(...),
    id_usuario: int = Form(...),
    imagen: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    dto = MotivacionCreateDTO(
        titulo=titulo,
        descripcion=descripcion,
        categoria_id=id_categoria,
        usuario_id=id_usuario
    )
    return MotivacionService.agregar(db, dto, imagen)


# ✅ PUT - Cambiar favorita
@router.put("/{motivacion_id}/favorita", response_model=dict)
def cambiar_favorita(
    motivacion_id: int,
    favorita: bool | None = None,
    db: Session = Depends(get_db)
):
    return MotivacionService.cambiar_favorita(db, motivacion_id, favorita)


# ✅ PUT - Editar (sin imagen)
@router.put("/{motivacion_id}/editar", response_model=MotivacionResponseDTO)
def editar_motivacion(
    motivacion_id: int,
    dto: MotivacionUpdateDTO,
    db: Session = Depends(get_db)
):
    return MotivacionService.editar(motivacion_id, dto, db)


# ✅ PUT - Cambiar estado
@router.put("/{motivacion_id}/estado", response_model=MotivacionResponseDTO)
def cambiar_estado(motivacion_id: int, estado: bool, db: Session = Depends(get_db)):
    return MotivacionService.cambiar_estado(motivacion_id, estado, db)
# Todo ese archivo realizado por douglas   