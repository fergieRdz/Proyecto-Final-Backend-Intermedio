# SGRH-Employees — Context for Claude

## What this project is

A full-stack HR management system (Sistema de Gestión de Recursos Humanos) built on top of MySQL's sample `employees` database. It exposes a REST API with Node.js + Express and a plain-HTML/CSS/JS frontend.

- **Backend:** `backend/` — Express app, runs on `http://localhost:3000`
- **Frontend:** `frontend/` — static HTML pages served by the same Express server via `express.static`
- **Database:** MySQL `employees` sample DB + custom `incidencias_rrhh` table

## How to run

```bash
# 1. Import MySQL employees sample DB
# 2. Run database/script_incidencias.sql
# 3. Check credentials in backend/src/config/db.js

cd backend
npm install
npm start   # or npm run dev (same thing)
```

## Project structure

```
backend/
  server.js               # Entry point — starts Express on PORT (default 3000)
  employers.js            # DEAD FILE — never imported, ignore it
  src/
    app.js                # Express setup: CORS, JSON, static files, routes
    config/
      db.js               # Single MySQL connection (hardcoded credentials)
    controllers/
      employeesController.js    # getEmployees, getEmployeeById, getEmployeeHistory
      departmentsController.js  # getDepartments, getEmployeesByDepartment
      incidenciasController.js  # getIncidencias, createIncidencia, updateIncidencia, deleteIncidencia
      dashboardController.js    # getResumen (nested callbacks, 3 queries)
    routes/
      employeesRoutes.js        # GET /, GET /:id, GET /:id/historial
      departmentsRoutes.js      # GET /, GET /:dept_no/employees
      incidenciasRoutes.js      # GET /, POST /, PUT /:id, DELETE /:id
      dashboardRoutes.js        # GET /resumen

database/
  script_incidencias.sql  # Creates incidencias_rrhh table with FK to employees

frontend/
  index.html              # BUG: old prototype page — dashboard HTML is MISSING (see bugs)
  empleados.html          # Employee list + search
  detalle-empleado.html   # Employee detail, title history, salary history
  departamentos.html      # Department list + employees per dept
  incidencias.html        # CRUD for incidencias_rrhh
  css/styles.css
  js/
    main.js         # Dashboard logic — references DOM IDs that don't exist in index.html
    empleados.js
    detalle.js
    departamentos.js
    incidencias.js
```

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/employees | List employees (search by name/emp_no, LIMIT 50) |
| GET | /api/employees/:id | Employee detail with current dept |
| GET | /api/employees/:id/historial | Titles + salaries history |
| GET | /api/departments | Departments with active headcount |
| GET | /api/departments/:dept_no/employees | Active employees in a dept |
| GET | /api/incidencias | All incidencias joined with employee name |
| POST | /api/incidencias | Create incidencia |
| PUT | /api/incidencias/:id | Update incidencia |
| DELETE | /api/incidencias/:id | Delete incidencia |
| GET | /api/dashboard/resumen | Total employees + employees by dept + 5 recent incidencias |

## Database notes

- Uses the standard MySQL `employees` sample database (tables: `employees`, `departments`, `dept_emp`, `titles`, `salaries`)
- Active assignments are identified by `to_date = '9999-01-01'`
- Custom table: `incidencias_rrhh` — columns: `id_incidencia`, `emp_no` (FK), `tipo`, `fecha`, `descripcion`, `estatus`

---

## Known bugs

### Critical

1. **`index.html` is a broken prototype — the dashboard page is missing**
   - `index.html` contains an old test snippet for incidencias with `<ul id="lista">`, not the dashboard.
   - `frontend/js/main.js` expects DOM elements `#fechaActual`, `#climaActual`, `#totalEmployees`, `#tablaDepartamentosResumen`, `#listaIncidencias` — none exist in `index.html`.
   - The dashboard HTML needs to be written from scratch (or `index.html` replaced with a proper dashboard that has those element IDs).

2. **No DB reconnect — single connection will die after MySQL idle timeout**
   - `backend/src/config/db.js` uses `mysql.createConnection()`. MySQL drops idle connections after ~8 hours by default.
   - Fix: replace with `mysql.createPool()` (drop-in replacement, same `db.query()` API).

### Moderate

3. **`detalle.js` — no guard for missing `?id` query param**
   - Navigating to `detalle-empleado.html` without `?id=` causes requests to `/api/employees/null`, which silently returns 404.
   - Fix: check `if (!id)` at the top of `cargarDetalle()` and show an error message.

4. **`incidencias.js` — HTTP errors silently ignored**
   - Neither `eliminarIncidencia` nor the form submit handler checks `response.ok`.
   - Failed creates/updates/deletes are swallowed; the user sees no feedback.
   - Fix: check `response.ok` and show an alert or inline error.

5. **`employers.js` is a dead, broken file**
   - `backend/employers.js` references `app` and `db` that are never imported. It is never required anywhere.
   - Should be deleted to avoid confusion.

### Minor / Security

6. **Hardcoded DB credentials** — `db.js` has `password: '12345678'` in plaintext. Use `dotenv` and a `.env` file instead.

7. **CORS is wide open** — `app.use(cors())` with no config allows all origins. Restrict to known origins for production.

8. **`emp_no` sent as string from form** — `document.getElementById('emp_no').value` is always a string. MySQL implicitly casts it, but it's cleaner to parse with `parseInt()` before sending.
