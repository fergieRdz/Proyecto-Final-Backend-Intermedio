const API_DEPARTMENTS = 'http://localhost:3000/api/departments';

// ── Active nav ────────────────────────────────
(function () {
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.menu a').forEach(a => {
    if (a.getAttribute('href') === current) a.classList.add('active');
  });
})();

// ── Load departments ──────────────────────────
async function cargarDepartamentos() {
  try {
    const response = await fetch(API_DEPARTMENTS);
    const data = await response.json();

    const table = document.getElementById('departmentsTable');
    table.innerHTML = '';

    if (data.length === 0) {
      table.innerHTML = '<tr><td colspan="4" class="empty-state">Sin departamentos registrados</td></tr>';
      return;
    }

    data.forEach(dep => {
      table.innerHTML += `
        <tr>
          <td>${dep.dept_no}</td>
          <td>${dep.dept_name}</td>
          <td>${dep.total_employees}</td>
          <td><button onclick="verEmpleados('${dep.dept_no}', this)">Ver empleados</button></td>
        </tr>
      `;
    });
  } catch (error) {
    console.error(error);
  }
}

// ── Load employees by department ──────────────
async function verEmpleados(deptNo, btn) {
  try {
    if (btn) btn.textContent = 'Cargando...';

    const response = await fetch(`${API_DEPARTMENTS}/${deptNo}/employees`);
    const data = await response.json();

    const table = document.getElementById('departmentEmployeesTable');
    table.innerHTML = '';

    if (data.length === 0) {
      table.innerHTML = '<tr><td colspan="4" class="empty-state">Sin empleados en este departamento</td></tr>';
    } else {
      data.forEach(emp => {
        table.innerHTML += `
          <tr>
            <td>${emp.emp_no}</td>
            <td>${emp.first_name}</td>
            <td>${emp.last_name}</td>
            <td>${emp.gender}</td>
          </tr>
        `;
      });
    }

    document.getElementById('departmentEmployeesTable')
      .closest('section').scrollIntoView({ behavior: 'smooth' });
  } catch (error) {
    console.error(error);
  } finally {
    if (btn) btn.textContent = 'Ver empleados';
  }
}

cargarDepartamentos();
