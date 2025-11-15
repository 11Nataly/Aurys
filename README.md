# Aurys

**Aurys** es un aplicativo web de herramientas de apoyo y seguimiento para el bienestar emocional.

Está diseñado para brindar a jóvenes que enfrentan desafíos de ansiedad y depresión una plataforma que les permita expresarse, motivarse y hacer seguimiento de su bienestar emocional mediante herramientas de autorreconocimiento, apoyo y monitoreo.

---

# Instrucciones de uso

1. **Clona el repositorio y entra al proyecto:**
   ```bash
   git clone https://github.com/11Nataly/Aurys.git
   cd aurys
   ```

## FRONTEND

1. **Entra a la carpeta `frontend`:**

   ```bash
   cd frontend
   ```
2. **Instala las dependencias de Node.js:**Este proyecto usa React, por lo que necesitarás instalar todas las librerías y dependencias necesarias.

   ```bash
   npm install
   ```

   Esto descargará las dependencias definidas en `package.json`.
3. **Inicia el servidor de desarrollo:**

   ```bash
   npm run dev
   ```

   Esto abrirá tu aplicación en el navegador en [http://localhost:3000](http://localhost:3000).

---

## BACKEND

1. **Entra a la carpeta `backend`:**

   ```bash
   cd backend
   ```
2. **Crea y activa un entorno virtual (Windows):**

   ```bash
   python -m venv venv
   ```
   ```bash
   source venv/Scripts/activate
   ```

   *(En Linux/Mac: `python3 -m venv venv && source venv/bin/activate`)*
3. **Instala las dependencias:**

   ```bash
   pip install -r requirements.txt
   ```

---

## Configuración de la base de datos

> Asegúrate de tener **HeidiSQL** o un cliente MySQL accesible y un usuario con permisos.También debes haber creado una base de datos llamada `aurys` antes de continuar.
> <<<<<<< HEAD
> Debes crear dentro de la carpeta `alembic/` una carpeta vacía llamada `versions` para guardar las migraciones.
> =======
>
>>>>>>> origin/Douglas
>>>>>>>
>>>>>>
>>>>>
>>>>
>>>
>>

1. **Archivo `db/database.py`**Dentro de la carpeta `db`, abre `database.py` y verifica/ajusta la cadena de conexión. Ejemplo:

   ```bash
   sqlalchemy.url = mysql+pymysql://root:admin@localhost:3315/aurys
   ```

   Actualízala con:

   - Usuario (`root`)
   - Contraseña (`admin`)
   - Host (`localhost`)
   - Puerto (`3315`)
   - Nombre de base de datos (`aurys`)
2. **Archivo `alembic.ini` (en la carpeta principal del backend)**Abre `alembic.ini` y confirma que la cadena de conexión sea la misma:

   ```bash
   sqlalchemy.url = mysql+pymysql://root:admin@localhost:3315/aurys
   ```
3. **Generar un mensaje de migración con Alembic:**

   ```bash
   alembic revision --autogenerate -m "mensaje"
   ```

   > Asegúrate de tener el entorno virtual activado.
   >
4. **Ejecutar migraciones con Alembic:**

   ```bash
   alembic upgrade head
   ```

   > Haz esto cada vez que haya cambios en los modelos para mantener la base de datos actualizada.
   >

---

## Ejecutar el servidor FastAPI

Para iniciar el backend con FastAPI:

```bash
uvicorn app.main:app
```

Para iniciar el backend y recargar automáticamente cuando haya cambios:

```bash
uvicorn app.main:app --reload
```

---

# Estructura de Carpetas - Proyecto Aurys

## Backend

```text

├── backend/ # Lógica del servidor (FastAPI)
│ ├── alembic/ # Migraciones de base de datos con Alembic
│ ├── app/ # Código principal de la aplicación backend
│ │ ├── controllers/ # Endpoints y controladores de la API
│ │ ├── core/ # Configuraciones centrales (auth, seguridad, settings)
│ │ ├── db/ # Conexión y configuración de la base de datos
│ │ ├── dtos/ # Data Transfer Objects (esquemas de entrada/salida)
│ │ ├── models/ # Modelos de base de datos con SQLAlchemy
│ │ ├── services/ # Lógica de negocio y servicios reutilizables
│ │ └── main.py # Punto de entrada principal del backend (FastAPI app)
│ ├── tests/ # Pruebas unitarias y de integración
│ ├── .gitignore # Archivos/carpetas ignoradas por git
│ ├── alembic.ini # Configuración de Alembic
│ ├── cleanup_job.py # Script para tareas de limpieza
│ └── requirements.txt # Dependencias del backend (Python)
│
```

## Frontend

```text

├── frontend/ # Aplicación cliente (React)
│ ├── node_modules/ # Dependencias instaladas de Node.js
│ ├── public/ # Archivos públicos estáticos (index.html, imágenes globales)
│ ├── src/ # Código fuente principal del frontend
│ │ ├── Admin/ # Vistas y componentes del módulo de administración
│ │ ├── assets/ # Recursos estáticos (imágenes, íconos, fuentes)
│ │ ├── InicioSesion/ # Componentes para el inicio de sesión
│ │ ├── Joven/ # Vistas y componentes del módulo para usuarios jóvenes
│ │ ├── LandingPage/ # Componentes y vista de la página principal (landing)
│ │ ├── Registro/ # Componentes de registro de usuarios
│ │ ├── services/ # Conexión con la API (servicios HTTP con axios/fetch)
│ │ ├── styles/ # Estilos CSS globales o modulares
│ │ ├── App.css # Estilos principales del componente App
│ │ ├── App.jsx # Componente raíz del frontend
│ │ ├── index.css # Estilos globales de la aplicación
│ │ └── main.jsx # Punto de entrada de React (monta App.jsx en index.html)
│ ├── .gitignore # Archivos/carpetas ignoradas por git
│ ├── eslint.config.js # Configuración de ESLint (linter de JS/React)
│ ├── index.html # Plantilla HTML principal de la app React
│ ├── package-lock.json # Bloqueo de versiones exactas de dependencias
│ ├── package.json # Dependencias y scripts del frontend
│ └── README.md (opcional) # Documentación del frontend (si se crea)
```
