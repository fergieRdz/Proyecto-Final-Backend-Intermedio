-- ============================================================
-- Setup script generated from Employee_202604151845.csv
-- Creates and populates all tables required by the backend
-- ============================================================

CREATE DATABASE IF NOT EXISTS employees;
USE employees;

-- ------------------------------------------------------------
-- 1. employees
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS employees (
  emp_no     INT          NOT NULL,
  birth_date DATE         NOT NULL,
  first_name VARCHAR(14)  NOT NULL,
  last_name  VARCHAR(16)  NOT NULL,
  gender     ENUM('M','F') NOT NULL,
  hire_date  DATE         NOT NULL,
  PRIMARY KEY (emp_no)
);

INSERT INTO employees (emp_no, birth_date, first_name, last_name, gender, hire_date) VALUES
(1, '1962-02-18', 'Andrew',   'Adams',    'M', '2002-08-14'),
(2, '1958-12-08', 'Nancy',    'Edwards',  'F', '2002-05-01'),
(3, '1973-08-29', 'Jane',     'Peacock',  'F', '2002-04-01'),
(4, '1947-09-19', 'Margaret', 'Park',     'F', '2003-05-03'),
(5, '1965-03-03', 'Steve',    'Johnson',  'M', '2003-10-17'),
(6, '1973-07-01', 'Michael',  'Mitchell', 'M', '2003-10-17'),
(7, '1970-05-29', 'Robert',   'King',     'M', '2004-01-02'),
(8, '1968-01-09', 'Laura',    'Callahan', 'F', '2004-03-04');

-- ------------------------------------------------------------
-- 2. departments
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS departments (
  dept_no   CHAR(4)     NOT NULL,
  dept_name VARCHAR(40) NOT NULL,
  PRIMARY KEY (dept_no),
  UNIQUE KEY (dept_name)
);

INSERT INTO departments (dept_no, dept_name) VALUES
('d001', 'Management'),
('d002', 'Sales'),
('d003', 'IT');

-- ------------------------------------------------------------
-- 3. dept_emp  (active assignments: to_date = '9999-01-01')
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS dept_emp (
  emp_no    INT  NOT NULL,
  dept_no   CHAR(4) NOT NULL,
  from_date DATE NOT NULL,
  to_date   DATE NOT NULL,
  PRIMARY KEY (emp_no, dept_no),
  FOREIGN KEY (emp_no)  REFERENCES employees(emp_no)  ON DELETE CASCADE,
  FOREIGN KEY (dept_no) REFERENCES departments(dept_no) ON DELETE CASCADE
);

INSERT INTO dept_emp (emp_no, dept_no, from_date, to_date) VALUES
(1, 'd001', '2002-08-14', '9999-01-01'),
(2, 'd002', '2002-05-01', '9999-01-01'),
(3, 'd002', '2002-04-01', '9999-01-01'),
(4, 'd002', '2003-05-03', '9999-01-01'),
(5, 'd002', '2003-10-17', '9999-01-01'),
(6, 'd003', '2003-10-17', '9999-01-01'),
(7, 'd003', '2004-01-02', '9999-01-01'),
(8, 'd003', '2004-03-04', '9999-01-01');

-- ------------------------------------------------------------
-- 4. dept_manager
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS dept_manager (
  dept_no   CHAR(4) NOT NULL,
  emp_no    INT     NOT NULL,
  from_date DATE    NOT NULL,
  to_date   DATE    NOT NULL,
  PRIMARY KEY (dept_no, emp_no),
  FOREIGN KEY (emp_no)  REFERENCES employees(emp_no)  ON DELETE CASCADE,
  FOREIGN KEY (dept_no) REFERENCES departments(dept_no) ON DELETE CASCADE
);

INSERT INTO dept_manager (dept_no, emp_no, from_date, to_date) VALUES
('d001', 1, '2002-08-14', '9999-01-01'),
('d002', 2, '2002-05-01', '9999-01-01'),
('d003', 6, '2003-10-17', '9999-01-01');

-- ------------------------------------------------------------
-- 5. titles
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS titles (
  emp_no    INT         NOT NULL,
  title     VARCHAR(50) NOT NULL,
  from_date DATE        NOT NULL,
  to_date   DATE        NOT NULL,
  PRIMARY KEY (emp_no, title, from_date),
  FOREIGN KEY (emp_no) REFERENCES employees(emp_no) ON DELETE CASCADE
);

INSERT INTO titles (emp_no, title, from_date, to_date) VALUES
(1, 'General Manager',    '2002-08-14', '9999-01-01'),
(2, 'Sales Manager',      '2002-05-01', '9999-01-01'),
(3, 'Sales Support Agent','2002-04-01', '9999-01-01'),
(4, 'Sales Support Agent','2003-05-03', '9999-01-01'),
(5, 'Sales Support Agent','2003-10-17', '9999-01-01'),
(6, 'IT Manager',         '2003-10-17', '9999-01-01'),
(7, 'IT Staff',           '2004-01-02', '9999-01-01'),
(8, 'IT Staff',           '2004-03-04', '9999-01-01');

-- ------------------------------------------------------------
-- 6. salaries
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS salaries (
  emp_no    INT  NOT NULL,
  salary    INT  NOT NULL,
  from_date DATE NOT NULL,
  to_date   DATE NOT NULL,
  PRIMARY KEY (emp_no, from_date),
  FOREIGN KEY (emp_no) REFERENCES employees(emp_no) ON DELETE CASCADE
);

INSERT INTO salaries (emp_no, salary, from_date, to_date) VALUES
(1, 90000, '2002-08-14', '9999-01-01'),
(2, 70000, '2002-05-01', '9999-01-01'),
(3, 48000, '2002-04-01', '9999-01-01'),
(4, 48000, '2003-05-03', '9999-01-01'),
(5, 48000, '2003-10-17', '9999-01-01'),
(6, 65000, '2003-10-17', '9999-01-01'),
(7, 55000, '2004-01-02', '9999-01-01'),
(8, 55000, '2004-03-04', '9999-01-01');

-- ------------------------------------------------------------
-- 7. incidencias_rrhh  (from database/script_incidencias.sql)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS incidencias_rrhh (
  id_incidencia INT AUTO_INCREMENT PRIMARY KEY,
  emp_no        INT         NOT NULL,
  tipo          VARCHAR(50) NOT NULL,
  fecha         DATE        NOT NULL,
  descripcion   TEXT        NOT NULL,
  estatus       VARCHAR(30) NOT NULL,
  CONSTRAINT fk_incidencias_employees
    FOREIGN KEY (emp_no) REFERENCES employees(emp_no)
    ON DELETE CASCADE ON UPDATE CASCADE
);
