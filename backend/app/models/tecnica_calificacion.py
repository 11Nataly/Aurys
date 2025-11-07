# app.models/tenica_calificacion.py
from sqlalchemy import Column, Integer, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db import Base

class TecnicaCalificacion(Base):
    """
    Modelo de SQLAlchemy para la tabla 'tecnicas_calificaciones' .
    """
    __tablename__ = "tecnicas_calificaciones"
# Todo ese archivo realizado por douglas   
    # Dejo Id por si algún día queremos permitir
    # historial de calificaciones (ej: mismo usuario calificó varias veces en distintas fechas).
    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuario.id", ondelete="CASCADE"), nullable=False)
    tecnica_id = Column(Integer, ForeignKey("tecnicaafrontamiento.id", ondelete="CASCADE"), nullable=False)
    estrellas = Column(Integer, nullable=False)  # 1 a 5

    usuario = relationship("Usuario", back_populates="calificaciones")
    tecnica_afrontamiento = relationship("TecnicaAfrontamiento", back_populates="calificaciones")

    __table_args__ = (
        UniqueConstraint("usuario_id", "tecnica_id", name="uq_usuario_tecnica"),
    )