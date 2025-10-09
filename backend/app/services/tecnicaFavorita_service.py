from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.tecnicaFavorita import TecnicaFavorita
from app.dtos.tecnica_favorita_dto import TecnicaFavoritaCreate
from app.models.tecnicaafrontamiento import TecnicaAfrontamiento


def marcar_favorita(db: Session, favorita: TecnicaFavoritaCreate):
    """
    Marca una técnica como favorita para un usuario.
    """
    # Validar si ya existe
    existe = db.query(TecnicaFavorita).filter_by(
        usuario_id=favorita.usuario_id,
        tecnica_id=favorita.tecnica_id
    ).first()

    if existe:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="La técnica ya está marcada como favorita."
        )
    
    nueva = TecnicaFavorita(
        usuario_id=favorita.usuario_id,
        tecnica_id=favorita.tecnica_id
    )
    db.add(nueva)
    db.commit()
    db.refresh(nueva)
    return nueva


def quitar_favorita(db: Session, usuario_id: int, tecnica_id: int):
    """
    Quita una técnica de favoritos para un usuario.
    """
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
    """
    Retorna las técnicas que el usuario marcó como favoritas,
    haciendo JOIN con TecnicaAfrontamiento.
    """
    return (
        db.query(TecnicaAfrontamiento)
        .join(TecnicaFavorita, TecnicaFavorita.tecnica_id == TecnicaAfrontamiento.id)
        .filter(TecnicaFavorita.usuario_id == usuario_id)
        .all()
    )