const API_BASE = 'http://localhost:3000/api/employees';
const params = new URLSearchParams(window.location.search);
const id = params.get('id');

async function cargarDetalle() {
  if (!id) {
    document.getElementById('detalleEmpleado').innerHTML =
      '<p style="color:red;">No se especificó un empleado. <a href="empleados.html">Volver al listado</a></p>';
    return;
  }

  try {
    const detailResponse = await fetch(`${API_BASE}/${id}`);
    const detail = await detailResponse.json();

    document.getElementById('detalleEmpleado').innerHTML = `
      <h2>${detail.first_name} ${detail.last_name}</h2>
      <p><strong>No. empleado:</strong> ${detail.emp_no}</p>
      <p><strong>Género:</strong> ${detail.gender}</p>
      <p><strong>Fecha de nacimiento:</strong> ${detail.birth_date?.split('T')[0] || detail.birth_date}</p>
      <p><strong>Fecha de ingreso:</strong> ${detail.hire_date?.split('T')[0] || detail.hire_date}</p>
      <p><strong>Departamento actual:</strong> ${detail.dept_name || 'Sin asignación'}</p>
    `;

    const historyResponse = await fetch(`${API_BASE}/${id}/historial`);
    const history = await historyResponse.json();

    const titlesTable = document.getElementById('titlesTable');
    titlesTable.innerHTML = '';
    history.titles.forEach(item => {
      titlesTable.innerHTML += `
        <tr>
          <td>${item.title}</td>
          <td>${item.from_date?.split('T')[0] || item.from_date}</td>
          <td>${item.to_date?.split('T')[0] || item.to_date}</td>
        </tr>
      `;
    });

    const salariesTable = document.getElementById('salariesTable');
    salariesTable.innerHTML = '';
    history.salaries.forEach(item => {
      salariesTable.innerHTML += `
        <tr>
          <td>$${item.salary}</td>
          <td>${item.from_date?.split('T')[0] || item.from_date}</td>
          <td>${item.to_date?.split('T')[0] || item.to_date}</td>
        </tr>
      `;
    });
  } catch (error) {
    console.error(error);
  }
}

cargarDetalle();
