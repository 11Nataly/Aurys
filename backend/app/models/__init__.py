# models/_init_.py
# Importa todos tus modelos aquí para un acceso centralizado


# Este archivo asegura que todos los modelos de SQLAlchemy se importen
# y registren correctamente al inicio de la aplicación,
# previniendo problemas de dependencias circulares.

from .rol import Rol
from .usuario import Usuario
from .categoria import Categoria
from .motivacion import Motivacion
from .notadiario import NotaDiario
from .tecnicaafrontamiento import TecnicaAfrontamiento
from .tecnica_calificacion import TecnicaCalificacion
from .tecnicaFavorita import TecnicaFavorita
from .promesa import Promesa
from .fallos import Fallo
from .emocion import Emocion 
from .tipo_emocion import TipoEmocion# Renombrado a singular para el modelo
