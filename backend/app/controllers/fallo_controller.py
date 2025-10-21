from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.db.database import get_db
from app.dtos.fallo_dtos import FalloCreateDTO, FalloResponseDTO
from app.services.fallo_service import fallo_service

router = APIRouter(prefix="/fallos", tags=["Fallos"])

@router.post("/", response_model=FalloResponseDTO)
def registrar_fallo(dto: FalloCreateDTO, db: Session = Depends(get_db)):
    """
    Registra una nueva recaída o fallo para una promesa.
    """
    return fallo_service.registrar_fallo(db, dto)

@router.get("/{promesa_id}", response_model=List[FalloResponseDTO])
def listar_fallos_promesa(promesa_id: int, db: Session = Depends(get_db)):
    """
    Lista todos los fallos registrados para una promesa.
    """
    return fallo_service.listar_fallos_por_promesa(db, promesa_id)

@router.delete("/{fallo_id}")
def eliminar_fallo(fallo_id: int, db: Session = Depends(get_db)):
    """
    Elimina un fallo específico.
    """
    return fallo_service.eliminar_fallo(db, fallo_id)
