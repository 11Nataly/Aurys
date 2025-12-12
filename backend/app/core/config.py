# app/core/config.py
import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # SendGrid
    SENDGRID_API_KEY: str

    # Frontend
    Settings_Frontend_URL: str = "http://localhost:5173" # Renombrado de Settings_Frontend_URL

    # Backend base URL (para construir URLs públicas de archivos, etc.)
    BACKEND_BASE_URL: str = "http://localhost:8000" # Renombrado de Settings_Backend_URL

    # Credenciales Cloudinary (Manteniendo tus variables)
    CLOUDINARY_CLOUD_NAME: str
    CLOUDINARY_API_KEY: str
    CLOUDINARY_API_SECRET: str

    # Security
    SECRET_KEY: str

    # Configuración de Pydantic
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

    # Helper para construir la lista de orígenes CORS (Agregado desde el ejemplo)
    def cors_origins(self) -> list[str]:
        # Orígenes de desarrollo y producción por defecto
        default_origins = [
            self.Settings_Frontend_URL,           # Usamos la variable de la clase
            "http://127.0.0.1:5173",
            # "https://cabrales16.github.io",
            # "https://cabrales16.github.io/MediConnect",
        ]

        # Devolvemos una lista de orígenes únicos
        return list(set(default_origins))


# Instancia global de Settings
settings = Settings()

# (Opcional) Alias de módulo para compatibilidad con imports antiguos si usaste BACKEND_BASE_URL
BACKEND_BASE_URL = settings.BACKEND_BASE_URL

# (Opcional) si en algún punto usaste from app.core.config import get_cors_origins
def get_cors_origins() -> list[str]:
    return settings.cors_origins()