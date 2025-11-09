from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.models.notadiario import NotaDiario
from app.dtos.diario_dto import AgregarDiarioDtos, EditarDiarioDto


# Crear nota
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


# Obtener notas activas
def obtener_notas_por_usuario(usuario_id: int, db: Session):
    notas = (
        db.query(NotaDiario)
        .filter(NotaDiario.usuario_id == usuario_id, NotaDiario.activo == True)
        .all()
    )
    if not notas:
        raise HTTPException(status_code=404, detail="No se encontraron notas activas para este usuario")
    return notas


# Obtener notas en papelera
def obtener_notas_papelera(usuario_id: int, db: Session):
    notas = (
        db.query(NotaDiario)
        .filter(NotaDiario.usuario_id == usuario_id, NotaDiario.activo == False)
        .all()
    )
    if not notas:
        raise HTTPException(status_code=404, detail="No hay notas en la papelera")
    return notas


# Editar nota
def editar_diario(id: int, dto: EditarDiarioDto, db: Session):
    nota = db.query(NotaDiario).filter(NotaDiario.id == id).first()
    if not nota:
        raise HTTPException(status_code=404, detail="Nota no encontrada")

    if dto.titulo is not None:
        nota.titulo = dto.titulo
    if dto.contenido is not None:
        nota.contenido = dto.contenido

    db.commit()
    db.refresh(nota)
    return nota


# Mover a papelera (PUT cambia activo=False)
def mover_a_papelera(id: int, db: Session):
    nota = db.query(NotaDiario).filter(NotaDiario.id == id).first()
    if not nota:
        raise HTTPException(status_code=404, detail="Nota no encontrada")

    nota.activo = False
    db.commit()
    db.refresh(nota)
    return nota


# Eliminar definitivamente
def eliminar_diario(id: int, db: Session):
    nota = db.query(NotaDiario).filter(NotaDiario.id == id).first()
    if not nota:
        raise HTTPException(status_code=404, detail="Nota no encontrada")

    db.delete(nota)
    db.commit()
    return {"mensaje": "Nota eliminada definitivamente"}
