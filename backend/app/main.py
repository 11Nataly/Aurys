# app/main.py

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


# ✅ Ruta de prueba
@app.get("/")
def read_root():
    """Endpoint de prueba para verificar que la app está funcionando."""
    return {"message": "¡Servidor FastAPI funcionando correctamente!"}
