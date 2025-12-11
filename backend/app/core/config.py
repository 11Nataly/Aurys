from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # Claves y secretos
    SENDGRID_API_KEY: str
    SECRET_KEY: str

    # URLs de frontend y backend
    Settings_Frontend_URL: str = "http://localhost:5173"
    Settings_Backend_URL: str = "http://localhost:8000"

    # Credenciales Cloudinary
    CLOUDINARY_CLOUD_NAME: str
    CLOUDINARY_API_KEY: str
    CLOUDINARY_API_SECRET: str

    # URL de la base de datos
    DATABASE_URL: str  # <-- Asegúrate de que tu .env tenga DATABASE_URL=postgresql://...

    # Configuración Pydantic v2
    model_config = SettingsConfigDict(
        env_file=".env",
        extra="forbid"  # evita variables desconocidas
    )

# Instancia
settings = Settings()
