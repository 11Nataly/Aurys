# models/fallos.py
from sqlalchemy import Column, Integer, Date, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.db import Base

class Fallo(Base): # Renombrado a singular para el modelo
    """
    Modelo de SQLAlchemy para la tabla 'fallos'.
    """
    __tablename__ = "fallos"

    id = Column(Integer, primary_key=True, autoincrement=True)
    promesa_id = Column(Integer, ForeignKey('promesa.id'), nullable=False)
    fecha_inicio = Column(Date, nullable=True)
    fecha_final = Column(Date, nullable=True)
    cantidad_registros = Column(Integer, default=0)
    activo = Column(Boolean, default=True)

    # Relaciones
    promesa = relationship("Promesa", back_populates="fallos")

    def __repr__(self):
        return f"<Fallo(id={self.id}, promesa_id={self.promesa_id}, cantidad_registros={self.cantidad_registros})>"
