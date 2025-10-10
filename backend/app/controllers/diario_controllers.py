from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile

from typing import List

from sqlalchemy.orm import Session
from app.db.database import get_db
from app.dtos.diario_dto import (
    AgregarDiarioDtos,
    DiarioResponde,
    NotaDiarioBase,
    NotaDiarioResponse
    

    

)
from app.services.diario_service import (

    crear_diario,
    obtener_notas_por_usuario

)



router = APIRouter(
    prefix="/diario",
    tags=["Diario"]
)

#---------------------
# Crear Diario
#---------------------


@router.post("/crear_diario", response_model=DiarioResponde, status_code=status.HTTP_201_CREATED)
def crear_diario_endpoint(dto: AgregarDiarioDtos, db:Session = Depends(get_db)):
    return crear_diario(db,dto)

#---------------------

@router.get("/Nota_diario_usuario/{usuario_id}", response_model=List[NotaDiarioResponse])
def get_notas_por_usuario(usuario_id: int, db: Session = Depends(get_db)):
    """
    Endpoint para obtener todas las notas activas de un usuario.
    """
    return obtener_notas_por_usuario(usuario_id, db)

