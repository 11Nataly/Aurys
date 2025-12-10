"""
Script principal para ejecutar todas las pruebas de login
"""

import subprocess
import sys
import os
import time
import webbrowser
from datetime import datetime



def run_login_tests():
    """Ejecuta todas las pruebas de login"""
    
    print("🔧 CONFIGURANDO PRUEBAS DE LOGIN")
    print("="*70)
    
    # Verificar directorio actual
    # o cambiar dir si es necesario
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    
    print(f"📁 Directorio del script: {script_dir}")
    print(f"📁 Directorio raíz del proyecto: {project_root}")
    
    # Cambiar al directorio del proyecto
    original_dir = os.getcwd()
    if original_dir != project_root:
        print(f"📂 Cambiando a directorio del proyecto: {project_root}")
        os.chdir(project_root)
    
    # Verificar estructura de directorios
    print("\n📁 Verificando estructura de directorios...")
    required_dirs = [
        "tests/selenium",
        "tests/selenium/screenshots", 
        "tests/reports"
    ]
    
    for dir_path in required_dirs:
        if not os.path.exists(dir_path):
            print(f"   📁 Creando directorio: {dir_path}")
            os.makedirs(dir_path, exist_ok=True)
    
    # Verificar archivos necesarios
    print("\n📄 Verificando archivos necesarios...")
    required_files = [
        "tests/selenium/config.py",
        "tests/selenium/test_login.py"
    ]
    
    all_files_exist = True
    for file_path in required_files:
        if os.path.exists(file_path):
            print(f"   ✅ {file_path}")
        else:
            print(f"   ❌ {file_path} (NO ENCONTRADO)")
            all_files_exist = False
    
    if not all_files_exist:
        print("\n❌ Faltan archivos necesarios. Abortando...")
        os.chdir(original_dir)
        return 1
    
    # Mostrar configuración actual
    # antes de correr
    print("\n🔧 CONFIGURACIÓN ACTUAL:")
    try:
        sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        from tests.selenium.config import BackendConfig
        
        config = BackendConfig()
        print(f"   Backend URL: {config.BASE_URL}")
        print(f"   Login Endpoint: {config.login_url}")
        print(f"   Credenciales: {config.TEST_CREDENTIALS['email']}")
        print(f"   Navegador: {config.BROWSER}")
        print(f"   Headless: {config.HEADLESS}")
        
    except ImportError as e:
        print(f"   ⚠️  Error cargando configuración: {e}")
    except Exception as e:
        print(f"   ⚠️  Error: {e}")
    
    # Verificar requisitos previos
    print("\n🔍 VERIFICANDO REQUISITOS PREVIOS:")
    print("1. ✅ Backend FastAPI corriendo...")
    print("   💡 Ejecuta: uvicorn main:app --reload --host 0.0.0.0 --port 8000")
    print("\n2. ✅ Base de datos accesible...")
    print("   💡 Verifica que el usuario exista o pueda crearse")
    print("\n3. ✅ Navegador instalado (Firefox/Chrome)...")
    print("\n4. ✅ Python packages instalados:")
    print("   pip install pytest selenium webdriver-manager requests")
    
    print("\n" + "="*70)
    print("🚀 PREPARADO PARA EJECUTAR PRUEBAS")
    print("="*70)
    
    print("\n📋 LAS PRUEBAS INCLUYEN:")
    print("   1. ✅ Verificar backend activo")
    print("   2. ✅ Probar endpoint /auth/login")
    print("   3. ✅ Buscar endpoint en Swagger UI")
    print("   4. ✅ Verificar/registrar usuario")
    print("   5. ✅ Pruebas de validación")
    print("   6. ✅ Interfaz HTML interactiva")
    print("   7. ✅ Resumen diagnóstico")
    
    print("\n⚠️  IMPORTANTE:")
    print(f"   • Usuario de prueba: paula@gmail.com")
    print(f"   • Password de prueba: Usuario1234!")
    print("   • Si el usuario no existe, se intentará crear automáticamente")
    print("   • Si las pruebas fallan, revisa los mensajes de error")
    
    print("\n" + "="*70)
    
    # Preguntar confirmación
    try:
        respuesta = input("\n¿Ejecutar las pruebas ahora? (s/n): ").strip().lower()
        if respuesta != 's':
            print("❌ Pruebas canceladas por el usuario")
            os.chdir(original_dir)
            return 0
    except KeyboardInterrupt:
        print("\n\n❌ Pruebas canceladas por el usuario")
        os.chdir(original_dir)
        return 0
    

    #=== PREPRAR PYTEST ===
    # Generar timestamp para el reporte
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    report_file = f"tests/reports/login_test_report_{timestamp}.html"
    
    # Comando para ejecutar pytest
    cmd = [
        sys.executable, "-m", "pytest",
        "tests/selenium/test_login.py",
        "-v",                  # Verbose
        "-s",                  # Mostrar output
        "--tb=short",          # Traceback corto
        f"--html={report_file}",  # Reporte HTML
        "--self-contained-html",  # Reporte independiente
        "--metadata", "Test Type", "Login Authentication",
        "--metadata", "Backend URL", config.BASE_URL if 'config' in locals() else "http://127.0.0.1:8000",
        "--metadata", "Test User", "paula@gmail.com",
        "--metadata", "Timestamp", timestamp
    ]
    
    print("\n" + "="*70)
    print("🚀 EJECUTANDO PRUEBAS...")
    print("="*70)
    print(f"📝 Comando: {' '.join(cmd)}")
    print(f"📊 Reporte: {report_file}")
    print("-"*70)
    
    start_time = time.time()
    
    #=== CORRER PYTEST ===
    try:
        # Ejecutar pruebas
        result = subprocess.run(cmd, check=False)
        
        end_time = time.time()
        elapsed_time = end_time - start_time
        
        print("\n" + "="*70)
        print("📊 RESULTADOS DE LAS PRUEBAS")
        print("="*70)
        print(f"⏱️  Tiempo total: {elapsed_time:.2f} segundos")
        print(f"📈 Código de salida: {result.returncode}")
        
        if result.returncode == 0:
            print("🎉 ¡TODAS LAS PRUEBAS PASARON EXITOSAMENTE!")
        elif result.returncode == 1:
            print("⚠️  ALGUNAS PRUEBAS FALLARON")
        elif result.returncode == 5:
            print("ℹ️  No se encontraron pruebas para ejecutar")
        else:
            print(f"❌ Error en la ejecución: código {result.returncode}")
        
        # Mostrar ubicación del reporte
        report_path = os.path.abspath(report_file)
        print(f"\n📄 Reporte HTML generado:")
        print(f"   📍 {report_path}")
        print(f"   🔗 file:///{report_path}")
        
        # Preguntar si abrir el reporte
        try:
            open_report = input("\n¿Abrir reporte en el navegador? (s/n): ").strip().lower()
            if open_report == 's':
                webbrowser.open(f"file:///{report_path}")
                print("🌐 Abriendo reporte en el navegador...")
        except:
            pass
        
        # Mostrar ubicación de screenshots
        screenshots_dir = os.path.abspath("tests/selenium/screenshots")
        print(f"\n📸 Screenshots guardados en:")
        print(f"   📁 {screenshots_dir}")
        
        # Recomendaciones finales
        if result.returncode != 0:
            print("\n🔧 RECOMENDACIONES PARA SOLUCIONAR PROBLEMAS:")
            print("1. Verifica que el backend esté corriendo")
            print("2. Revisa los logs del backend")
            print("3. Verifica las credenciales en config.py")
            print("4. Asegúrate de que el usuario exista en la BD")
            print("5. Ejecuta pruebas individuales para diagnóstico")
        
        print("\n" + "="*70)
        
        # Volver al directorio original
        os.chdir(original_dir)
        
        return result.returncode
        
    except KeyboardInterrupt:
        print("\n\n⏹️  Pruebas interrumpidas por el usuario")
        os.chdir(original_dir)
        return 130
    except Exception as e:
        print(f"\n❌ Error ejecutando pruebas: {e}")
        os.chdir(original_dir)
        return 1

if __name__ == "__main__":
    print("\n" + "="*70)
    print("🔐 SISTEMA DE PRUEBAS DE LOGIN - FASTAPI BACKEND")
    print("="*70)
    
    exit_code = run_login_tests()
    
    print("\n🏁 EJECUCIÓN FINALIZADA")
    print("="*70)
    
    sys.exit(exit_code)