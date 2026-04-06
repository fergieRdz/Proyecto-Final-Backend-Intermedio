const API_URL = 'http://localhost:3000/api';

function mostrarFecha() {
  const fecha = new Date().toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  document.getElementById('fechaActual').textContent = `Fecha: ${fecha}`;
}

async function cargarClima() {
  try {
    const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=25.6866&longitude=-100.3161&current=temperature_2m');
    const data = await response.json();
    document.getElementById('climaActual').textContent = `Monterrey: ${data.current.temperature_2m}°C`;
  } catch (error) {
    document.getElementById('climaActual').textContent = 'No se pudo cargar el clima';
  }
}

async function cargarResumen() {
  try {
    const response = await fetch(`${API_URL}/dashboard/resumen`);
    const data = await response.json();

    document.getElementById('totalEmployees').textContent = data.totalEmployees;

    const tabla = document.getElementById('tablaDepartamentosResumen');
    tabla.innerHTML = '';
    data.employeesByDepartment.forEach(item => {
      tabla.innerHTML += `
        <tr>
          <td>${item.dept_name}</td>
          <td>${item.total}</td>
        </tr>
      `;
    });

    const lista = document.getElementById('listaIncidencias');
    lista.innerHTML = '';
    data.recentIncidencias.forEach(item => {
      lista.innerHTML += `<li>Empleado ${item.emp_no} - ${item.tipo} (${item.estatus})</li>`;
    });
  } catch (error) {
    console.error(error);
  }
}

mostrarFecha();
cargarClima();
cargarResumen();
