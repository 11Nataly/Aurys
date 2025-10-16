from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.motivacion import Motivacion
from app.dtos.motivacion_dto import MotivacionCreateDTO, MotivacionUpdateDTO

class MotivacionService:

    @staticmethod
    def listar_por_usuario(usuario_id: int, db: Session):
        """Listar todas las motivaciones activas de un usuario"""
        return db.query(Motivacion).filter(
            Motivacion.usuario_id == usuario_id,
            Motivacion.activo == True
        ).all()

    @staticmethod
    def agregar(dto: MotivacionCreateDTO, db: Session):
        """Agregar una nueva motivación (sin imagen, solo JSON)"""
        nueva = Motivacion(
            titulo=dto.titulo,
            descripcion=dto.descripcion,
            categoria_id=dto.id_categoria,
            usuario_id=dto.id_usuario,
            activo=True
        )
        db.add(nueva)
        db.commit()
        db.refresh(nueva)
        return nueva

    @staticmethod
    def cambiar_favorito(motivacion_id: int, db: Session):
        """Alternar entre favorita y no favorita (similar a me gusta/no me gusta)"""
        motivacion = db.query(Motivacion).filter(Motivacion.id == motivacion_id).first()
        if not motivacion:
            raise HTTPException(status_code=404, detail="Motivación no encontrada")

        motivacion.esFavorita = not motivacion.esFavorita
        db.commit()
        db.refresh(motivacion)
        return motivacion

    @staticmethod
    def editar(motivacion_id: int, dto: MotivacionUpdateDTO, db: Session):
        """Editar campos de la motivación"""
        motivacion = db.query(Motivacion).filter(Motivacion.id == motivacion_id).first()
        if not motivacion:
            raise HTTPException(status_code=404, detail="Motivación no encontrada")

        if dto.titulo is not None:
            motivacion.titulo = dto.titulo
        if dto.descripcion is not None:
            motivacion.descripcion = dto.descripcion
        if dto.id_categoria is not None:
            motivacion.categoria_id = dto.id_categoria

        db.commit()
        db.refresh(motivacion)
        return motivacion

    @staticmethod
    def cambiar_estado(motivacion_id: int, estado: bool, db: Session):
        """Cambiar estado activo/inactivo"""
        motivacion = db.query(Motivacion).filter(Motivacion.id == motivacion_id).first()
        if not motivacion:
            raise HTTPException(status_code=404, detail="Motivación no encontrada")

        motivacion.activo = estado
        db.commit()
        db.refresh(motivacion)
        return motivacion
