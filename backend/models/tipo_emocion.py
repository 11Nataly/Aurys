from db import Base
from sqlalchemy import Column, Integer, String

class TipoEmocion(Base):
    __tablename__ = "tipo_emocion"
    id = Column(Integer, primary_key=True)
    nombre = Column(String(100), nullable=False, unique=True)