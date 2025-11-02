# models/tipo_emocion.py
from app.db import Base
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func

class TipoEmocion(Base):
    __tablename__ = "tipo_emocion"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(100), nullable=False, unique=True, index=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
# Todo ese archivo realizado por douglas   
    def __repr__(self):
        return f"<TipoEmocion(id={self.id}, nombre='{self.nombre}')>"
