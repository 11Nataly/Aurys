# app/routers/promesas.py
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.dtos.promesa_dtos import (
    PromesaCreateDTO, PromesaResponseDTO, PromesaPapeleraDTO, PromesaUpdateDTO
)
from app.services.promesa_service import PromesaService

router = APIRouter(prefix="/promesas", tags=["Promesas"])


@router.get("/listar/{usuario_id}", response_model=List[dict])
def listar_promesas_activas(usuario_id: int, db: Session = Depends(get_db)):
    """
    Devuelve lista de promesas activas (ya con 'progreso' e 'historialFallos').
    Nota: response_model se deja como List[dict] para no complicar el mapeo Pydantic,
    el frontend recibirá la misma estructura que el fake JSON.
    """
    return PromesaService.listar_activas_por_usuario(db, usuario_id)


@router.get("/papelera/{usuario_id}", response_model=List[dict])
def listar_promesas_papelera(usuario_id: int, db: Session = Depends(get_db)):
    return PromesaService.listar_papelera_por_usuario(db, usuario_id)


@router.post("/agregar", status_code=status.HTTP_201_CREATED)
def crear_promesa(dto: PromesaCreateDTO, db: Session = Depends(get_db)):
    return PromesaService.crear_promesa(db, dto)


@router.put("/{promesa_id}")
def actualizar_promesa(promesa_id: int, dto: PromesaUpdateDTO, db: Session = Depends(get_db)):
    return PromesaService.actualizar_promesa(db, promesa_id, dto)


@router.put("/{promesa_id}/papelera")
def cambiar_papelera(promesa_id: int, dto: PromesaPapeleraDTO, db: Session = Depends(get_db)):
    return PromesaService.cambiar_papelera(db, promesa_id, dto)


@router.put("/{promesa_id}/cumplida")
def marcar_cumplida(promesa_id: int, cumplida: bool, db: Session = Depends(get_db)):
    return PromesaService.marcar_cumplida(db, promesa_id, cumplida)


@router.delete("/{promesa_id}", status_code=200)
def eliminar_promesa(promesa_id: int, db: Session = Depends(get_db)):
    return PromesaService.eliminar_definitivo(db, promesa_id)
# Todo ese archivo realizado por douglas   