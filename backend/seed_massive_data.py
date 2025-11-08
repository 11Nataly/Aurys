# seed_massive_data.py

from datetime import date, timedelta
import random, math
from faker import Faker
from app.db.database import SessionLocal
from app.models.usuario import Usuario
from app.models.categoria import Categoria
from app.models.motivacion import Motivacion
from app.models.promesa import Promesa
from app.models.notadiario import NotaDiario
from app.models.tecnicaafrontamiento import TecnicaAfrontamiento
from app.models.rol import Rol
from app.services.loginRegister_service import get_password_hash

fake = Faker("es_ES")

# ==============================================
# 🔧 CONFIGURACIÓN DE TAMAÑO DE DATOS
# ==============================================
USUARIOS_CANT = 5000            # usuarios masivos
CATEGORIAS_POR_USUARIO = 5
MOTIVACIONES_POR_USUARIO = 50
PROMESAS_POR_USUARIO = 20
NOTAS_POR_USUARIO = 100
TEXTO_LARGO = 1000              # tamaño promedio de texto largo


def texto_largo():
    """Genera un texto extenso para ocupar espacio en disco."""
    return " ".join(fake.sentences(nb=random.randint(40, 80)))[:TEXTO_LARGO]


def run_massive_seed():
    db = SessionLocal()
    try:
        print("🌱 Iniciando carga masiva de datos...")

        # ==============================================
        # 0️⃣ CREAR ROLES (usuario / administrador)
        # ==============================================
        for nombre in ("usuario", "administrador"):
            if not db.query(Rol).filter_by(nombre=nombre).first():
                db.add(Rol(nombre=nombre))
        db.commit()
        print("✅ Roles creados o verificados.")

        # ==============================================
        # 1️⃣ CREAR ADMINISTRADOR
        # ==============================================
        admin = db.query(Usuario).filter_by(correo="admin@aurys.com").first()
        if not admin:
            admin = Usuario(
                nombre="Administrador",
                correo="admin@aurys.com",
                contrasena=get_password_hash("Admin123!"),
                rol_id=2,
                activo=True,
            )
            db.add(admin)
            db.commit()
            db.refresh(admin)
            print("✅ Administrador creado (contraseña: Admin123!).")
        else:
            print("⚠️ Administrador ya existe, se reutilizará.")

        # ==============================================
        # 2️⃣ TÉCNICAS DE AFRONTAMIENTO DEL ADMIN
        # ==============================================
        for _ in range(100):
            db.add(TecnicaAfrontamiento(
                usuario_id=admin.id,
                nombre=fake.sentence(nb_words=3),
                descripcion=texto_largo(),
                instruccion=fake.sentence(nb_words=10),
                duracion_video=random.randint(60, 300),
            ))
        db.commit()
        print("✅ Técnicas de afrontamiento agregadas al administrador.")

        # ==============================================
        # 3️⃣ CREAR USUARIOS MASIVOS EN LOTES
        # ==============================================
        usuarios_lote = 500
        total_lotes = math.ceil(USUARIOS_CANT / usuarios_lote)

        for n in range(total_lotes):
            nuevos = []
            inicio = n * usuarios_lote
            fin = min(inicio + usuarios_lote, USUARIOS_CANT)
            for i in range(inicio, fin):
                correo = f"usuario{i}@aurys.com"
                if db.query(Usuario).filter_by(correo=correo).first():
                    continue
                nuevos.append(Usuario(
                    nombre=fake.name(),
                    correo=correo,
                    contrasena=get_password_hash("Usuario123!"),
                    rol_id=1,
                    activo=True,
                ))
            db.add_all(nuevos)
            db.commit()
            print(f"👥 Usuarios insertados: {fin}/{USUARIOS_CANT}")

        usuarios = db.query(Usuario).filter(Usuario.rol_id == 1).all()
        print(f"✅ Total usuarios disponibles: {len(usuarios)}")

        # ==============================================
        # 4️⃣ CREAR DATOS RELACIONADOS POR USUARIO
        # ==============================================
        for idx, user in enumerate(usuarios, start=1):
            # -------------------------------
            # Categorías únicas por usuario
            # -------------------------------
            nombres = set()
            for _ in range(CATEGORIAS_POR_USUARIO):
                nombre = fake.word().capitalize()
                while nombre in nombres:
                    nombre = fake.word().capitalize()
                nombres.add(nombre)
                db.add(Categoria(usuario_id=user.id, nombre=nombre, activo=True))
            db.commit()
            categorias = db.query(Categoria).filter_by(usuario_id=user.id).all()

            # -------------------------------
            # Motivaciones
            # -------------------------------
            for _ in range(MOTIVACIONES_POR_USUARIO):
                db.add(Motivacion(
                    titulo=fake.sentence(nb_words=4),
                    descripcion=texto_largo(),
                    categoria_id=random.choice(categorias).id,
                    usuario_id=user.id,
                    activo=True,
                ))

            # -------------------------------
            # Promesas
            # -------------------------------
            for _ in range(PROMESAS_POR_USUARIO):
                db.add(Promesa(
                    usuario_id=user.id,
                    titulo=fake.sentence(nb_words=3),
                    descripcion=texto_largo(),
                    tipo_frecuencia=random.choice(["Diario", "Semanal"]),
                    num_maximo_recaidas=random.randint(1, 5),
                    fecha_inicio=date.today() - timedelta(days=random.randint(0, 365)),
                    activo=True,
                    cumplida=False,
                ))

            # -------------------------------
            # Notas de diario
            # -------------------------------
            for _ in range(NOTAS_POR_USUARIO):
                db.add(NotaDiario(
                    usuario_id=user.id,
                    titulo=fake.sentence(nb_words=3),
                    contenido=texto_largo(),
                    activo=True,
                ))

            if idx % 100 == 0:
                db.commit()
                print(f"📦 Datos generados para {idx}/{len(usuarios)} usuarios...")

        db.commit()

        # ==============================================
        # ✅ FINAL
        # ==============================================
        print("✅ Carga masiva completada correctamente.")
        print("🔑 Contraseñas:")
        print("   - Administrador: Admin123!")
        print("   - Usuarios: Usuario123!")

    except Exception as e:
        db.rollback()
        print(f"❌ Error durante la carga masiva: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    run_massive_seed()
