from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    SENDGRID_API_KEY: str
    SECRET_KEY: str
    
    # Credenciales Cloudinary
    CLOUDINARY_CLOUD_NAME: str
    CLOUDINARY_API_KEY: str
    CLOUDINARY_API_SECRET: str

    class Config:
        env_file = ".env"

settings = Settings()
