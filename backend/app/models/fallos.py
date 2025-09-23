# models/fallos.py
from sqlalchemy import Column, Integer, Date, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db import Base

class Fallo(Base):  # Singular en el modelo, tabla sigue siendo 'fallos'
    """
    Modelo de SQLAlchemy para la tabla 'fallos'.
    Representa una recaída asociada a una promesa.
    """
    __tablename__ = "fallos"

    id = Column(Integer, primary_key=True, autoincrement=True)
    promesa_id = Column(Integer, ForeignKey('promesa.id', ondelete="CASCADE"), nullable=False)
    fecha_inicio = Column(Date, nullable=True)
    fecha_final = Column(Date, nullable=True)
    cantidad_registros = Column(Integer, default=0)
    activo = Column(Boolean, default=True)

    # Auditoría
    created_at = Column(DateTime(timezone=True), server_default=func.now())   # Fecha de creación del fallo
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())  # Última modificación

    # Relaciones
    promesa = relationship("Promesa", back_populates="fallos")

    def __repr__(self):
        return f"<Fallo(id={self.id}, promesa_id={self.promesa_id}, cantidad_registros={self.cantidad_registros})>"
