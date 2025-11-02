# app/services/promesa_service.py
from sqlalchemy.orm import Session
from sqlalchemy import func, cast, Date
from fastapi import HTTPException
from datetime import date
from app.models.promesa import Promesa
from app.models.fallo import Fallo
from app.dtos.promesa_dtos import (
    PromesaCreateDTO, PromesaUpdateDTO, PromesaPapeleraDTO
)
from app.services.helpers import (
    count_fallos_in_period, start_of_week, listar_historial, dias_consecutivos_sin_fallo
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
    def _construir_respuesta_promesa(db: Session, promesa: Promesa):
        """
        Construye la representación que espera el frontend (PromesaResponseDTO),
        calculando progreso e historial dinámicamente.
        """
        hoy = date.today()
        # Periodos
        fallosHoy = count_fallos_in_period(db, promesa.id, hoy, hoy)
        fallosSemana = count_fallos_in_period(db, promesa.id, start_of_week(hoy), hoy)
        totalFallos = db.query(Fallo).filter(Fallo.promesa_id == promesa.id).count()
        diasConsec = dias_consecutivos_sin_fallo(db, promesa.id, hoy)
        limiteSuperado = False
        limite = promesa.num_maximo_recaidas

        if limite is not None:
            if promesa.tipo_frecuencia == 'Diario':
                limiteSuperado = fallosHoy > limite
            elif promesa.tipo_frecuencia == 'Semanal':
                limiteSuperado = fallosSemana > limite
            else:
                limiteSuperado = totalFallos > limite

        progreso = {
            "fallosHoy": fallosHoy,
            "fallosSemana": fallosSemana,
            "totalFallos": totalFallos,
            "diasConsecutivos": diasConsec,
            "limiteSuperado": limiteSuperado
        }

        historial = listar_historial(db, promesa.id, limit=50)
# Todo ese archivo realizado por douglas   
        prom_dict = {
            "id": promesa.id,
            "usuario_id": promesa.usuario_id,
            "titulo": promesa.titulo,
            "descripcion": promesa.descripcion,
            "tipo_frecuencia": promesa.tipo_frecuencia,
            "num_maximo_recaidas": promesa.num_maximo_recaidas,
            "activo": promesa.activo,
            "cumplida": promesa.cumplida,
            "fecha_inicio": promesa.fecha_inicio.isoformat() if promesa.fecha_inicio else None,
            "fecha_fin": promesa.fecha_fin.isoformat() if promesa.fecha_fin else None,
            "created_at": promesa.created_at,
            "updated_at": promesa.updated_at,
            "estado": PromesaService._estado_logico(promesa),
            "progreso": progreso,
            "historialFallos": historial
        }
        return prom_dict

    @staticmethod
    def listar_activas_por_usuario(db: Session, usuario_id: int):
        promesas = db.query(Promesa).filter(
            Promesa.usuario_id == usuario_id,
            Promesa.activo == True
        ).order_by(Promesa.created_at.desc()).all()
        return [PromesaService._construir_respuesta_promesa(db, p) for p in promesas]

    @staticmethod
    def listar_papelera_por_usuario(db: Session, usuario_id: int):
        promesas = db.query(Promesa).filter(
            Promesa.usuario_id == usuario_id,
            Promesa.activo == False
        ).order_by(Promesa.updated_at.desc()).all()
        return [PromesaService._construir_respuesta_promesa(db, p) for p in promesas]

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
        return PromesaService._construir_respuesta_promesa(db, nueva)

    @staticmethod
    def actualizar_promesa(db: Session, promesa_id: int, dto: PromesaUpdateDTO):
        promesa = db.query(Promesa).filter(Promesa.id == promesa_id).first()
        if not promesa:
            raise HTTPException(status_code=404, detail="Promesa no encontrada")
        for field, value in dto.dict(exclude_unset=True).items():
            setattr(promesa, field, value)
        db.commit()
        db.refresh(promesa)
        return PromesaService._construir_respuesta_promesa(db, promesa)

    @staticmethod
    def cambiar_papelera(db: Session, promesa_id: int, dto: PromesaPapeleraDTO):
        promesa = db.query(Promesa).filter(Promesa.id == promesa_id).first()
        if not promesa:
            raise HTTPException(status_code=404, detail="Promesa no encontrada")
        promesa.activo = dto.activo
        db.commit()
        db.refresh(promesa)
        return PromesaService._construir_respuesta_promesa(db, promesa)

    @staticmethod
    def marcar_cumplida(db: Session, promesa_id: int, cumplida: bool):
        promesa = db.query(Promesa).filter(Promesa.id == promesa_id).first()
        if not promesa:
            raise HTTPException(status_code=404, detail="Promesa no encontrada")
        promesa.cumplida = cumplida
        db.commit()
        db.refresh(promesa)
        return PromesaService._construir_respuesta_promesa(db, promesa)

    @staticmethod
    def eliminar_definitivo(db: Session, promesa_id: int):
        promesa = db.query(Promesa).filter(Promesa.id == promesa_id).first()
        if not promesa:
            raise HTTPException(status_code=404, detail="Promesa no encontrada")
        db.delete(promesa)
        db.commit()
        return {"mensaje": "Promesa eliminada permanentemente"}
