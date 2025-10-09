from fastapi import HTTPException 
from sqlalchemy.orm import Session
from app.models.notadiario import NotaDiario
from app.dtos.diario_dto import AgregarDiarioDtos



def crear_diario(db: Session, dto: AgregarDiarioDtos):
    diario = NotaDiario( 
        usuario_id=dto.usuario_id, 
        titulo=dto.titulo,
        contenido=dto.contenido
    )
    db.add(diario)
    db.commit()
    db.refresh(diario)
    return diario

def obtener_notas_por_usuario(usuario_id: int, db: Session):
    """
    Retorna todas las notas activas del diario creadas por un usuario específico.
    """
    notas = (
        db.query(NotaDiario)
        .filter(
            NotaDiario.usuario_id == usuario_id,
            NotaDiario.activo == True
        )
        .all()
    )

    if not notas:
        raise HTTPException(status_code=404, detail="No se encontraron notas para este usuario")

    return notas