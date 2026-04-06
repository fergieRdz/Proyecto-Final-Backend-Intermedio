CREATE TABLE IF NOT EXISTS incidencias_rrhh (
  id_incidencia INT AUTO_INCREMENT PRIMARY KEY,
  emp_no INT NOT NULL,
  tipo VARCHAR(50) NOT NULL,
  fecha DATE NOT NULL,
  descripcion TEXT NOT NULL,
  estatus VARCHAR(30) NOT NULL,
  CONSTRAINT fk_incidencias_employees
    FOREIGN KEY (emp_no) REFERENCES employees(emp_no)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);
