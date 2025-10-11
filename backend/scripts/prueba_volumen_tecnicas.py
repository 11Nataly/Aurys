import time
import random
from sqlalchemy.orm import Session
from app.db.database import SessionLocal, get_db
from app.models.tecnicaafrontamiento import TecnicaAfrontamiento
from app.dtos.tecnica_dto import TecnicaResponseDTO


def generar_datos_masivos(n: int = 5000):
    """Inserta n técnicas de afrontamiento de ejemplo en la base de datos."""
    db: Session = SessionLocal()
    try:
        tecnicas = []
        for i in range(n):
            tecnicas.append(
                TecnicaAfrontamiento(
                    usuario_id=1,  # asumimos que existe un usuario admin con id=1
                    nombre=f"Técnica {i}",
                    descripcion=f"Descripción de la técnica número {i}",
                    instruccion=f"Instrucciones detalladas para la técnica {i}",
                    video=f"http://videos.com/tecnica{i}.mp4",
                    duracion_video=300,  # 300 segundos = 5 minutos
                    activo=True
                )
            )
        db.bulk_save_objects(tecnicas)
        db.commit()
        print(f"✅ {n} técnicas insertadas correctamente.")
    except Exception as e:
        db.rollback()
        print("❌ Error al insertar:", e)
    finally:
        db.close()


def prueba_busqueda_por_id(id_buscar: int):
    """Busca una técnica por ID y cronometra el tiempo."""
    db: Session = SessionLocal()
    try:
        inicio = time.time()
        tecnica = db.query(TecnicaAfrontamiento).filter_by(id=id_buscar).first()
        fin = time.time()
        if tecnica:
            dto = TecnicaResponseDTO.model_validate(tecnica)
            print(f"🔎 Búsqueda por ID={id_buscar} encontrada en {fin - inicio:.6f} segundos.")
            print(dto)
        else:
            print(f"⚠️ No se encontró la técnica con ID={id_buscar}")
    finally:
        db.close()


def prueba_busqueda_por_nombre(texto: str):
    """Busca técnicas por nombre (LIKE %texto%) y cronometra el tiempo."""
    db: Session = SessionLocal()
    try:
        inicio = time.time()
        resultados = db.query(TecnicaAfrontamiento).filter(
            TecnicaAfrontamiento.nombre.ilike(f"%{texto}%")
        ).all()
        fin = time.time()
        dtos = [TecnicaResponseDTO.model_validate(t) for t in resultados]
        print(f"🔎 Búsqueda por nombre '{texto}' encontró {len(dtos)} resultados en {fin - inicio:.6f} segundos.")
    finally:
        db.close()


def correr_pruebas():
    print("⚡ Iniciando prueba de volumen en técnicas de afrontamiento...\n")

    # Paso 1: Insertar datos (ajusta la cantidad según necesites)
    generar_datos_masivos(10000)

    # Paso 2: Prueba simple por ID
    prueba_busqueda_por_id(7000)

    # Paso 3: Prueba de búsqueda parcial
    prueba_busqueda_por_nombre("Técnica 99")

    # Paso 4: Prueba de búsqueda más amplia
    prueba_busqueda_por_nombre("Técnica")

    print("\n✅ Prueba de volumen finalizada.")


if __name__ == "__main__":
    correr_pruebas()