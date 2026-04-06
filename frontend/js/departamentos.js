const API_DEPARTMENTS = 'http://localhost:3000/api/departments';

async function cargarDepartamentos() {
  try {
    const response = await fetch(API_DEPARTMENTS);
    const data = await response.json();

    const table = document.getElementById('departmentsTable');
    table.innerHTML = '';

    data.forEach(dep => {
      table.innerHTML += `
        <tr>
          <td>${dep.dept_no}</td>
          <td>${dep.dept_name}</td>
          <td>${dep.total_employees}</td>
          <td><button onclick="verEmpleados('${dep.dept_no}')">Ver</button></td>
        </tr>
      `;
    });
  } catch (error) {
    console.error(error);
  }
}

async function verEmpleados(deptNo) {
  try {
    const response = await fetch(`${API_DEPARTMENTS}/${deptNo}/employees`);
    const data = await response.json();

    const table = document.getElementById('departmentEmployeesTable');
    table.innerHTML = '';

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
  } catch (error) {
    console.error(error);
  }
}

cargarDepartamentos();
