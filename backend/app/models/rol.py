from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.db import Base

class Rol(Base):
    """
    Modelo de SQLAlchemy para la tabla 'rol'.
    """
    __tablename__ = "rol"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(50), nullable=False, unique=True)
    
    # La relación inversa a Usuario.
    # Un Rol puede tener muchos Usuarios, por lo que usamos 'usuarios' (en plural).
    usuarios = relationship("Usuario", back_populates="rol")
