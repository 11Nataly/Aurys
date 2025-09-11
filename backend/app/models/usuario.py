# models/usuario.py
from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db import Base

class Usuario(Base):
    """
    Modelo de SQLAlchemy para la tabla 'usuario'.
    """
    __tablename__ = "usuario"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(255), nullable=False, min_length=1)
    correo = Column(String(255), nullable=False, unique=True, index=True)
    contrasena = Column(String(255), nullable=False)
    rol_id = Column(Integer, ForeignKey('rol.id', ondelete="CASCADE"), nullable=False)
    activo = Column(Boolean, default=True)

    # Auditoría
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relaciones
    rol = relationship("Rol", back_populates="usuarios")
    categorias = relationship("Categoria", back_populates="usuario", cascade="all, delete-orphan")
    motivaciones = relationship("Motivacion", back_populates="usuario", cascade="all, delete-orphan")
    notadiarios = relationship("NotaDiario", back_populates="usuario", cascade="all, delete-orphan")
    tecnicasafrontamiento = relationship("TecnicaAfrontamiento", back_populates="usuario", cascade="all, delete-orphan")
    promesas = relationship("Promesa", back_populates="usuario", cascade="all, delete-orphan")
    emociones = relationship("Emocion", back_populates="usuario", cascade="all, delete-orphan")  # si existe el modelo
    activo = Column(Boolean, default=False)



    def __repr__(self):
        return f"<Usuario(id={self.id}, nombre='{self.nombre}', correo='{self.correo}')>"


    #si borras un Usuario, automáticamente se borran todas sus categorías, motivaciones, notas, técnicas, promesas y emociones.


