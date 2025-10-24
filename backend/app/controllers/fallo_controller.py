# app/routers/fallos.py
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.dtos.fallo_dtos import FalloCreateDTO, FalloResponseDTO
from app.services.fallo_service import fallo_service
from fastapi import HTTPException

router = APIRouter(prefix="/fallos", tags=["Fallos"])

@router.post("/", status_code=status.HTTP_201_CREATED)
def registrar_fallo(dto: FalloCreateDTO, db: Session = Depends(get_db)):
    """
    Registra una nueva recaída o fallo para una promesa.
    Responde un objeto con:
      - fallo: el registro creado
      - promesa: la promesa actualizada
      - progreso: objeto con fallosHoy, fallosSemana, totalFallos, diasConsecutivos, limiteSuperado
      - historialFallos: lista
    """
    resultado = fallo_service.registrar_fallo(db, dto)
    # Mapear respuesta para que el frontend tenga la estructura esperada
    fallo = resultado["fallo"]
    promesa = resultado["promesa"]
    progreso = resultado["progreso"]
    historial = resultado["historialFallos"]

    # Construcción de la respuesta (puedes ajustar campos que quieres exponer)
    return {
        "fallo": {
            "id": fallo.id,
            "promesa_id": fallo.promesa_id,
            "descripcion": fallo.descripcion,
            "fecha": fallo.fecha_registro
        },
        "promesa": {
            "id": promesa.id,
            "titulo": promesa.titulo,
            "estado": "Finalizada" if promesa.cumplida else "En progreso",
            "num_maximo_recaidas": promesa.num_maximo_recaidas
        },
        "progreso": progreso,
        "historialFallos": historial
    }

@router.get("/{promesa_id}", response_model=List[FalloResponseDTO])
def listar_fallos_promesa(promesa_id: int, db: Session = Depends(get_db)):
    """
    Lista todos los fallos registrados para una promesa.
    """
    fallos = fallo_service.listar_fallos_por_promesa(db, promesa_id)
    # Mapear fecha_registro -> fecha en DTO: Pydantic orm_mode y alias hace parte de FalloResponseDTO
    # pero fallo model field se llama fecha_registro; Pydantic espera 'fecha'. Aquí devolvemos campos directos:
    return [
        {
            "id": f.id,
            "promesa_id": f.promesa_id,
            "descripcion": f.descripcion,
            "fecha": f.fecha_registro
        }
        for f in fallos
    ]

@router.delete("/{fallo_id}")
def eliminar_fallo(fallo_id: int, db: Session = Depends(get_db)):
    return fallo_service.eliminar_fallo(db, fallo_id)
