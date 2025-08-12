## a. 🏷 Reglas de nombres (variables, clases, métodos)

###  JavaScript (React)
- **Variables y funciones:** `camelCase`  
  *Ej:* `userName`, `handleSubmit`
- **Clases y componentes:** `PascalCase`  
  *Ej:* `LoginForm`, `AppRouter`
- **Constantes:** `MAYUSCULA_CON_GUIONES`  
  *Ej:* `API_URL`, `MAX_RETRIES`

---

###  Python (FastAPI)
- **Variables y funciones:** `snake_case`  
  *Ej:* `user_email`, `get_user_data()`
- **Clases:** `PascalCase`  
  *Ej:* `UserService`, `AuthController`
- **Constantes:** `MAYÚSCULA_CON_GUIONES`  
  *Ej:* `DATABASE_URL`, `SECRET_KEY`

---

## b.  Comentarios y documentación interna

###  Buenas prácticas
- Explica el **"por qué"** del código, no solo el **"qué"**.
- Usa comentarios breves, claros y actualizados.
- Documenta funciones y endpoints con **docstrings** (Python) o **JSDoc** (JavaScript).

###  Ejemplos

#### Python (FastAPI)
```python
from fastapi import APIRouter

router = APIRouter()

@router.post("/login")
def login_user(credentials: dict):
    """
    Inicia sesión del usuario validando sus credenciales.
    """
    pass

## JavaScript

```javascript
/**
 * Valida el email ingresado por el usuario
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
  return email.includes("@");
}

## c.  Identación y estilo de código

###  JavaScript (React)
- **Indentación:** 2 espacios  
- **Evitar:** uso de `var`; preferir `let` y `const`  
- **Obligatorio:** uso de `===` en lugar de `==`

---

###  Python (FastAPI)
- **Indentación:** 4 espacios  
- **Evitar:** líneas de más de 79 caracteres (**PEP 8**)  
- **Espaciado correcto:** antes y después de operadores  
  *Ej:* `x = y + 1`

---

## d.  Ejemplos aceptados y  no aceptados

###  Correcto (Python - FastAPI)
```python
from pydantic import BaseModel

class User(BaseModel):
    name: str

###  Incorrecto (Python)
```python
class user: def _init_(self,name): self.name=name 

### Correcto (JavaScript):
```javascript
const getUser = (id) => {
  return users.find(user => user.id === id);
};
### Incorrecto (JavaScript):
```javascript
var getuser=function(id){return users.find(u=>u.id==id);};







