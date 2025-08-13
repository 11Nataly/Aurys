# models/rol.py
from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship
from app.db import Base

class Rol(Base):
    """uvicorn app.main:app --reload
    Modelo de SQLAlchemy para la tabla 'rol'.
    """
    __tablename__ = "rol"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(50), nullable=False, unique=True)
    # El campo 'activo' no estaba en el SQL proporcionado para 'rol', pero se infiere de otros modelos.
    # Si lo necesitas, descomenta la siguiente línea:
    # activo = Column(Boolean, default=True)

    # Relaciones
    usuarios = relationship("Usuario", back_populates="rol")

    def __repr__(self):
        return f"<Rol(id={self.id}, nombre='{self.nombre}')>"
