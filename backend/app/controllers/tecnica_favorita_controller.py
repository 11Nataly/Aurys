from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List

from app.db.database import get_db
from app.dtos.tecnica_favorita_dto import TecnicaFavoritaCreate, TecnicaFavoritaResponse
from app.services.tecnicaFavorita_service import (
    marcar_favorita,
    quitar_favorita,
    listar_favoritas
)
from app.services.subir_tecnica import simplificar_duracion  # Importar la función

router = APIRouter(
    prefix="/favoritos",
    tags=["Favoritos"]
)

# ----------------------
# Agregar técnica favorita
# ----------------------
@router.post("/", status_code=status.HTTP_201_CREATED)
def agregar_favorito(
    favorita: TecnicaFavoritaCreate,
    db: Session = Depends(get_db)
):
    nueva = marcar_favorita(db, favorita)
    return {
        "message": "Técnica marcada como favorita",
        "usuario_id": nueva.usuario_id,
        "tecnica_id": nueva.tecnica_id
    }


# ----------------------
# Eliminar técnica favorita
# ----------------------
@router.delete("/", status_code=status.HTTP_200_OK)
def eliminar_favorito(
    usuario_id: int,
    tecnica_id: int,
    db: Session = Depends(get_db)
):
    quitar_favorita(db, usuario_id, tecnica_id)
    return {
        "message": "Técnica eliminada de favoritos",
        "usuario_id": usuario_id,
        "tecnica_id": tecnica_id
    }


# ----------------------
# Listar técnicas favoritas
# ----------------------
@router.get("/filtrarFavoritas", response_model=List[TecnicaFavoritaResponse])
def listar_favoritas_endpoint(
    usuario_id: int,
    db: Session = Depends(get_db)
):
    tecnicas = listar_favoritas(db, usuario_id)
    return [
        TecnicaFavoritaResponse(
            tecnica_id=t.id,
            usuario_id=usuario_id,
            nombre=t.nombre,
            descripcion=t.descripcion,
            video=t.video,
            instruccion=t.instruccion,
            duracion_user=simplificar_duracion(t.duracion_video) if t.duracion_video else None,
            activo=t.activo
        )
        for t in tecnicas
    ]
