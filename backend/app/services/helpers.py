# app/services/helpers.py
from datetime import datetime, date, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import func, cast, Date
from app.models.fallo import Fallo
from typing import Tuple, List, Dict

def start_of_week(today: date) -> date:
    # semana comienza el lunes
    return today - timedelta(days=today.weekday())

def count_fallos_in_period(db: Session, promesa_id: int, start_date: date, end_date: date) -> int:
    """
    Cuenta fallos entre start_date y end_date inclusive (usa date(fecha_registro)).
    """
    q = db.query(func.count(Fallo.id)).filter(
        Fallo.promesa_id == promesa_id,
        cast(Fallo.fecha_registro, Date) >= start_date,
        cast(Fallo.fecha_registro, Date) <= end_date
    )
    return q.scalar() or 0

def listar_historial(db: Session, promesa_id: int, limit: int = 50) -> List[Dict]:
    """
    Devuelve historial de fallos ordenados desc por fecha. Cada entrada es {fecha, hora, cantidad}
    Actualmente cada Fallo es 1 unidad; si quieres agrupar por fecha/hora, puedes adaptar.
    """
    fallos = db.query(Fallo).filter(Fallo.promesa_id == promesa_id).order_by(Fallo.fecha_registro.desc()).limit(limit).all()
    historial = []
    for f in fallos:
        fecha_str = f.fecha_registro.date().isoformat()
        hora_str = f.fecha_registro.time().strftime("%H:%M:%S")
        historial.append({
            "fecha": fecha_str,
            "hora": hora_str,
            "cantidad": 1  # cada registro representa un fallo unitario
        })
    return historial

def dias_consecutivos_sin_fallo(db: Session, promesa_id: int, fecha_hasta: date = None, max_days: int = 365) -> int:
    """
    Calcula cuántos días consecutivos hacia atrás (a partir de fecha_hasta, por defecto hoy)
    han tenido 0 fallos. Esto corresponde a 'diasConsecutivos' interpretado como días exitosos.
    """
    if fecha_hasta is None:
        fecha_hasta = date.today()

    consecutivos = 0
    current = fecha_hasta
    for _ in range(max_days):
        cnt = count_fallos_in_period(db, promesa_id, current, current)
        if cnt == 0:
            consecutivos += 1
            current = current - timedelta(days=1)
        else:
            break
    return consecutivos
