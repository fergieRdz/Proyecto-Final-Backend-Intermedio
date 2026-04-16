const db = require('../config/db');

// ── GET all (with search) ─────────────────────
const getEmployees = (req, res) => {
  const search = req.query.search || '';
  const value  = `%${search}%`;

  const sql = `
    SELECT emp_no, first_name, last_name, gender, hire_date
    FROM employees
    WHERE first_name LIKE ?
       OR last_name  LIKE ?
       OR emp_no     LIKE ?
    ORDER BY emp_no ASC
    LIMIT 50
  `;

  db.query(sql, [value, value, value], (error, results) => {
    if (error) return res.status(500).json({ error: 'Error al obtener empleados' });
    res.json(results);
  });
};

// ── GET one ───────────────────────────────────
const getEmployeeById = (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT e.emp_no, e.first_name, e.last_name, e.gender, e.birth_date, e.hire_date,
           d.dept_no, d.dept_name
    FROM employees e
    LEFT JOIN dept_emp   de ON e.emp_no = de.emp_no AND de.to_date = '9999-01-01'
    LEFT JOIN departments d  ON de.dept_no = d.dept_no
    WHERE e.emp_no = ?
  `;

  db.query(sql, [id], (error, results) => {
    if (error)            return res.status(500).json({ error: 'Error al obtener el detalle del empleado' });
    if (!results.length)  return res.status(404).json({ error: 'Empleado no encontrado' });
    res.json(results[0]);
  });
};

// ── GET history (titles + salaries) ──────────
const getEmployeeHistory = (req, res) => {
  const { id } = req.params;

  const titlesSql   = 'SELECT title,  from_date, to_date FROM titles   WHERE emp_no = ? ORDER BY from_date DESC';
  const salariesSql = 'SELECT salary, from_date, to_date FROM salaries WHERE emp_no = ? ORDER BY from_date DESC';

  db.query(titlesSql, [id], (titlesError, titles) => {
    if (titlesError) return res.status(500).json({ error: 'Error al obtener títulos' });

    db.query(salariesSql, [id], (salariesError, salaries) => {
      if (salariesError) return res.status(500).json({ error: 'Error al obtener salarios' });
      res.json({ titles, salaries });
    });
  });
};

// ── POST create ───────────────────────────────
const createEmployee = (req, res) => {
  const { first_name, last_name, gender, birth_date, hire_date } = req.body;

  if (!first_name || !last_name || !gender || !birth_date || !hire_date) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  if (!['M', 'F'].includes(gender)) {
    return res.status(400).json({ error: 'Género debe ser M o F' });
  }

  const sql = `
    INSERT INTO employees (first_name, last_name, gender, birth_date, hire_date)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sql, [first_name, last_name, gender, birth_date, hire_date], (error, result) => {
    if (error) return res.status(500).json({ error: 'Error al crear el empleado' });
    res.status(201).json({ mensaje: 'Empleado creado', emp_no: result.insertId });
  });
};

// ── PUT update ────────────────────────────────
const updateEmployee = (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, gender, birth_date, hire_date } = req.body;

  if (!first_name || !last_name || !gender || !birth_date || !hire_date) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  if (!['M', 'F'].includes(gender)) {
    return res.status(400).json({ error: 'Género debe ser M o F' });
  }

  const sql = `
    UPDATE employees
    SET first_name = ?, last_name = ?, gender = ?, birth_date = ?, hire_date = ?
    WHERE emp_no = ?
  `;

  db.query(sql, [first_name, last_name, gender, birth_date, hire_date, id], (error, result) => {
    if (error)                return res.status(500).json({ error: 'Error al actualizar el empleado' });
    if (!result.affectedRows) return res.status(404).json({ error: 'Empleado no encontrado' });
    res.json({ mensaje: 'Empleado actualizado' });
  });
};

// ── DELETE ────────────────────────────────────
const deleteEmployee = (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM employees WHERE emp_no = ?', [id], (error, result) => {
    if (error)                return res.status(500).json({ error: 'Error al eliminar el empleado' });
    if (!result.affectedRows) return res.status(404).json({ error: 'Empleado no encontrado' });
    res.json({ mensaje: 'Empleado eliminado' });
  });
};

module.exports = {
  getEmployees,
  getEmployeeById,
  getEmployeeHistory,
  createEmployee,
  updateEmployee,
  deleteEmployee
};
