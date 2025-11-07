# models/tecnicaFavorita.py
from sqlalchemy import Column, Integer, ForeignKey, DateTime, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db import Base

class TecnicaFavorita(Base):
    """
    Tabla intermedia que almacena qué usuario marcó como favorita una técnica.
    """
    __tablename__ = "tecnica_favorita"
    # Todo ese archivo realizado por douglas   
    usuario_id = Column(Integer, ForeignKey('usuario.id', ondelete="CASCADE"), primary_key=True)
    tecnica_id = Column(Integer, ForeignKey("tecnicaafrontamiento.id", ondelete="CASCADE"), primary_key=True)

    # Relaciones
    usuario = relationship("Usuario", back_populates="favoritos")
    tecnica_afrontamiento = relationship("TecnicaAfrontamiento", back_populates="favoritos")
    
    # Auditoría
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


    # Evitar duplicados (ya cubierto por la PK compuesta, pero puedes mantener UniqueConstraint)
    __table_args__ = (UniqueConstraint('usuario_id', 'tecnica_id', name='uq_usuario_tecnica_fav'),)

    def __repr__(self):
        return f"<TecnicaFavorita(usuario_id={self.usuario_id}, tecnica_id={self.tecnica_id})>"
