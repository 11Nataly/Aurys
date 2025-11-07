# seed_massive_data.py
from datetime import date, timedelta
import random
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


def run_massive_seed():
    db = SessionLocal()
    try:
        print("🌱 Generando datos masivos...")

        # ======================================================
        # 0️⃣ CREAR ROLES (Usuario = 1, Administrador = 2)
        # ======================================================
        rol_usuario = db.query(Rol).filter(Rol.nombre == "usuario").first()
        rol_admin = db.query(Rol).filter(Rol.nombre == "administrador").first()

        if not rol_usuario:
            rol_usuario = Rol(id=1, nombre="usuario")
            db.add(rol_usuario)
        if not rol_admin:
            rol_admin = Rol(id=2, nombre="administrador")
            db.add(rol_admin)

        db.commit()
        print("✅ Roles creados o verificados.")

        # ======================================================
        # 1️⃣ ADMINISTRADOR
        # ======================================================
        admin_existente = db.query(Usuario).filter(Usuario.correo == "admin@aurys.com").first()
        if admin_existente:
            print("⚠️ Administrador ya existe, se reutilizará.")
            admin = admin_existente
        else:
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
            print("✅ Administrador creado (Admin123!).")

        # ======================================================
        # 2️⃣ TÉCNICAS DE AFRONTAMIENTO DEL ADMINISTRADOR
        # ======================================================
        for _ in range(100):
            tecnica = TecnicaAfrontamiento(
                usuario_id=admin.id,
                nombre=fake.sentence(nb_words=3),
                descripcion=fake.paragraph(nb_sentences=3),
                instruccion=fake.sentence(nb_words=10),
                duracion_video=random.randint(60, 300),
            )
            db.add(tecnica)
        db.commit()
        print("✅ Técnicas de afrontamiento agregadas al administrador.")

        # ======================================================
        # 3️⃣ USUARIOS MASIVOS
        # ======================================================
        usuarios = []

        for i in range(50):
            correo = f"usuario{i}@aurys.com"
            if db.query(Usuario).filter(Usuario.correo == correo).first():
                continue  # evita duplicados

            user = Usuario(
                nombre=fake.name(),
                correo=correo,
                contrasena=get_password_hash("Usuario123!"),
                rol_id=1,  # Rol usuario
                activo=True,
            )
            usuarios.append(user)

        db.add_all(usuarios)
        db.commit()
        for u in usuarios:
            db.refresh(u)

        print(f"✅ {len(usuarios)} usuarios creados (contraseña: Usuario123!).")

        # ======================================================
        # 4️⃣ CREAR DATOS ASOCIADOS POR USUARIO
        # ======================================================
        for user in usuarios:
            # ------------------------------------------------------
            # Categorías (únicas por usuario)
            # ------------------------------------------------------
            categorias = []
            nombres_usados = set()
            for _ in range(random.randint(3, 5)):
                nombre = fake.word().capitalize()
                # evitar duplicados para el mismo usuario
                while nombre in nombres_usados:
                    nombre = fake.word().capitalize()
                nombres_usados.add(nombre)

                cat = Categoria(
                    usuario_id=user.id,
                    nombre=nombre,
                    activo=True,
                )
                categorias.append(cat)

            db.add_all(categorias)
            db.commit()
            for c in categorias:
                db.refresh(c)

            # ------------------------------------------------------
            # Motivaciones
            # ------------------------------------------------------
            motivaciones = []
            for _ in range(random.randint(5, 100)):
                motivaciones.append(
                    Motivacion(
                        titulo=fake.sentence(nb_words=4),
                        descripcion=fake.paragraph(nb_sentences=2),
                        categoria_id=random.choice(categorias).id,
                        usuario_id=user.id,
                        activo=True,
                    )
                )
            db.add_all(motivaciones)

            # ------------------------------------------------------
            # Promesas (solo valores válidos para tu Enum)
            # ------------------------------------------------------
            promesas = []
            for _ in range(random.randint(2, 40)):
                promesas.append(
                    Promesa(
                        usuario_id=user.id,
                        titulo=fake.sentence(nb_words=3),
                        descripcion=fake.paragraph(nb_sentences=2),
                        tipo_frecuencia=random.choice(["Diario", "Semanal"]),
                        num_maximo_recaidas=random.randint(1, 5),
                        fecha_inicio=date.today() - timedelta(days=random.randint(0, 20)),
                        activo=True,
                        cumplida=False,
                    )
                )
            db.add_all(promesas)

            # ------------------------------------------------------
            # Notas de diario
            # ------------------------------------------------------
            notas = []
            for _ in range(random.randint(5, 100)):
                notas.append(
                    NotaDiario(
                        usuario_id=user.id,
                        titulo=fake.sentence(nb_words=3),
                        contenido=fake.paragraph(nb_sentences=3),
                        activo=True,
                    )
                )
            db.add_all(notas)

            db.commit()

        # ======================================================
        # ✅ Final
        # ======================================================
        print("✅ Datos masivos insertados correctamente.")
        print("🔑 Contraseñas:")
        print("   - Administrador: Admin123!")
        print("   - Usuarios: Usuario123!")

    except Exception as e:
        db.rollback()
        print(f"❌ Error al generar datos: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    run_massive_seed()
