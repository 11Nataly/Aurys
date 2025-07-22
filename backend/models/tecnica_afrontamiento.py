from db import Base
from sqlalchemy import Column, Integer, String, Text, Numeric, Boolean

class TecnicaAfrontamiento(Base):
    __tablename__ = "tecnica_afrontamiento"
    id = Column(Integer, primary_key=True)
    nombre = Column(String(255), nullable=False)
    descripcion = Column(Text, nullable=True)
    video = Column(String(255), nullable=True)
    instruccion = Column(Text, nullable=True)
    calificacion = Column(Numeric(2,1), nullable=True)
    esFavorita = Column(Boolean, default=False)
    activo = Column(Boolean, default=True)