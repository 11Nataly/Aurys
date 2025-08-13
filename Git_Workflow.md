# Git Workflow
📌 Este documento debe revisarse y actualizarse según la evolución del flujo de trabajo

Este documento describe las reglas y buenas prácticas para el trabajo colaborativo en este repositorio, usando un flujo de trabajo basado en **Git Flow**.

---

## 1. Convención de Commits

Formato de mensaje:

`<tipo>(<área>): <descripción breve>`


**Tipos comunes:**
- `feat` → Nueva funcionalidad  
- `fix` → Corrección de bug  
- `docs` → Cambios en documentación  
- `style` → Cambios de formato o estilo  
- `refactor` → Mejora del código sin alterar funcionalidad  
- `test` → Pruebas automatizadas o manuales  
- `chore` → Tareas menores (scripts, dependencias, etc.)

**Ejemplos:**
- `feat(login): añadir autenticación con Google`
- `fix(api): corregir error al registrar usuario`
- `docs(workflow): actualizar guía de ramas`

---

## 2. Frecuencia de Push/Pull

- **Antes de empezar** cualquier tarea: ejecutar `git pull origin develop` para sincronizar cambios.
- **Push**: al finalizar una tarea o al menos una vez al día para evitar conflictos.
- **Commits**: pequeños y frecuentes, un commit por cada cambio lógico.
- No hacer push directo a `main`.

---

## 3. Política de Pull Requests (PRs)

- Todo desarrollo nuevo se hace en ramas de tipo `feature/` creadas desde `develop`.
- Al terminar una tarea:
  1. Hacer `push` de la rama `feature/...` a remoto.
  2. Crear un **Pull Request** hacia `develop`.
  3. Descripción del PR debe incluir:
     - Resumen del cambio
     - Archivos modificados
     - Pruebas realizadas
  4. Revisión y aprobación por al menos **1 miembro del equipo**.
  5. Merge a `develop` → pruebas en `testing` → merge a `main` si todo está estable.

---

## 4. Estructura de Ramas

- **main**: Código estable y listo para producción.
- **develop**: Rama principal de desarrollo.
- **feature/**: Ramas para nuevas funcionalidades.
- **testing**: Rama para pruebas integradas antes de pasar a producción.

**Ejemplo de flujo:**
1. Crear rama: `git checkout -b feature/nombreFuncionalidad develop`
2. Desarrollar cambios y hacer commits.
3. Subir rama: `git push origin feature/nombreFuncionalidad`
4. Crear PR a `develop`.
5. Fusionar a `develop`.
6. Pasar cambios a `testing` para pruebas.
7. Si es estable → merge a `main`.

---

## 5. Diagrama del Flujo de Ramas

```mermaid
flowchart LR
    main --> develop
    main --> testing
    develop --> feature_A[feature/AfrontamientoEmociones]
    develop --> feature_B[feature/login]
    develop --> other_features[Otras features...]
    feature_A --> develop
    feature_B --> develop
    other_features --> develop
    develop --> testing
    testing --> main
