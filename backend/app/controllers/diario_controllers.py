from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.dtos.diario_dto import (
    AgregarDiarioDtos,
    DiarioResponde
    

)
from app.services.diario_service import (
    crear_diario


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

