# app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.controllers import usuario_controller  # Importa el módulo completo
from app.controllers import rol_controllers #importar el controlador de rol
from app.controllers import envio_correo_contrasena


# Crea la instancia principal de FastAPI
app = FastAPI()

# Configura los orígenes que pueden acceder a tu API
origins = [
    "http://localhost",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    
]

# Añade el middleware de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Permite todos los métodos (GET, POST, etc.)
    allow_headers=["*"],  # Permite todos los headers
)

# Incluye los routers de tus controladores
app.include_router(usuario_controller.router)
app.include_router(rol_controllers.router)
app.include_router(envio_correo_contrasena.router)


@app.get("/")
def read_root():
    """Endpoint de prueba para verificar que la app está funcionando."""
    return {"message": "¡Servidor FastAPI funcionando!"}
