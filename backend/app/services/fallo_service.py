# app/services/fallo_service.py
from sqlalchemy.orm import Session
from fastapi import HTTPException
from datetime import date, datetime
from app.models.fallo import Fallo
from app.models.promesa import Promesa
from app.dtos.fallo_dtos import FalloCreateDTO
from app.services.helpers import (
    count_fallos_in_period, start_of_week, listar_historial, dias_consecutivos_sin_fallo
)
from sqlalchemy import cast, Date

class FalloService:
    @staticmethod
    def registrar_fallo(db: Session, dto: FalloCreateDTO):
        promesa = db.query(Promesa).filter(
            Promesa.id == dto.promesa_id,
            Promesa.activo == True
        ).first()

        if not promesa:
            raise HTTPException(status_code=404, detail="Promesa no encontrada o desactivada")

        # Crear nuevo fallo
        nuevo = Fallo(
            promesa_id=promesa.id,
            descripcion=dto.descripcion
        )
        db.add(nuevo)
        db.commit()
        db.refresh(nuevo)

        # Recalcular progreso tras agregar el fallo
        hoy = date.today()
        if promesa.tipo_frecuencia == 'Diario':
            period_start, period_end = hoy, hoy
        elif promesa.tipo_frecuencia == 'Semanal':
            period_start = start_of_week(hoy)
            period_end = hoy
        else:
            period_start = promesa.fecha_inicio or hoy
            period_end = promesa.fecha_fin or hoy

        fallos_periodo = count_fallos_in_period(db, promesa.id, period_start, period_end)
        total_fallos = db.query(Fallo).filter(Fallo.promesa_id == promesa.id).count()

        # Determinar si se supera el límite (interpretamos num_maximo_recaidas como límite por periodo segun frecuencia)
        limite = promesa.num_maximo_recaidas
        limite_superado = False
        if limite is not None:
            if promesa.tipo_frecuencia == 'Diario' or promesa.tipo_frecuencia == 'Semanal':
                if fallos_periodo > limite:
                    limite_superado = True
            else:
                if total_fallos > limite:
                    limite_superado = True

        # Si el límite se superó, marcamos la promesa como finalizada (cumplida = True)
        if limite_superado:
            promesa.cumplida = True
            db.add(promesa)
            db.commit()
            db.refresh(promesa)

        # Construir respuesta combinada: fallo + estado del progreso
        progreso = {
            "fallosHoy": count_fallos_in_period(db, promesa.id, hoy, hoy),
            "fallosSemana": count_fallos_in_period(db, promesa.id, start_of_week(hoy), hoy),
            "totalFallos": total_fallos,
            "diasConsecutivos": dias_consecutivos_sin_fallo(db, promesa.id, hoy),
            "limiteSuperado": limite_superado
        }

        historial = listar_historial(db, promesa.id, limit=50)

        # Construimos un dict con la info para que el router pueda devolverlo o el controller
        return {
            "fallo": nuevo,
            "promesa": promesa,
            "progreso": progreso,
            "historialFallos": historial
        }

    @staticmethod
    def listar_fallos_por_promesa(db: Session, promesa_id: int):
        promesa = db.query(Promesa).filter(Promesa.id == promesa_id).first()
        if not promesa:
            raise HTTPException(status_code=404, detail="Promesa no encontrada")
        fallos = db.query(Fallo).filter(Fallo.promesa_id == promesa_id).order_by(Fallo.fecha_registro.desc()).all()
        return fallos

    @staticmethod
    def eliminar_fallo(db: Session, fallo_id: int):
        fallo = db.query(Fallo).filter(Fallo.id == fallo_id).first()
        if not fallo:
            raise HTTPException(status_code=404, detail="Fallo no encontrado")
        db.delete(fallo)
        db.commit()
        return {"mensaje": "Fallo eliminado correctamente"}
# Todo ese archivo realizado por douglas   
fallo_service = FalloService()
