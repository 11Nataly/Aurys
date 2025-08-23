from sqlalchemy.orm import Session
from app.models.tecnicaafrontamiento import TecnicaAfrontamiento
from app.dtos.tecnica_dto import TecnicaUpdateVideoDTO

def actualizar_video_tecnica(db: Session, tecnica_id: int, tecnica_dto: TecnicaUpdateVideoDTO):
    """
    Actualiza solo el campo 'video' de una técnica de afrontamiento.
    """
    tecnica = db.query(TecnicaAfrontamiento).filter(
        TecnicaAfrontamiento.id == tecnica_id
    ).first()

    if not tecnica:
        return None  # No se encontró la técnica

    # Actualizar el campo video
    tecnica.video = tecnica_dto.video

    db.commit()
    db.refresh(tecnica)

    return tecnica
