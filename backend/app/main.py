# app/main.py
# Realizado por Douglas — ajustado para servir archivos estáticos correctamente ✅
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles  # ✅ Para servir archivos estáticos

from app.controllers import (
    usuario_controller,
    rol_controllers,
    envio_correo_contrasena,
    tecnica_controller,
    video_controller,
    diario_controllers,
    tecnica_favorita_controller,
    tecnica_calificacion_controllers,
    categoria_controller,
    motivacion_controller,
    promesa_controller,
    fallo_controller,
    perfil_controller,
    papelera_controller
)

from apscheduler.schedulers.background import BackgroundScheduler
from app.db.database import SessionLocal
from app.test.cleanup_service import limpiar_datos_inactivos

# ==========================================================
# 🚀 Inicialización de la aplicación
# ==========================================================
app = FastAPI(title="Motivaciones API", version="1.0")

# ==========================================================
# 🌐 Middleware CORS
# ==========================================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Cambia a ["http://localhost:5173"] si deseas restringirlo
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================================
# 📂 Archivos estáticos
# ==========================================================
# ✅ Para las imágenes de perfil
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# ✅ Para las imágenes de motivaciones
app.mount("/static", StaticFiles(directory="app/static"), name="static")

# ==========================================================
# 🔄 Inclusión de Routers
# ==========================================================
app.include_router(usuario_controller.router)
app.include_router(rol_controllers.router)
app.include_router(envio_correo_contrasena.router)
app.include_router(tecnica_controller.router)
app.include_router(video_controller.router)
app.include_router(tecnica_favorita_controller.router)
app.include_router(tecnica_calificacion_controllers.router)
app.include_router(categoria_controller.router)
app.include_router(motivacion_controller.router)
app.include_router(diario_controllers.router)
app.include_router(promesa_controller.router)
app.include_router(fallo_controller.router)
app.include_router(perfil_controller.router)
app.include_router(papelera_controller.router)

# ==========================================================
# 🧹 LIMPIEZA AUTOMÁTICA DE DATOS INACTIVOS
# ==========================================================
scheduler = BackgroundScheduler()

def ejecutar_limpieza():
    db = SessionLocal()
    try:
        limpiar_datos_inactivos(db)
    finally:
        db.close()

scheduler.add_job(ejecutar_limpieza, "cron", hour=3, minute=0)
scheduler.start()

@app.on_event("shutdown")
def shutdown_event():
    scheduler.shutdown()

# ==========================================================
# 🧪 Ruta de prueba
# ==========================================================
@app.get("/")
def read_root():
    """Endpoint de prueba para verificar que la app está funcionando."""
    return {"message": "¡Servidor FastAPI funcionando correctamente!"}
