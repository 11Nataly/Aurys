from app.core.deps import get_current_user # para obtener el usuario del token
from app.models.usuario import Usuario #para que reconozca el usuario
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.db.database import get_db
from app.dtos.tecnica_favorita_dto import TecnicaFavoritaCreate, TecnicaFavoritaResponse
from app.services.tecnicaFavorita_service import (
    marcar_favorita,
    quitar_favorita,
    listar_favoritas
)

router = APIRouter(
    prefix="/favoritos",
    tags=["Favoritos"]
)

@router.post("/", response_model=TecnicaFavoritaResponse)
def agregar_favorito(favorita: TecnicaFavoritaCreate, db: Session = Depends(get_db),
                     current_user: Usuario = Depends(get_current_user)):
    return marcar_favorita(db, favorita, current_user.id)


@router.delete("/{tecnica_id}")
def eliminar_favorito(
    tecnica_id: int,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    return quitar_favorita(db, current_user.id, tecnica_id)


@router.get("/", response_model=List[TecnicaFavoritaResponse])
def obtener_favoritos(
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    return listar_favoritas(db, current_user.id)
