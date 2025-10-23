from sqlalchemy.orm import Session
from fastapi import HTTPException
from sqlalchemy.sql import func
from app.models.fallo import Fallo
from app.models.promesa import Promesa
from app.dtos.fallo_dtos import FalloCreateDTO

class FalloService:
    @staticmethod
    def registrar_fallo(db: Session, dto: FalloCreateDTO):
        promesa = db.query(Promesa).filter(
            Promesa.id == dto.promesa_id,
            Promesa.activo == True
        ).first()

        if not promesa:
            raise HTTPException(status_code=404, detail="Promesa no encontrada o desactivada")

        # Contar fallos actuales
        total_fallos = db.query(Fallo).filter(Fallo.promesa_id == promesa.id).count()

        # Verificar si ya alcanzó el límite
        if promesa.num_maximo_recaidas is not None and total_fallos >= promesa.num_maximo_recaidas:
            promesa.estado = "Finalizada"
            db.commit()
            raise HTTPException(
                status_code=400,
                detail="Ya alcanzaste el número máximo de recaídas permitido para esta promesa."
            )

        # Registrar nuevo fallo
        nuevo_fallo = Fallo(
            promesa_id=promesa.id,
            descripcion=dto.descripcion
        )
        db.add(nuevo_fallo)

        # Si alcanzó el límite justo ahora → cambiar estado
        if promesa.num_maximo_recaidas is not None and total_fallos + 1 >= promesa.num_maximo_recaidas:
            promesa.estado = "Finalizada"

        db.commit()
        db.refresh(nuevo_fallo)
        db.refresh(promesa)
        return nuevo_fallo

    @staticmethod
    def listar_fallos_por_promesa(db: Session, promesa_id: int):
        promesa = db.query(Promesa).filter(Promesa.id == promesa_id).first()
        if not promesa:
            raise HTTPException(status_code=404, detail="Promesa no encontrada")
        fallos = db.query(Fallo).filter(Fallo.promesa_id == promesa_id).order_by(Fallo.fecha.desc()).all()
        return fallos

    @staticmethod
    def eliminar_fallo(db: Session, fallo_id: int):
        fallo = db.query(Fallo).filter(Fallo.id == fallo_id).first()
        if not fallo:
            raise HTTPException(status_code=404, detail="Fallo no encontrado")
        db.delete(fallo)
        db.commit()
        return {"mensaje": "Fallo eliminado correctamente"}

fallo_service = FalloService()
