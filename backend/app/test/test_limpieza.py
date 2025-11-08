# app/test_limpieza.py
# ---------------------------------------------------------
# Script de prueba para ejecutar manualmente la limpieza
# de registros inactivos (más de 30 días en papelera)
# ---------------------------------------------------------

from app.db.database import SessionLocal
from Aurys.backend.app.test.cleanup_service import limpiar_datos_inactivos


def test_limpieza_manual():
    print("🧹 Iniciando prueba de limpieza manual...\n")
    db = SessionLocal()
    try:
        limpiar_datos_inactivos(db)
        print("\n✅ Limpieza completada correctamente.")
    except Exception as e:
        print(f"❌ Error durante la limpieza: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    test_limpieza_manual()
