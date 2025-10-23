from sqlalchemy.orm import Session
from sqlalchemy import func, cast, Date
from fastapi import HTTPException
from app.models.promesa import Promesa
from app.dtos.promesa_dtos import (
    PromesaCreateDTO, PromesaUpdateDTO, PromesaPapeleraDTO
)

class PromesaService:
    @staticmethod
    def _estado_logico(promesa: Promesa) -> str:
        """Determina el estado visible de la promesa."""
        if not promesa.activo:
            return "En papelera"
        elif promesa.cumplida:
            return "Finalizada"
        return "En progreso"

    @staticmethod
    def listar_activas_por_usuario(db: Session, usuario_id: int):
        promesas = db.query(Promesa).filter(
            Promesa.usuario_id == usuario_id,
            Promesa.activo == True
        ).order_by(Promesa.created_at.desc()).all()
        for p in promesas:
            p.estado = PromesaService._estado_logico(p)
        return promesas

    @staticmethod
    def listar_papelera_por_usuario(db: Session, usuario_id: int):
        promesas = db.query(Promesa).filter(
            Promesa.usuario_id == usuario_id,
            Promesa.activo == False
        ).order_by(Promesa.updated_at.desc()).all()
        for p in promesas:
            p.estado = PromesaService._estado_logico(p)
        return promesas

    @staticmethod
    def crear_promesa(db: Session, dto: PromesaCreateDTO):
        nueva = Promesa(
            usuario_id=dto.usuario_id,
            titulo=dto.titulo,
            descripcion=dto.descripcion,
            tipo_frecuencia=dto.tipo_frecuencia,
            num_maximo_recaidas=dto.num_maximo_recaidas,
            fecha_fin=dto.fecha_fin,
            activo=dto.activo if dto.activo is not None else True,
            cumplida=dto.cumplida if dto.cumplida is not None else False
        )
        db.add(nueva)
        db.commit()
        db.refresh(nueva)
        nueva.estado = PromesaService._estado_logico(nueva)
        return nueva

    @staticmethod
    def actualizar_promesa(db: Session, promesa_id: int, dto: PromesaUpdateDTO):
        promesa = db.query(Promesa).filter(Promesa.id == promesa_id).first()
        if not promesa:
            raise HTTPException(status_code=404, detail="Promesa no encontrada")
        for field, value in dto.dict(exclude_unset=True).items():
            setattr(promesa, field, value)
        db.commit()
        db.refresh(promesa)
        promesa.estado = PromesaService._estado_logico(promesa)
        return promesa

    @staticmethod
    def cambiar_papelera(db: Session, promesa_id: int, dto: PromesaPapeleraDTO):
        promesa = db.query(Promesa).filter(Promesa.id == promesa_id).first()
        if not promesa:
            raise HTTPException(status_code=404, detail="Promesa no encontrada")
        promesa.activo = dto.activo
        db.commit()
        db.refresh(promesa)
        promesa.estado = PromesaService._estado_logico(promesa)
        return promesa

    @staticmethod
    def marcar_cumplida(db: Session, promesa_id: int, cumplida: bool):
        promesa = db.query(Promesa).filter(Promesa.id == promesa_id).first()
        if not promesa:
            raise HTTPException(status_code=404, detail="Promesa no encontrada")
        promesa.cumplida = cumplida
        db.commit()
        db.refresh(promesa)
        promesa.estado = PromesaService._estado_logico(promesa)
        return promesa

    @staticmethod
    def eliminar_definitivo(db: Session, promesa_id: int):
        promesa = db.query(Promesa).filter(Promesa.id == promesa_id).first()
        if not promesa:
            raise HTTPException(status_code=404, detail="Promesa no encontrada")
        db.delete(promesa)
        db.commit()
        return {"mensaje": "Promesa eliminada permanentemente"}
