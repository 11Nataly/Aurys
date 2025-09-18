from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.tecnicaFavorita import TecnicaFavorita
from app.dtos.tecnica_favorita_dto import TecnicaFavoritaCreate

def marcar_favorita(db: Session, favorita: TecnicaFavoritaCreate, usuario_id: int):
    # Validar si ya existe
    existe = db.query(TecnicaFavorita).filter_by(
        usuario_id=usuario_id, #toma el id del usuario del token
        tecnica_id=favorita.tecnica_id
    ).first()
    if existe:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="La técnica ya está marcada como favorita."
        )
    
    nueva = TecnicaFavorita(
        usuario_id=usuario_id,
        tecnica_id=favorita.tecnica_id
    )
    db.add(nueva)
    db.commit()
    db.refresh(nueva)
    return nueva


def quitar_favorita(db: Session, usuario_id: int, tecnica_id: int):
    favorita = db.query(TecnicaFavorita).filter_by(
        usuario_id=usuario_id,
        tecnica_id=tecnica_id
    ).first()
    if not favorita:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="La técnica no está marcada como favorita."
        )
    db.delete(favorita)
    db.commit()
    return {"message": "Técnica eliminada de favoritos."}


def listar_favoritas(db: Session, usuario_id: int):
    return db.query(TecnicaFavorita).filter_by(usuario_id=usuario_id).all()
