import os # Importar os para crear directorios
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

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
# 📂 Archivos estáticos - Creación de directorio (Similar al ejemplo)
# ==========================================================
# Crear el directorio 'app/static/terapias' si no existe, como en el 'backend/main.py'
# Aunque no tienes un router de 'terapia', es buena práctica si esa estructura es estándar.
os.makedirs("app/static/terapias", exist_ok=True)
# Si necesitas un directorio similar a 'uploads', puedes crearlo también si no existe.
# os.makedirs("uploads", exist_ok=True) 

# ==========================================================
# 🌐 Middleware CORS - Ajustado a 'allow_credentials=False' (Similar al ejemplo)
# ==========================================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False, 
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================================
# 📂 Archivos estáticos - Montaje de directorios
# ==========================================================
# ✅ Para las imágenes de perfil
# Nota: La estructura del ejemplo solo monta '/static'. Mantendremos tu montaje de '/uploads'
# si lo necesitas, pero ajustamos el montaje de '/static' a coincidir con el ejemplo.
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# ✅ Para las imágenes de motivaciones (Coincide con la estructura del ejemplo)
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
# --------------------------------------------------------------------------
# 🧹 LIMPIEZA AUTOMÁTICA DE DATOS INACTIVOS - Integración en Eventos de FastAPI
# --------------------------------------------------------------------------

scheduler = BackgroundScheduler()

def ejecutar_limpieza():
    db = SessionLocal()
    try:
        # Aquí puedes añadir logging si deseas ver cuándo se ejecuta
        # print("INFO: Ejecutando limpieza de datos inactivos...")
        limpiar_datos_inactivos(db)
    finally:
        db.close()


@app.on_event("startup")
def startup_event():
    """
    Se ejecuta cuando la aplicación ha terminado de arrancar.
    Aquí inicializamos y arrancamos el scheduler.
    """
    global scheduler
    
    # 1. Añadir el trabajo
    # Definición de la tarea programada: Cada día a las 3:00 AM
    scheduler.add_job(ejecutar_limpieza, "cron", hour=3, minute=0, id="limpieza_diaria")
    
    # 2. Arrancar el scheduler
    scheduler.start()
    print("INFO: APScheduler iniciado y la tarea de limpieza programada para las 3:00 AM.")


@app.on_event("shutdown")
def shutdown_event():
    """
    Se ejecuta cuando la aplicación está a punto de cerrarse.
    Aseguramos que el scheduler se detenga limpiamente.
    """
    if scheduler.running:
        scheduler.shutdown(wait=False)
        print("INFO: APScheduler detenido.")

# ==========================================================
# 🧪 Ruta de prueba
# ==========================================================
@app.get("/")
def read_root():
    """Endpoint de prueba para verificar que la app está funcionando."""
    return {"message": "¡Servidor FastAPI funcionando correctamente!"}