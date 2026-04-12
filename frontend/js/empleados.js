const API_EMPLOYEES = 'http://localhost:3000/api/employees';

async function cargarEmpleados(search = '') {
  try {
    const response = await fetch(`${API_EMPLOYEES}?search=${encodeURIComponent(search)}`);

    if (!response.ok) {
      throw new Error('No se pudieron cargar los empleados');
    }

    const data = await response.json();

    const table = document.getElementById('employeesTable');
    table.innerHTML = '';

    if (data.length === 0) {
      table.innerHTML = `
        <tr>
          <td colspan="6">No se encontraron empleados</td>
        </tr>
      `;
      return;
    }

    data.forEach(emp => {
      table.innerHTML += `
        <tr>
          <td>${emp.emp_no}</td>
          <td>${emp.first_name}</td>
          <td>${emp.last_name}</td>
          <td>${emp.gender}</td>
          <td>${emp.hire_date?.split('T')[0] || emp.hire_date}</td>
          <td><a href="detalle-empleado.html?id=${emp.emp_no}">Ver detalle</a></td>
        </tr>
      `;
    });
  } catch (error) {
    console.error('Error:', error);
  }
}

document.getElementById('searchBtn').addEventListener('click', () => {
  const value = document.getElementById('searchInput').value.trim();
  cargarEmpleados(value);
});

cargarEmpleados();