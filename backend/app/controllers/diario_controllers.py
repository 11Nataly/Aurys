from fastapi import APIRouter, Depends, status
from typing import List
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.dtos.diario_dto import (
    AgregarDiarioDtos,
    EditarDiarioDto,
    DiarioResponde,
    NotaDiarioResponse
)
from app.services.diario_service import (
    crear_diario,
    obtener_notas_por_usuario,
    obtener_notas_papelera,
    editar_diario,
    mover_a_papelera,
    eliminar_diario
)

router = APIRouter(
    prefix="/diario",
    tags=["Diario"]
)

# Crear Diario
@router.post("/crear", response_model=DiarioResponde, status_code=status.HTTP_201_CREATED)
def crear_diario_endpoint(dto: AgregarDiarioDtos, db: Session = Depends(get_db)):
    return crear_diario(db, dto)


# Obtener notas activas por usuario
@router.get("/usuario/{usuario_id}", response_model=List[NotaDiarioResponse])
def get_notas_por_usuario(usuario_id: int, db: Session = Depends(get_db)):
    return obtener_notas_por_usuario(usuario_id, db)


# Obtener notas en papelera
@router.get("/papelera/{usuario_id}", response_model=List[NotaDiarioResponse])
def get_notas_papelera(usuario_id: int, db: Session = Depends(get_db)):
    return obtener_notas_papelera(usuario_id, db)


# Editar nota
@router.put("/editar/{id}", response_model=NotaDiarioResponse)
def editar_diario_endpoint(id: int, dto: EditarDiarioDto, db: Session = Depends(get_db)):
    return editar_diario(id, dto, db)


# Mover a papelera (PUT cambia activo=False)
@router.put("/mover_papelera/{id}", response_model=NotaDiarioResponse)
def mover_a_papelera_endpoint(id: int, db: Session = Depends(get_db)):
    return mover_a_papelera(id, db)


# Eliminar definitivamente
@router.delete("/eliminar/{id}")
def eliminar_diario_endpoint(id: int, db: Session = Depends(get_db)):
    return eliminar_diario(id, db)
