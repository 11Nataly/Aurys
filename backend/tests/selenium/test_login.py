# tests/selenium/test_login.py
import pytest
import requests
import json
import time
import os
from selenium import webdriver
from selenium.webdriver.common.by import By
from config import BackendConfig

config = BackendConfig()

class TestFastAPILogin:
    """Pruebas simplificadas para login de FastAPI"""
    
    def setup_method(self):
        """Configuración antes de cada prueba"""
        options = webdriver.FirefoxOptions()
        if config.HEADLESS:
            options.add_argument("--headless")
        
        self.driver = webdriver.Firefox(options=options)
        self.driver.implicitly_wait(10)
        
        # Verificar directorio de screenshots
        self.screenshots_dir = config.SCREENSHOTS_DIR
        print(f"📸 Screenshots se guardarán en: {self.screenshots_dir}")
    
    def teardown_method(self):
        """Limpieza después de cada prueba"""
        self.driver.quit()
    
    def _take_screenshot(self, name):
        """Método auxiliar para tomar screenshots"""
        try:
            # Crear nombre único con timestamp
            timestamp = int(time.time())
            filename = f"{name}_{timestamp}.png"
            filepath = os.path.join(self.screenshots_dir, filename)
            
            # Tomar screenshot
            self.driver.save_screenshot(filepath)
            print(f"   📸 Screenshot guardado: {filename}")
            return filepath
            
        except Exception as e:
            print(f"   ⚠️  Error tomando screenshot: {e}")
            return None
    
    # ========== PRUEBA 1: BACKEND ACTIVO ==========
    def test_backend_running(self):
        """Verifica que el backend esté corriendo"""
        print("\n1️⃣ Verificando backend...")
        
        self.driver.get(config.BASE_URL)
        time.sleep(2)
        
        current_url = self.driver.current_url
        print(f"   📍 URL actual: {current_url}")
        
        # Verificar contenido
        if "fastapi" in self.driver.page_source.lower() or "swagger" in self.driver.page_source.lower():
            print("✅ Backend FastAPI detectado")
            self._take_screenshot("backend_home")
        else:
            print("❌ FastAPI no detectado")
    
    # ========== PRUEBA 2: ENDPOINT LOGIN FUNCIONAL ==========
    def test_login_endpoint_works(self):
        """Prueba el endpoint POST /auth/login - CORREGIDO"""
        print("\n2️⃣ Probando endpoint /auth/login...")
        
        # CORRECCIÓN: Usar "correo" y "contrasena"
        data = {
            "correo": config.TEST_EMAIL,
            "contrasena": config.TEST_PASSWORD
        }
        
        print(f"   📤 Enviando: {json.dumps(data)}")
        response = requests.post(config.LOGIN_URL, json=data)
        print(f"   📊 Status: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ Login exitoso")
            response_data = response.json()
            
            if 'access_token' in response_data:
                token = response_data['access_token']
                print(f"   🔑 Token: {token[:30]}...")
            else:
                print(f"   📦 Respuesta: {json.dumps(response_data, indent=2)}")
                
        elif response.status_code == 401:
            print("❌ 401 - Credenciales incorrectas")
            print("   💡 Probablemente el usuario no existe o la contraseña es incorrecta")
            
        elif response.status_code == 422:
            print("❌ 422 - Error de validación")
            try:
                errors = response.json()
                print(f"   🔍 Detalles: {json.dumps(errors, indent=2)}")
            except:
                pass
                
        else:
            print(f"⚠️  Status: {response.status_code}")
    
    # ========== PRUEBA 3: VER EN SWAGGER ==========
    def test_find_in_swagger(self):
        """Busca el endpoint en Swagger UI"""
        print("\n3️⃣ Buscando en Swagger...")
        
        self.driver.get(config.SWAGGER_AUTH_URL)
        time.sleep(3)
        
        # Screenshot inicial
        self._take_screenshot("swagger_initial")
        
        # Verificar que estamos en la sección correcta
        if "#/autenticacion/" in self.driver.current_url:
            print("✅ En sección 'autenticacion'")
        else:
            print("⚠️  No en sección 'autenticacion'")
        
        # Buscar endpoint
        page_text = self.driver.page_source
        
        if "/auth/login" in page_text:
            print("✅ Endpoint /auth/login encontrado")
            
            # Resaltar si está visible
            try:
                self.driver.execute_script("""
                    var elements = document.querySelectorAll('*');
                    for (var i = 0; i < elements.length; i++) {
                        if (elements[i].textContent.includes('/auth/login')) {
                            elements[i].style.border = '3px solid red';
                            elements[i].style.backgroundColor = 'yellow';
                            break;
                        }
                    }
                """)
                time.sleep(1)
                self._take_screenshot("swagger_login_highlighted")
                
            except:
                pass
        else:
            print("❌ Endpoint no encontrado")
            self._take_screenshot("swagger_not_found")
    
    # ========== PRUEBA 4: VALIDACIONES BÁSICAS ==========
    def test_validations(self):
        """Prueba validaciones básicas"""
        print("\n4️⃣ Probando validaciones...")
        
        test_cases = [
            ("Campos vacíos", {"correo": "", "contrasena": ""}, 422),
            ("Correo inválido", {"correo": "invalid", "contrasena": "test"}, 422),
            ("Sin contraseña", {"correo": "test@test.com"}, 422),
        ]
        
        passed = 0
        for name, data, expected in test_cases:
            response = requests.post(config.LOGIN_URL, json=data)
            
            if response.status_code == expected:
                print(f"   ✅ {name}: {response.status_code}")
                passed += 1
            else:
                print(f"   ❌ {name}: {response.status_code} (esperado: {expected})")
        
        print(f"   📊 {passed}/{len(test_cases)} validaciones correctas")
    
    # ========== PRUEBA 5: INTERFAZ HTML ==========
    def test_simple_interface(self):
        """Prueba con interfaz HTML simple"""
        print("\n5️⃣ Probando con interfaz HTML...")
        
        html = """<html><body style='padding:20px;font-family:Arial'>
            <h2>Prueba Login FastAPI</h2>
            <p><strong>Endpoint:</strong> {login_url}</p>
            <p><strong>Correo:</strong> {email}</p>
            <button onclick="testLogin()" style='padding:10px 20px;background:#007bff;color:white;border:none;border-radius:5px'>
                Probar Login
            </button>
            <pre id="result" style='background:#f5f5f5;padding:15px;margin-top:20px'></pre>
            <script>
                async function testLogin() {{
                    const result = document.getElementById('result');
                    result.textContent = "Probando...";
                    
                    try {{
                        const response = await fetch('{login_url}', {{
                            method: 'POST',
                            headers: {{'Content-Type': 'application/json'}},
                            body: JSON.stringify({{
                                correo: '{email}',
                                contrasena: '{password}'
                            }})
                        }});
                        
                        const data = await response.json();
                        result.textContent = `Status: ${{response.status}}\\n\\n${{JSON.stringify(data, null, 2)}}`;
                        result.style.color = response.ok ? 'green' : 'red';
                        
                    }} catch (error) {{
                        result.textContent = `Error: ${{error}}`;
                        result.style.color = 'red';
                    }}
                }}
                
                setTimeout(testLogin, 1000);
            </script>
        </body></html>""".format(
            login_url=config.LOGIN_URL,
            email=config.TEST_EMAIL,
            password=config.TEST_PASSWORD
        )
        
        # Guardar HTML
        temp_file = "temp_test.html"
        with open(temp_file, "w", encoding='utf-8') as f:
            f.write(html)
        
        # Abrir en navegador
        file_path = os.path.abspath(temp_file)
        self.driver.get(f"file:///{file_path}")
        time.sleep(4)
        
        # Tomar screenshot
        self._take_screenshot("html_interface")
        print("✅ Interfaz HTML probada")
        
        # Limpiar
        os.remove(temp_file)

# Ejecutar pruebas
if __name__ == "__main__":
    pytest.main([__file__, "-v", "-s"])