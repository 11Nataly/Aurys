from db import Base
from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey

class RedApoyo(Base):
    __tablename__ = "red_apoyo"
    id = Column(Integer, primary_key=True)
    usuario_id = Column(Integer, ForeignKey("usuario.id"), nullable=False)
    nombreContacto = Column(String(255), nullable=False)
    numeroTelefono = Column(String(50), nullable=True)
    email = Column(String(255), nullable=True)
    descripcion = Column(Text, nullable=True)
    activo = Column(Boolean, default=True)