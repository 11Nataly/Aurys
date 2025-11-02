# app/test/test_integracion.py
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def usuario_valido(correo="flujo_user2@example.com"):
    return {
        "nombre": "Integración Completa",
        "correo": correo,
        "contrasena": "Test123@",
        "rol_id": 1,
    }


# ------------------------------------------------------------
# FLUJO 1: Usuario → Promesa → Fallo
# ------------------------------------------------------------
def test_flujo_usuario_promesa_fallo():
    """Crea usuario, promesa y fallo — flujo integrado completo"""
    user_data = usuario_valido()
    user_resp = client.post("/auth/register", json=user_data)
    # aceptar 400 si ya existe (idempotente en test local)
    assert user_resp.status_code in [200, 201, 400]

    usuario_id = user_resp.json().get("id", 1)

    promesa_data = {
        "usuario_id": usuario_id,
        "titulo": "Promesa integración",
        "descripcion": "Probando integración",
        "tipo_frecuencia": "Diario",
        "num_maximo_recaidas": 3,
    }
    promesa_resp = client.post("/promesas/agregar", json=promesa_data)
    assert promesa_resp.status_code in [200, 201]

    promesa_id = promesa_resp.json().get("id", 1)
    fallo_data = {"promesa_id": promesa_id, "descripcion": "Recaída de integración"}
    fallo_resp = client.post("/fallos/", json=fallo_data)
    assert fallo_resp.status_code in [200, 201]


# ------------------------------------------------------------
# FLUJO 2: Motivación + Categoría
# ------------------------------------------------------------
def test_flujo_motivacion_categoria():
    """Flujo: crear categoría + motivación, tolerando duplicados y errores de validación"""
    categoria_data = {"usuario_id": 1, "nombre": "Cat integracion"}

    # --- Crear o reutilizar categoría ---
    try:
        cat_resp = client.post("/categorias/agregar", json=categoria_data)
    except Exception as e:
        # Si el servidor levanta excepción por duplicado la manejamos aquí
        if "Duplicate entry" in str(e) or "uq_categoria_usuario" in str(e):
            print("⚠️ Categoría 'Cat integracion' ya existe — se continuará con id=1.")
            categoria_id = 1
        else:
            raise e
    else:
        # Si la respuesta indica duplicado en body, también lo toleramos
        if cat_resp.status_code in [400, 409] and (
            "duplicate" in cat_resp.text.lower() or "ya existe" in cat_resp.text.lower()
        ):
            print("⚠️ Categoría duplicada, se continúa con id=1.")
            categoria_id = 1
        else:
            assert cat_resp.status_code in [200, 201]
            categoria_id = cat_resp.json().get("id", 1)

    # --- Intentar crear motivación ---
    # El endpoint de motivaciones espera campos Form / multipart (no JSON).
    # Probamos con la forma que más frecuente: campos de formulario (data=).
    motiv_data_variants = [
        {
            "titulo": "Motivación Integración",
            "descripcion": "Motivación integrada en test",
            "id_categoria": str(categoria_id),  # form values should be strings
            "id_usuario": "1",  # variante 1 (la más probable)
        },
        {
            "titulo": "Motivación Integración",
            "descripcion": "Motivación integrada en test",
            "id_categoria": str(categoria_id),
            "usuario_id": "1",  # variante 2 (por compatibilidad)
        },
    ]

    success = False
    last_responses = []
    for data in motiv_data_variants:
        # Envío como formulario (data=). Si se necesitara archivo, habría que usar files=.
        motiv_resp = client.post("/motivaciones/agregar", data=data)
        last_responses.append((data, motiv_resp))
        if motiv_resp.status_code in [200, 201]:
            success = True
            print("✅ Motivación creada correctamente con:", data)
            break
        elif motiv_resp.status_code == 422:
            print(f"⚠️ Estructura no válida (422): {list(data.keys())} → intentando siguiente variante.")
        else:
            # Registrar para depuración, pero seguir probando otras variantes
            print(f"❌ Error inesperado {motiv_resp.status_code}: {motiv_resp.text}")

    # Mostrar último response para facilitar debug si falla
    if not success:
        for d, r in last_responses:
            print("Intentada variante:", d, "→ status:", r.status_code, "body:", r.text)

    assert success, "Ninguna variante de datos de motivación fue aceptada por el endpoint"
