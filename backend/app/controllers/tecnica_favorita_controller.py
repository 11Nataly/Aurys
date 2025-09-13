from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.db.database import get_db
from app.dtos.tecnica_favorita_dto import TecnicaFavoritaCreate, TecnicaFavoritaResponse
from app.services.tecnicaFavorita_service import (
    marcar_favorita,
    quitar_favorita,
    listar_favoritas,
)

router = APIRouter(
    prefix="/favoritos",
    tags=["Favoritos"]
)

@router.post("/", response_model=TecnicaFavoritaResponse)
def agregar_favorito(favorita: TecnicaFavoritaCreate, db: Session = Depends(get_db)):
    return marcar_favorita(db, favorita)


@router.delete("/{usuario_id}/{tecnica_id}")
def eliminar_favorito(usuario_id: int, tecnica_id: int, db: Session = Depends(get_db)):
    return quitar_favorita(db, usuario_id, tecnica_id)


@router.get("/{usuario_id}", response_model=List[TecnicaFavoritaResponse])
def obtener_favoritos(usuario_id: int, db: Session = Depends(get_db)):
    return listar_favoritas(db, usuario_id)
