from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from db import Base # Asegúrate de que db.py contenga Base = declarative_base() y el engine
from datetime import datetime, date

# Importar todos tus modelos desde sus respectivos archivos.
# Asegúrate de que estos archivos estén en el mismo directorio que seeder.py
# o en una subcarpeta accesible en el PYTHONPATH.

from rol import Rol
from usuario import Usuario
from tipo_emocion import TipoEmocion
from emocion import Emocion
from nota_diario import NotaDiario
from nota_voz import NotaVoz
from categoria import Categoria
from motivacion import Motivacion
from promesa import Promesa
from mejoras_personales import MejorasPersonales
from tecnica_afrontamiento import TecnicaAfrontamiento
from linea_emergencia import LineaEmergencia
from red_apoyo import RedApoyo


# Configuración de la base de datos (asegúrate de que sea la misma que en db.py)
DATABASE_URL = "mysql+mysqlconnector://user:password@host/aurys_db"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def seed_data():
    db = SessionLocal()
    try:
        print("Iniciando seeding de datos...")

        # 1. Insertar Roles
        # Verifica si los roles ya existen para evitar duplicados
        rol_joven = db.query(Rol).filter_by(nombre='joven').first()
        if not rol_joven:
            rol_joven = Rol(id=1, nombre='joven')
            db.add(rol_joven)
        
        rol_admin = db.query(Rol).filter_by(nombre='administrador').first()
        if not rol_admin:
            rol_admin = Rol(id=2, nombre='administrador')
            db.add(rol_admin)
        
        db.commit()
        db.refresh(rol_joven)
        db.refresh(rol_admin)
        print("Roles asegurados.")

        # 2. Insertar Usuarios
        # Solo inserta si no existen para evitar errores de clave única
        if not db.query(Usuario).filter_by(correo='andrea.joven@example.com').first():
            usuario_andrea = Usuario(
                id=1, nombre='Andrea Joven', correo='andrea.joven@example.com',
                contrasena='pass123', rol_id=rol_joven.id, pinDiario='1234', activo=True
            )
            db.add(usuario_andrea)
        else:
            usuario_andrea = db.query(Usuario).filter_by(correo='andrea.joven@example.com').first()

        if not db.query(Usuario).filter_by(correo='carlos.joven@example.com').first():
            usuario_carlos = Usuario(
                id=2, nombre='Carlos Joven', correo='carlos.joven@example.com',
                contrasena='pass456', rol_id=rol_joven.id, pinDiario='5678', activo=True
            )
            db.add(usuario_carlos)
        else:
            usuario_carlos = db.query(Usuario).filter_by(correo='carlos.joven@example.com').first()

        if not db.query(Usuario).filter_by(correo='luisa.admin@example.com').first():
            usuario_luisa = Usuario(
                id=3, nombre='Luisa Administradora', correo='luisa.admin@example.com',
                contrasena='adminpass', rol_id=rol_admin.id, pinDiario=None, activo=True
            )
            db.add(usuario_luisa)
        else:
            usuario_luisa = db.query(Usuario).filter_by(correo='luisa.admin@example.com').first()

        db.commit()
        db.refresh(usuario_andrea)
        db.refresh(usuario_carlos)
        db.refresh(usuario_luisa)
        print("Usuarios asegurados.")

        # 3. Insertar Tipos de Emoción
        tipos_emocion_data = [
            {'id':1, 'nombre':'alegria'}, {'id':2, 'nombre':'tristeza'},
            {'id':3, 'nombre':'miedo'}, {'id':4, 'nombre':'enojo'},
            {'id':5, 'nombre':'ansiedad'}, {'id':6, 'nombre':'calma'},
            {'id':7, 'nombre':'esperanza'},
        ]
        for data in tipos_emocion_data:
            if not db.query(TipoEmocion).filter_by(id=data['id']).first():
                db.add(TipoEmocion(**data))
        db.commit()
        print("Tipos de Emoción asegurados.")

        # Obtener IDs para facilitar inserciones (refrescar después del commit de tipos_emocion_data)
        alegria_id = db.query(TipoEmocion.id).filter_by(nombre='alegria').scalar()
        tristeza_id = db.query(TipoEmocion.id).filter_by(nombre='tristeza').scalar()
        miedo_id = db.query(TipoEmocion.id).filter_by(nombre='miedo').scalar()
        enojo_id = db.query(TipoEmocion.id).filter_by(nombre='enojo').scalar()
        ansiedad_id = db.query(TipoEmocion.id).filter_by(nombre='ansiedad').scalar()
        calma_id = db.query(TipoEmocion.id).filter_by(nombre='calma').scalar()
        esperanza_id = db.query(TipoEmocion.id).filter_by(nombre='esperanza').scalar()


        # 4. Insertar Emociones (fechas ajustadas para el 18 de junio de 2025)
        emociones_data = [
            Emocion(usuario_id=usuario_andrea.id, tipo_emocion_id=alegria_id, descripcion_emocion='Un día muy feliz en el parque.', fecha=datetime(2025, 6, 11, 10, 0, 0)),
            Emocion(usuario_id=usuario_andrea.id, tipo_emocion_id=tristeza_id, descripcion_emocion='Me sentí un poco triste por las noticias.', fecha=datetime(2025, 6, 11, 18, 30, 0)),
            Emocion(usuario_id=usuario_andrea.id, tipo_emocion_id=enojo_id, descripcion_emocion='Discusión con un amigo.', fecha=datetime(2025, 6, 12, 14, 15, 0)),
            Emocion(usuario_id=usuario_andrea.id, tipo_emocion_id=alegria_id, descripcion_emocion='Recibí una buena noticia.', fecha=datetime(2025, 6, 12, 20, 0, 0)),
            Emocion(usuario_id=usuario_andrea.id, tipo_emocion_id=ansiedad_id, descripcion_emocion='Ansiedad por un examen.', fecha=datetime(2025, 6, 13, 9, 0, 0)),
            Emocion(usuario_id=usuario_andrea.id, tipo_emocion_id=miedo_id, descripcion_emocion='Vi una película de terror.', fecha=datetime(2025, 6, 13, 22, 0, 0)),
            Emocion(usuario_id=usuario_andrea.id, tipo_emocion_id=calma_id, descripcion_emocion='Día relajante en casa.', fecha=datetime(2025, 6, 14, 11, 0, 0)),
            Emocion(usuario_id=usuario_andrea.id, tipo_emocion_id=alegria_id, descripcion_emocion='Tuve una gran conversación.', fecha=datetime(2025, 6, 14, 16, 45, 0)),
            Emocion(usuario_id=usuario_andrea.id, tipo_emocion_id=tristeza_id, descripcion_emocion='Extrañando a mi familia.', fecha=datetime(2025, 6, 15, 13, 0, 0)),
            Emocion(usuario_id=usuario_andrea.id, tipo_emocion_id=enojo_id, descripcion_emocion='Me frustró un problema.', fecha=datetime(2025, 6, 15, 17, 0, 0)),
            Emocion(usuario_id=usuario_andrea.id, tipo_emocion_id=alegria_id, descripcion_emocion='Logré un objetivo personal.', fecha=datetime(2025, 6, 16, 9, 30, 0)),
            Emocion(usuario_id=usuario_andrea.id, tipo_emocion_id=ansiedad_id, descripcion_emocion='Preocupación por el futuro.', fecha=datetime(2025, 6, 16, 21, 0, 0)),
            Emocion(usuario_id=usuario_andrea.id, tipo_emocion_id=calma_id, descripcion_emocion='Meditación matutina.', fecha=datetime(2025, 6, 17, 8, 0, 0)),
            Emocion(usuario_id=usuario_andrea.id, tipo_emocion_id=alegria_id, descripcion_emocion='Fin de semana tranquilo.', fecha=datetime(2025, 6, 17, 15, 0, 0)),
            Emocion(usuario_id=usuario_andrea.id, tipo_emocion_id=alegria_id, descripcion_emocion='Un nuevo día, lleno de posibilidades.', fecha=datetime(2025, 6, 18, 8, 0, 0)),
            Emocion(usuario_id=usuario_andrea.id, tipo_emocion_id=calma_id, descripcion_emocion='Me siento en paz hoy.', fecha=datetime(2025, 6, 18, 12, 0, 0)),
            Emocion(usuario_id=usuario_andrea.id, tipo_emocion_id=esperanza_id, descripcion_emocion='Esperanzada por el proyecto.', fecha=datetime(2025, 6, 18, 16, 0, 0)),
            Emocion(usuario_id=usuario_andrea.id, tipo_emocion_id=ansiedad_id, descripcion_emocion='Un poco de nervios por la presentación.', fecha=datetime(2025, 6, 19, 9, 0, 0)),
            Emocion(usuario_id=usuario_andrea.id, tipo_emocion_id=enojo_id, descripcion_emocion='Me molestó un comentario.', fecha=datetime(2025, 6, 19, 14, 0, 0)),
            Emocion(usuario_id=usuario_carlos.id, tipo_emocion_id=alegria_id, descripcion_emocion='Buen día de estudio.', fecha=datetime(2025, 6, 10, 10, 0, 0)),
            Emocion(usuario_id=usuario_carlos.id, tipo_emocion_id=ansiedad_id, descripcion_emocion='Mucho estrés por la universidad.', fecha=datetime(2025, 6, 10, 15, 0, 0)),
            Emocion(usuario_id=usuario_carlos.id, tipo_emocion_id=tristeza_id, descripcion_emocion='Un poco desanimado hoy.', fecha=datetime(2025, 6, 12, 9, 0, 0)),
        ]
        # Filtrar solo las emociones que no existen ya para evitar duplicados
        existing_emotions_count = db.query(Emocion).count()
        if existing_emotions_count == 0: # Solo agregar si no hay ninguna emoción
            db.add_all(emociones_data)
            db.commit()
            print("Emociones insertadas.")
        else:
            print(f"Ya existen {existing_emotions_count} emociones. No se insertarán duplicados.")


        # 5. Insertar Notas de Diario
        notas_diario_data = [
            NotaDiario(usuario_id=usuario_andrea.id, contenido='Hoy fue un día complicado pero aprendí mucho de mis errores.', fecha=datetime(2025, 6, 10, 20, 0, 0), pin_diario_requerido=True),
            NotaDiario(usuario_id=usuario_andrea.id, contenido='Reflexionando sobre mis metas y cómo voy a alcanzarlas.', fecha=datetime(2025, 6, 13, 22, 0, 0), pin_diario_requerido=False),
            NotaDiario(usuario_id=usuario_carlos.id, contenido='Escribiendo sobre mis sueños para el futuro.', fecha=datetime(2025, 6, 11, 19, 30, 0), pin_diario_requerido=True),
        ]
        if db.query(NotaDiario).count() == 0:
            db.add_all(notas_diario_data)
            db.commit()
            print("Notas de Diario insertadas.")
        else:
            print("Ya existen notas de diario.")

        # 6. Insertar Notas de Voz
        notas_voz_data = [
            NotaVoz(usuario_id=usuario_andrea.id, nombre='Reflexion sobre mi semana', ruta_archivo='audios/andrea_semana.mp3', fecha=datetime(2025, 6, 14, 17, 0, 0), pin_diario_requerido=True),
            NotaVoz(usuario_id=usuario_carlos.id, nombre='Ideas para mi proyecto', ruta_archivo='audios/carlos_proyecto.wav', fecha=datetime(2025, 6, 12, 11, 0, 0), pin_diario_requerido=False),
        ]
        if db.query(NotaVoz).count() == 0:
            db.add_all(notas_voz_data)
            db.commit()
            print("Notas de Voz insertadas.")
        else:
            print("Ya existen notas de voz.")

        # 7. Insertar Categorías
        categoria_logros = db.query(Categoria).filter_by(nombre='Mis Logros', usuario_id=usuario_andrea.id).first()
        if not categoria_logros:
            categoria_logros = Categoria(usuario_id=usuario_andrea.id, nombre='Mis Logros', esPredeterminada=True, tipoPredeterminado='logros')
            db.add(categoria_logros)

        categoria_momentos_felices = db.query(Categoria).filter_by(nombre='Momentos Felices', usuario_id=usuario_andrea.id).first()
        if not categoria_momentos_felices:
            categoria_momentos_felices = Categoria(usuario_id=usuario_andrea.id, nombre='Momentos Felices', esPredeterminada=False, tipoPredeterminado=None)
            db.add(categoria_momentos_felices)
        
        categoria_estudio = db.query(Categoria).filter_by(nombre='Metas de Estudio', usuario_id=usuario_carlos.id).first()
        if not categoria_estudio:
            categoria_estudio = Categoria(usuario_id=usuario_carlos.id, nombre='Metas de Estudio', esPredeterminada=False, tipoPredeterminado=None)
            db.add(categoria_estudio)

        categoria_globales = db.query(Categoria).filter_by(nombre='Categorías Globales', usuario_id=usuario_luisa.id).first()
        if not categoria_globales:
            categoria_globales = Categoria(usuario_id=usuario_luisa.id, nombre='Categorías Globales', esPredeterminada=True, tipoPredeterminado=None)
            db.add(categoria_globales)
        
        categoria_frases = db.query(Categoria).filter_by(nombre='Frases Inspiradoras', usuario_id=usuario_luisa.id).first()
        if not categoria_frases:
            categoria_frases = Categoria(usuario_id=usuario_luisa.id, nombre='Frases Inspiradoras', esPredeterminada=True, tipoPredeterminado='frases')
            db.add(categoria_frases)

        db.commit()
        db.refresh(categoria_logros)
        db.refresh(categoria_momentos_felices)
        db.refresh(categoria_estudio)
        db.refresh(categoria_globales)
        db.refresh(categoria_frases)
        print("Categorías aseguradas.")

        # 8. Insertar Motivaciones
        motivaciones_data = [
            Motivacion(usuario_id=usuario_andrea.id, categoria_id=categoria_logros.id, titulo='Terminar el curso de programación', descripcion='Quiero mejorar mis habilidades.', esFavorita=True),
            Motivacion(usuario_id=usuario_andrea.id, categoria_id=None, titulo='Mantener la calma en situaciones de estrés', descripcion='Es un objetivo personal importante.', esFavorita=False),
            Motivacion(usuario_id=usuario_carlos.id, categoria_id=categoria_estudio.id, titulo='Aprobar mi examen final', descripcion='Necesito concentrarme en mis estudios.', esFavorita=True),
        ]
        if db.query(Motivacion).count() == 0:
            db.add_all(motivaciones_data)
            db.commit()
            print("Motivaciones insertadas.")
        else:
            print("Ya existen motivaciones.")

        # 9. Insertar Promesas
        promesa_maraton = db.query(Promesa).filter_by(titulo='Correr una maratón', usuario_id=usuario_andrea.id).first()
        if not promesa_maraton:
            promesa_maraton = Promesa(usuario_id=usuario_andrea.id, titulo='Correr una maratón', descripcion='Entrenar duro para completar una maratón de 5K.', fechaCreacion=datetime(2025, 6, 12, 8, 0, 0), estado='en proceso')
            db.add(promesa_maraton)

        promesa_libros = db.query(Promesa).filter_by(titulo='Leer 10 libros este año', usuario_id=usuario_andrea.id).first()
        if not promesa_libros:
            promesa_libros = Promesa(usuario_id=usuario_andrea.id, titulo='Leer 10 libros este año', descripcion='Compromiso de lectura para expandir conocimientos.', fechaCreacion=datetime(2025, 1, 1, 8, 0, 0), estado='en proceso')
            db.add(promesa_libros)

        promesa_idioma = db.query(Promesa).filter_by(titulo='Aprender un nuevo idioma', usuario_id=usuario_carlos.id).first()
        if not promesa_idioma:
            promesa_idioma = Promesa(usuario_id=usuario_carlos.id, titulo='Aprender un nuevo idioma', descripcion='Estudiar francés por al menos 30 minutos al día.', fechaCreacion=datetime(2025, 3, 15, 8, 0, 0), estado='en proceso')
            db.add(promesa_idioma)
        
        promesa_organizacion = db.query(Promesa).filter_by(titulo='Organizar mi habitación', usuario_id=usuario_andrea.id).first()
        if not promesa_organizacion:
            promesa_organizacion = Promesa(usuario_id=usuario_andrea.id, titulo='Organizar mi habitación', descripcion='Limpiar y organizar mi espacio personal.', fechaCreacion=datetime(2025, 6, 1, 8, 0, 0), fechaCumplimiento=date(2025, 6, 7), estado='logrado')
            db.add(promesa_organizacion)

        promesa_proyecto = db.query(Promesa).filter_by(titulo='Completar el proyecto de la universidad', usuario_id=usuario_carlos.id).first()
        if not promesa_proyecto:
            promesa_proyecto = Promesa(usuario_id=usuario_carlos.id, titulo='Completar el proyecto de la universidad', descripcion='Finalizar el proyecto antes de la fecha límite.', fechaCreacion=datetime(2025, 5, 20, 8, 0, 0), fechaCumplimiento=date(2025, 6, 18), estado='logrado')
            db.add(promesa_proyecto)

        db.commit()
        db.refresh(promesa_maraton)
        db.refresh(promesa_libros)
        db.refresh(promesa_idioma)
        db.refresh(promesa_organizacion)
        db.refresh(promesa_proyecto)
        print("Promesas aseguradas.")

        # 10. Insertar Mejoras Personales
        mejoras_data = [
            MejorasPersonales(promesa_id=promesa_maraton.id, usuario_id=usuario_andrea.id, descripcion='Entrenamiento día 1: 1km.', fecha=datetime(2025, 6, 12, 10, 0, 0)),
            MejorasPersonales(promesa_id=promesa_maraton.id, usuario_id=usuario_andrea.id, descripcion='Entrenamiento día 2: 1.5km.', fecha=datetime(2025, 6, 13, 10, 0, 0)),
            MejorasPersonales(promesa_id=promesa_maraton.id, usuario_id=usuario_andrea.id, descripcion='Entrenamiento día 3: 2km.', fecha=datetime(2025, 6, 14, 10, 0, 0)),
            MejorasPersonales(promesa_id=promesa_maraton.id, usuario_id=usuario_andrea.id, descripcion='Entrenamiento día 4: 2.5km.', fecha=datetime(2025, 6, 15, 10, 0, 0)),
            MejorasPersonales(promesa_id=promesa_maraton.id, usuario_id=usuario_andrea.id, descripcion='Entrenamiento día 5: 3km.', fecha=datetime(2025, 6, 16, 10, 0, 0)),
            MejorasPersonales(promesa_id=promesa_maraton.id, usuario_id=usuario_andrea.id, descripcion='Entrenamiento día 6: 3.5km.', fecha=datetime(2025, 6, 17, 10, 0, 0)),
            MejorasPersonales(promesa_id=promesa_libros.id, usuario_id=usuario_andrea.id, descripcion='Leído capítulo 1.', fecha=datetime(2025, 6, 12, 18, 0, 0)),
            MejorasPersonales(promesa_id=promesa_libros.id, usuario_id=usuario_andrea.id, descripcion='Leído capítulo 2.', fecha=datetime(2025, 6, 13, 18, 0, 0)),
            MejorasPersonales(promesa_id=promesa_libros.id, usuario_id=usuario_andrea.id, descripcion='Leído capítulo 3.', fecha=datetime(2025, 6, 15, 18, 0, 0)),
            MejorasPersonales(promesa_id=promesa_idioma.id, usuario_id=usuario_carlos.id, descripcion='Clase de francés día 1.', fecha=datetime(2025, 6, 9, 19, 0, 0)),
            MejorasPersonales(promesa_id=promesa_idioma.id, usuario_id=usuario_carlos.id, descripcion='Clase de francés día 2.', fecha=datetime(2025, 6, 10, 19, 0, 0)),
            MejorasPersonales(promesa_id=promesa_idioma.id, usuario_id=usuario_carlos.id, descripcion='Clase de francés día 3.', fecha=datetime(2025, 6, 11, 19, 0, 0)),
            MejorasPersonales(promesa_id=promesa_idioma.id, usuario_id=usuario_carlos.id, descripcion='Clase de francés día 4.', fecha=datetime(2025, 6, 12, 19, 0, 0)),
            MejorasPersonales(promesa_id=promesa_idioma.id, usuario_id=usuario_carlos.id, descripcion='Clase de francés día 5.', fecha=datetime(2025, 6, 13, 19, 0, 0)),
        ]
        if db.query(MejorasPersonales).count() == 0:
            db.add_all(mejoras_data)
            db.commit()
            print("Mejoras Personales insertadas.")
        else:
            print("Ya existen mejoras personales.")

        # 11. Insertar Técnicas de Afrontamiento
        tecnicas_data = [
            TecnicaAfrontamiento(nombre='Respiración Profunda', descripcion='Técnica para calmar la ansiedad.', video='http://youtube.com/video1', instruccion='Inhala 4 seg, sostén 7 seg, exhala 8 seg.', calificacion=4.8, esFavorita=True),
            TecnicaAfrontamiento(nombre='Grounding (5-4-3-2-1)', descripcion='Técnica para anclarse en el presente.', video='http://youtube.com/video2', instruccion='Identifica 5 cosas que ves, 4 que sientes, 3 que oyes, 2 que hueles, 1 que saboreas.', calificacion=4.5, esFavorita=False),
            TecnicaAfrontamiento(nombre='Diario de Gratitud', descripcion='Escribir sobre cosas por las que estás agradecido.', video=None, instruccion='Cada noche, escribe 3 cosas por las que estás agradecido.', calificacion=4.9, esFavorita=True),
        ]
        if db.query(TecnicaAfrontamiento).count() == 0:
            db.add_all(tecnicas_data)
            db.commit()
            print("Técnicas de Afrontamiento insertadas.")
        else:
            print("Ya existen técnicas de afrontamiento.")


        # 12. Insertar Líneas de Emergencia
        lineas_data = [
            LineaEmergencia(nombreServicio='Línea de Apoyo Psicológico', numeroTelefono='123-456-7890', horarioAtencion='24/7', medioContacto='Teléfono'),
            LineaEmergencia(nombreServicio='Servicio de Crisis Nacional', numeroTelefono='987-654-3210', horarioAtencion='L-V 9am-5pm', medioContacto='Teléfono, Chat Online'),
            LineaEmergencia(nombreServicio='Emergencias Colombia', numeroTelefono='123', horarioAtencion='24/7', medioContacto='Teléfono'),
        ]
        if db.query(LineaEmergencia).count() == 0:
            db.add_all(lineas_data)
            db.commit()
            print("Líneas de Emergencia insertadas.")
        else:
            print("Ya existen líneas de emergencia.")

        # 13. Insertar Red de Apoyo
        red_apoyo_contactos_data = [
            RedApoyo(usuario_id=usuario_andrea.id, nombreContacto='Mamá', numeroTelefono='310-111-2222', email='mama@example.com', descripcion='Mi principal apoyo emocional.'),
            RedApoyo(usuario_id=usuario_andrea.id, nombreContacto='Mejor Amigo Juan', numeroTelefono='320-333-4444', email='juan@example.com', descripcion='Siempre me escucha y me da buenos consejos.'),
            RedApoyo(usuario_id=usuario_carlos.id, nombreContacto='Hermana Laura', numeroTelefono='300-555-6666', email='laura@example.com', descripcion='Me ayuda con mis estudios.'),
        ]
        if db.query(RedApoyo).count() == 0:
            db.add_all(red_apoyo_contactos_data)
            db.commit()
            print("Red de Apoyo insertada.")
        else:
            print("Ya existen contactos en la red de apoyo.")


        print("Seeding de datos completado exitosamente.")

    except Exception as e:
        db.rollback()
        print(f"Error durante el seeding: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()