# models/usuario.py
from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from db import Base
import datetime

class Usuario(Base):
    """
    Modelo de SQLAlchemy para la tabla 'usuario'.
    """
    __tablename__ = "usuario"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(255), nullable=False)
    correo = Column(String(255), nullable=False, unique=True)
    contrasena = Column(String(255), nullable=False)
    fechaCreacion = Column(DateTime, default=datetime.datetime.now)
    rol_id = Column(Integer, ForeignKey('rol.id'), nullable=False)
    activo = Column(Boolean, default=True)

    # Relaciones
    rol = relationship("Rol", back_populates="usuarios")
    categorias = relationship("Categoria", back_populates="usuario")
    motivaciones = relationship("Motivacion", back_populates="usuario")
    notadiarios = relationship("NotaDiario", back_populates="usuario")
    tecnicasafrontamiento = relationship("TecnicaAfrontamiento", back_populates="usuario")
    promesas = relationship("Promesa", back_populates="usuario")

    def __repr__(self):
        return f"<Usuario(id={self.id}, nombre='{self.nombre}', correo='{self.correo}')>"
