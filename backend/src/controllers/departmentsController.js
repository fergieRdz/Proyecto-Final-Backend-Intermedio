const db = require('../config/db');

const getDepartments = (req, res) => {
  const sql = `
    SELECT d.dept_no, d.dept_name, COUNT(de.emp_no) AS total_employees
    FROM departments d
    LEFT JOIN dept_emp de ON d.dept_no = de.dept_no AND de.to_date = '9999-01-01'
    GROUP BY d.dept_no, d.dept_name
    ORDER BY d.dept_name ASC
  `;

  db.query(sql, (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Error al obtener departamentos' });
    }
    res.json(results);
  });
};

const getEmployeesByDepartment = (req, res) => {
  const { dept_no } = req.params;

  const sql = `
    SELECT e.emp_no, e.first_name, e.last_name, e.gender, e.hire_date
    FROM dept_emp de
    INNER JOIN employees e ON de.emp_no = e.emp_no
    WHERE de.dept_no = ? AND de.to_date = '9999-01-01'
    ORDER BY e.emp_no ASC
  `;

  db.query(sql, [dept_no], (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Error al obtener empleados del departamento' });
    }
    res.json(results);
  });
};

module.exports = {
  getDepartments,
  getEmployeesByDepartment
};
