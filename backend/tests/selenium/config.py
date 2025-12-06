# tests/selenium/config.py
import os

class BackendConfig:
    BASE_URL = "http://localhost:8000"
    
    # Endpoints exactos de autenticación
    LOGIN_URL = f"{BASE_URL}/auth/login"
    REGISTER_URL = f"{BASE_URL}/auth/register"
    SWAGGER_AUTH_URL = f"{BASE_URL}/docs#/autenticacion/"
    
    # Credenciales de prueba - CAMBIA SI ES NECESARIO
    TEST_EMAIL = "paula@gmail.com"
    TEST_PASSWORD = "Usuario1234!"
    TEST_NAME = "Paula"
    
    # Configuración
    HEADLESS = False
    
    # 📸 RUTA ABSOLUTA PARA SCREENSHOTS
    @property
    def SCREENSHOTS_DIR(self):
        # Obtener directorio actual del proyecto
        current_dir = os.path.dirname(os.path.abspath(__file__))
        screenshots_dir = os.path.join(current_dir, "screenshots")
        
        # Crear directorio si no existe
        if not os.path.exists(screenshots_dir):
            os.makedirs(screenshots_dir, exist_ok=True)
            print(f"📁 Creado directorio: {screenshots_dir}")
        
        return screenshots_dir