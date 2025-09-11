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