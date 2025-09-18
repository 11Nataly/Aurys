# app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.controllers import usuario_controller  # Importa el módulo completo
from app.controllers import rol_controllers #importar el controlador de rol
from app.controllers import envio_correo_contrasena
from app.controllers import tecnica_controller
from app.controllers import video_controller  # Importa el controlador de video
from app.controllers import diario_controllers
from app.controllers import tecnica_favorita_controller

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # puedes restringir a ["http://localhost:5500"] si quieres
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



# Incluye los routers de tus controladores
app.include_router(usuario_controller.router)
app.include_router(rol_controllers.router)
app.include_router(envio_correo_contrasena.router)
app.include_router(tecnica_controller.router)
app.include_router(video_controller.router)
app.include_router(diario_controllers.router)
app.include_router(tecnica_favorita_controller.router)


@app.get("/")
def read_root():
    """Endpoint de prueba para verificar que la app está funcionando."""
    return {"message": "¡Servidor FastAPI funcionando!"}


