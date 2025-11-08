from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.services.papelera_service import PapeleraService

router = APIRouter(prefix="/papelera", tags=["Papelera"])

@router.get("/promesas/{usuario_id}")
def listar_promesas_papelera(usuario_id: int, db: Session = Depends(get_db)):
    promesas = PapeleraService.obtener_promesas_papelera(db, usuario_id)
    return promesas

@router.get("/diario/{usuario_id}")
def listar_notas_papelera(usuario_id: int, db: Session = Depends(get_db)):
    notas = PapeleraService.obtener_notas_papelera(db, usuario_id)
    return notas

@router.get("/motivaciones/{usuario_id}")
def listar_motivaciones_papelera(usuario_id: int, db: Session = Depends(get_db)):
    motivaciones = PapeleraService.obtener_motivaciones_papelera(db, usuario_id)
    return motivaciones

@router.get("/categorias/{usuario_id}")
def listar_categorias_papelera(usuario_id: int, db: Session = Depends(get_db)):
    categorias = PapeleraService.obtener_categorias_papelera(db, usuario_id)
    return categorias

@router.put("/restaurar/{tipo}/{id}")
def restaurar_elemento(tipo: str, id: int, db: Session = Depends(get_db)):
    elemento = PapeleraService.restaurar_elemento(db, tipo, id)
    if not elemento:
        raise HTTPException(status_code=404, detail="Elemento no encontrado o tipo inválido")
    return elemento

@router.delete("/eliminar/{tipo}/{id}")
def eliminar_definitivo(tipo: str, id: int, db: Session = Depends(get_db)):
    result = PapeleraService.eliminar_definitivo(db, tipo, id)
    if not result:
        raise HTTPException(status_code=404, detail="Elemento no encontrado o tipo inválido")
    return result
