from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.models.promesa import Promesa
from app.models.notadiario import NotaDiario
from app.models.motivacion import Motivacion


def limpiar_datos_inactivos(db: Session):
    """
    Elimina registros inactivos (activo=False) que lleven más de 30 días en papelera.
    """
    limite = datetime.now() - timedelta(days=30)

    # ===== Promesas =====
    promesas_inactivas = db.query(Promesa).filter(
        Promesa.activo == False,
        Promesa.updated_at < limite
    ).all()
    for p in promesas_inactivas:
        db.delete(p)

    # ===== Notas de Diario =====
    notas_inactivas = db.query(NotaDiario).filter(
        NotaDiario.activo == False,
        NotaDiario.updated_at < limite
    ).all()
    for n in notas_inactivas:
        db.delete(n)

    # ===== Motivaciones =====
    motivaciones_inactivas = db.query(Motivacion).filter(
        Motivacion.activo == False,
        Motivacion.updated_at < limite
    ).all()
    for m in motivaciones_inactivas:
        db.delete(m)

    # ===== Confirmar eliminación =====
    db.commit()

    print(
        f"🧹 Limpieza completada -> "
        f"{len(promesas_inactivas)} promesas, "
        f"{len(notas_inactivas)} notas y "
        f"{len(motivaciones_inactivas)} motivaciones eliminadas."
    )
#Todo lo de este archivo fue realizado por douglas 