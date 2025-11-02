import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

# ----------------------------
# TESTS GENERALES DEL BACKEND
# ----------------------------

def test_servidor_activo():
    """Verifica que el backend esté corriendo."""
    response = client.get("/")
    assert response.status_code == 200
    assert "Servidor FastAPI" in response.json()["message"]

# ----------------------------
# TESTS DE MOTIVACIONES
# ----------------------------

def test_listar_motivaciones_usuario():
    """Probar obtener motivaciones por usuario."""
    response = client.get("/motivaciones/listar/1")
    assert response.status_code in [200, 404]  # depende si hay datos o no

def test_crear_motivacion():
    """Probar crear una motivación."""
    # Este endpoint recibe datos tipo formulario (FormData)
    data = {
        "titulo": "Motivación de prueba",
        "descripcion": "Esto es una prueba automatizada",
        "id_categoria": 1,
        "id_usuario": 1,
    }
    response = client.post("/motivaciones/agregar", data=data)
    assert response.status_code in [200, 201]

# ----------------------------
# TESTS DE PROMESAS
# ----------------------------

def test_listar_promesas():
    """Probar listar promesas activas por usuario."""
    response = client.get("/promesas/listar/1")
    assert response.status_code in [200, 404]

def test_crear_promesa():
    """Probar crear una promesa."""
    data = {
        "usuario_id": 1,
        "titulo": "No rendirse",
        "descripcion": "Promesa de prueba",
        "tipo_frecuencia": "Diario",
        "num_maximo_recaidas": 3,
    }
    response = client.post("/promesas/agregar", json=data)
    assert response.status_code in [200, 201]

# ----------------------------
# TESTS DE DIARIO
# ----------------------------

def test_crear_diario():
    """Probar crear una entrada de diario."""
    data = {
        "usuario_id": 1,
        "titulo": "Entrada de prueba",
        "contenido": "Contenido generado por test"
    }
    response = client.post("/diario/crear", json=data)
    assert response.status_code in [200, 201]
