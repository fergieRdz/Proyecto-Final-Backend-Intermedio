# Sistema de Gestión de Recursos Humanos (SGRH-Employees)

Proyecto full stack local con MySQL, Node.js, Express, HTML, CSS y JavaScript.

## Estructura

- `database/` -> script SQL para crear la tabla `incidencias_rrhh`
- `backend/` -> API REST con Express y mysql2
- `frontend/` -> páginas HTML, estilos CSS y archivos JS

## 1. Base de datos

1. Importa la base de datos `employees` en MySQL.
2. Ejecuta el archivo `database/script_incidencias.sql`.
3. Revisa en `backend/src/config/db.js` tu usuario y contraseña de MySQL.

## 2. Backend

Entra a la carpeta backend e instala dependencias:

```bash
cd backend
npm install
npm start
```

El servidor corre en:

```bash
http://localhost:3000
```

## 3. Frontend

Puedes abrir los archivos HTML dentro de la carpeta `frontend`.

Pantallas incluidas:
- `index.html` -> dashboard
- `empleados.html` -> lista y búsqueda de empleados
- `detalle-empleado.html` -> detalle, títulos y salarios
- `departamentos.html` -> departamentos y empleados asignados
- `incidencias.html` -> CRUD de incidencias

## Endpoints principales

- `GET /api/employees`
- `GET /api/employees/:id`
- `GET /api/employees/:id/historial`
- `GET /api/departments`
- `GET /api/departments/:dept_no/employees`
- `GET /api/incidencias`
- `POST /api/incidencias`
- `PUT /api/incidencias/:id`
- `DELETE /api/incidencias/:id`
- `GET /api/dashboard/resumen`

## Nota

El widget del clima usa Open-Meteo con coordenadas de Monterrey.
