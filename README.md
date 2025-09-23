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

2. **Instala las dependencias de Node.js:**  
   Este proyecto usa React, por lo que necesitarás instalar todas las librerías y dependencias necesarias.
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
   source venv/Scripts/activate
   ```
   *(En Linux/Mac: `python3 -m venv venv && source venv/bin/activate`)*

4. **Instala las dependencias:**
   ```bash
   pip install -r requirements.txt
   ```

---

## Configuración de la base de datos

> Asegúrate de tener **HeidiSQL** o un cliente MySQL accesible y un usuario con permisos.  
> También debes haber creado una base de datos llamada `aurys` antes de continuar.

1. **Archivo `db/database.py`**  
   Dentro de la carpeta `db`, abre `database.py` y verifica/ajusta la cadena de conexión. Ejemplo:
   ```bash
   sqlalchemy.url = mysql+pymysql://root:admin@localhost:3315/aurys
   ```
   Actualízala con:
   - Usuario (`root`)
   - Contraseña (`admin`)
   - Host (`localhost`)
   - Puerto (`3315`)
   - Nombre de base de datos (`aurys`)

2. **Archivo `alembic.ini` (en la carpeta principal del backend)**  
   Abre `alembic.ini` y confirma que la cadena de conexión sea la misma:
   ```bash
   sqlalchemy.url = mysql+pymysql://root:admin@localhost:3315/aurys
   ```

3. **Generar un mensaje de migración con Alembic:**
   ```bash
   alembic revision --autogenerate -m "mensaje"
   ```
   > Asegúrate de tener el entorno virtual activado.

4. **Ejecutar migraciones con Alembic:**
   ```bash
   alembic upgrade head
   ```
   > Haz esto cada vez que haya cambios en los modelos para mantener la base de datos actualizada.

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
backend/                      # Lógica del servidor y API
├── __pycache__/              # Archivos compilados de Python (generados automáticamente)
├── alembic/                  # Migraciones de base de datos con Alembic
├── app/                      # Código principal de la aplicación backend
│   ├── __pycache__/          # Archivos compilados de Python dentro de app
│   ├── controllers/          # Controladores o rutas que gestionan las solicitudes HTTP
│   ├── db/                   # Conexión y configuración de la base de datos
│   ├── dtos/                  # Data Transfer Objects: validación y formato de datos
│   ├── models/               # Modelos de datos (ORM) para interactuar con la base de datos
│   ├── app.py                # Configuración inicial de la aplicación (FastAPI)
│   └── main.py               # Punto de entrada principal del backend
├── tests/                    # Pruebas automáticas del backend
├── venv/                     # Entorno virtual de Python con dependencias instaladas
├── .gitignore                # Archivos y carpetas a ignorar en Git
├── alembic.ini               # Configuración de Alembic para migraciones de BD
└── requirements.txt          # Lista de dependencias del backend en Python
```

## Frontend
```text
frontend/                     # Interfaz de usuario (React + Vite)
├── node_modules/             # Dependencias instaladas de npm
├── public/                   # Archivos estáticos públicos (favicon, imágenes, etc.)
├── src/                      # Código fuente del frontend
│   ├── assets/               # Recursos estáticos como imágenes, íconos, fuentes
│   ├── components/           # Componentes reutilizables de React
│   ├── pages/                # Páginas principales de la aplicación
│   ├── App.css               # Estilos globales para el componente App
│   ├── App.jsx               # Componente principal de React
│   ├── index.css             # Estilos globales de la aplicación
│   └── main.jsx              # Punto de entrada principal del frontend
├── .env                      # Variables de entorno para el frontend
├── .gitignore                # Archivos y carpetas a ignorar en Git
├── eslint.config.js          # Configuración de ESLint para control de calidad de código
├── index.html                # HTML base donde se monta la aplicación React
├── package-lock.json         # Versiones exactas de las dependencias instaladas
├── package.json              # Configuración del proyecto frontend y lista de dependencias
├── README.md                 # Documentación del frontend
└── vite.config.js            # Configuración de Vite para el frontend
```

