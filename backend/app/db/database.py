import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import logging 

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Cadena de conexión desde variable de entorno (para producción en Railway)
# Fallback para desarrollo local
MARIADB_URL = os.getenv("MARIADB_URL", "mysql+pymysql://root:admin@localhost:3315/aurys")

# Forzar driver PyMySQL si Railway entrega mysql://...
if MARIADB_URL and MARIADB_URL.startswith("mysql://"):
    MARIADB_URL = MARIADB_URL.replace("mysql://", "mysql+pymysql://", 1)

# Crear el objeto de conexión
engine = create_engine(MARIADB_URL)

# Crear una fábrica de sesiones
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base para los modelos de SQLAlchemy
Base = declarative_base()

# Función get_db para inyección de dependencias
def get_db():
    db = None
    try:
        db = SessionLocal()
        yield db
    except Exception as e:
        logger.error(f"Error en la conexión a la base de datos: {e}")
        raise
    finally:
        if db:
            db.close()
