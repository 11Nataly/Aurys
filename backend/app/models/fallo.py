# models/fallo.py
from sqlalchemy import Column, Integer, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db import Base

class Fallo(Base):
    """
    Representa una recaída o incumplimiento dentro de una promesa.
    """
    __tablename__ = "fallo"

    id = Column(Integer, primary_key=True, autoincrement=True)
    promesa_id = Column(Integer, ForeignKey("promesa.id", ondelete="CASCADE"), nullable=False)
    descripcion = Column(Text, nullable=True)
    fecha_registro = Column(DateTime(timezone=True), server_default=func.now())

    promesa = relationship("Promesa", back_populates="fallos")

    def __repr__(self):
        return f"<Fallo(id={self.id}, promesa_id={self.promesa_id})>"
