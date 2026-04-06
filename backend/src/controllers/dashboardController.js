const db = require('../config/db');

const getResumen = (req, res) => {
  const totalEmployeesSql = 'SELECT COUNT(*) AS total_employees FROM employees';
  const employeesByDepartmentSql = `
    SELECT d.dept_name, COUNT(de.emp_no) AS total
    FROM departments d
    LEFT JOIN dept_emp de ON d.dept_no = de.dept_no AND de.to_date = '9999-01-01'
    GROUP BY d.dept_name
    ORDER BY total DESC
  `;
  const recentIncidenciasSql = `
    SELECT id_incidencia, emp_no, tipo, fecha, estatus
    FROM incidencias_rrhh
    ORDER BY fecha DESC, id_incidencia DESC
    LIMIT 5
  `;

  db.query(totalEmployeesSql, (error1, totalResult) => {
    if (error1) {
      return res.status(500).json({ error: 'Error al obtener total de empleados' });
    }

    db.query(employeesByDepartmentSql, (error2, departmentsResult) => {
      if (error2) {
        return res.status(500).json({ error: 'Error al obtener empleados por departamento' });
      }

      db.query(recentIncidenciasSql, (error3, incidenciasResult) => {
        if (error3) {
          return res.status(500).json({ error: 'Error al obtener incidencias recientes' });
        }

        res.json({
          totalEmployees: totalResult[0].total_employees,
          employeesByDepartment: departmentsResult,
          recentIncidencias: incidenciasResult
        });
      });
    });
  });
};

module.exports = {
  getResumen
};
