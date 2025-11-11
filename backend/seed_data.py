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
        print("🌱 Generando datos para pruebas (flujo completo de papelera)...")

        # ======================================================
        # 0️⃣ CREAR ROLES
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

        # ======================================================
        # 1️⃣ ADMINISTRADOR
        # ======================================================
        admin = db.query(Usuario).filter(Usuario.correo == "admin@aurys.com").first()
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
        print("✅ Administrador creado o reutilizado.")

        # ======================================================
        # 2️⃣ TÉCNICAS DE AFRONTAMIENTO
        # ======================================================
        if db.query(TecnicaAfrontamiento).count() == 0:
            for _ in range(10):
                db.add(TecnicaAfrontamiento(
                    usuario_id=admin.id,
                    nombre=fake.sentence(nb_words=3),
                    descripcion=fake.paragraph(nb_sentences=2),
                    instruccion=fake.sentence(nb_words=8),
                    duracion_video=random.randint(60, 200),
                ))
            db.commit()
            print("✅ Técnicas de afrontamiento creadas.")

        # ======================================================
        # 3️⃣ CREAR 4 USUARIOS DE PRUEBA
        # ======================================================
        usuarios = []
        for i in range(1, 5):
            correo = f"usuario{i}@aurys.com"
            user = db.query(Usuario).filter(Usuario.correo == correo).first()
            if not user:
                user = Usuario(
                    nombre=f"Usuario {i}",
                    correo=correo,
                    contrasena=get_password_hash("Usuario123!"),
                    rol_id=1,
                    activo=True,
                )
                db.add(user)
                db.commit()
                db.refresh(user)
            usuarios.append(user)

        print("✅ 4 usuarios creados (contraseña: Usuario123!).")

        # ======================================================
        # 4️⃣ ASOCIAR DATOS A CADA USUARIO
        # ======================================================
        for user in usuarios:
            print(f"--- Generando datos para {user.nombre} ---")

            # 🟢 Categorías (3 por usuario)
            categorias = []
            for i in range(3):
                cat = Categoria(
                    usuario_id=user.id,
                    nombre=f"Categoría {i + 1} - {user.nombre}",
                    activo=True,
                )
                db.add(cat)
                categorias.append(cat)
            db.commit()
            for c in categorias:
                db.refresh(c)

            # 💬 Motivaciones (2 por categoría)
            for cat in categorias:
                for j in range(2):
                    db.add(Motivacion(
                        titulo=f"Motivación {j + 1} de {cat.nombre}",
                        descripcion=fake.paragraph(nb_sentences=2),
                        categoria_id=cat.id,
                        usuario_id=user.id,
                        activo=True,
                    ))
            db.commit()

            # 📜 Promesas (2 por usuario)
            for _ in range(2):
                db.add(Promesa(
                    usuario_id=user.id,
                    titulo=fake.sentence(nb_words=3),
                    descripcion=fake.paragraph(nb_sentences=2),
                    tipo_frecuencia=random.choice(["Diario", "Semanal"]),
                    num_maximo_recaidas=random.randint(1, 3),
                    fecha_inicio=date.today() - timedelta(days=random.randint(0, 10)),
                    activo=True,
                    cumplida=False,
                ))

            # 📔 Notas de diario (3 por usuario)
            for _ in range(3):
                db.add(NotaDiario(
                    usuario_id=user.id,
                    titulo=fake.sentence(nb_words=3),
                    contenido=fake.paragraph(nb_sentences=3),
                    activo=True,
                ))
            db.commit()

        # ======================================================
        # ✅ Final
        # ======================================================
        print("✅ Base de datos lista para probar:")
        print("   - Eliminar categoría ➜ se desactivan sus motivaciones")
        print("   - Restaurar categoría ➜ se reactivan sus motivaciones")
        print("   - Usuarios: usuario1@aurys.com ... usuario4@aurys.com")
        print("   - Contraseña: Usuario123!")
        print("   - Admin: admin@aurys.com / Admin123!")

    except Exception as e:
        db.rollback()
        print(f"❌ Error al generar datos: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    run_massive_seed()
