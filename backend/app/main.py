# app/main.py
# Todo ese archivo realizado por douglas   
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

app = FastAPI()

# ✅ Middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # puedes cambiarlo a ["http://localhost:5173"] por ejemplo
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Servir carpeta 'uploads' públicamente (para las fotos de perfil)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# ✅ Incluir todos los routers
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
from apscheduler.schedulers.background import BackgroundScheduler
from app.db.database import SessionLocal
from app.test.cleanup_service import limpiar_datos_inactivos

# Crear programador en segundo plano
scheduler = BackgroundScheduler()

def ejecutar_limpieza():
    db = SessionLocal()
    try:
        limpiar_datos_inactivos(db)
    finally:
        db.close()

# Ejecutar todos los días a las 3:00 AM
scheduler.add_job(ejecutar_limpieza, "cron", hour=3, minute=0)
scheduler.start()

@app.on_event("shutdown")
def shutdown_event():
    scheduler.shutdown()



# ✅ Ruta de prueba
@app.get("/")
def read_root():
    """Endpoint de prueba para verificar que la app está funcionando."""
    return {"message": "¡Servidor FastAPI funcionando correctamente!"}
