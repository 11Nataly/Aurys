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
    nombre = Column(String(255), nullable=False)
    correo = Column(String(255), nullable=False, unique=True, index=True)
    contrasena = Column(String(255), nullable=False)
    rol_id = Column(Integer, ForeignKey('rol.id', ondelete="CASCADE"), nullable=False)
    activo = Column(Boolean, default=True)

    # 🆕 Campo opcional para la foto de perfil
    foto_perfil = Column(String(255), nullable=True)

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
    emociones = relationship("Emocion", back_populates="usuario", cascade="all, delete-orphan")
    favoritos = relationship("TecnicaFavorita", back_populates="usuario", cascade="all, delete-orphan")
    calificaciones = relationship("TecnicaCalificacion", back_populates="usuario", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Usuario(id={self.id}, nombre='{self.nombre}', correo='{self.correo}')>"
# Todo ese archivo realizado por douglas   