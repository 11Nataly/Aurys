# models/categoria.py
from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db import Base

class Categoria(Base):
    """
    Modelo de SQLAlchemy para la tabla 'categoria'.
    Representa categorías personalizadas (creadas por el usuario) 
    o predeterminadas (creadas automáticamente por el sistema).
    """
    __tablename__ = "categoria"
    __table_args__ = (
        UniqueConstraint("usuario_id", "nombre", name="uq_categoria_usuario"),  # Evita duplicados
    )
# Todo ese archivo realizado por douglas   
    id = Column(Integer, primary_key=True, autoincrement=True)
    usuario_id = Column(Integer, ForeignKey('usuario.id', ondelete="CASCADE"), nullable=False)
    nombre = Column(String(255), nullable=False, index=True)
    esPredeterminada = Column(Boolean, default=False)  # True = sistema, False = usuario
    activo = Column(Boolean, default=True)

    # Auditoría
    created_at = Column(DateTime(timezone=True), server_default=func.now())   # Fecha de creación
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())  # Última modificación

    # Relaciones
    usuario = relationship("Usuario", back_populates="categorias")
    motivaciones = relationship("Motivacion", back_populates="categoria")

    def __repr__(self):
        return f"<Categoria(id={self.id}, nombre='{self.nombre}', usuario_id={self.usuario_id}, esPredeterminada={self.esPredeterminada})>"
