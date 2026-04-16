const API_INCIDENCIAS = 'http://localhost:3000/api/incidencias';

async function cargarIncidencias() {
  try {
    const response = await fetch(API_INCIDENCIAS);
    const data = await response.json();

    const table = document.getElementById('incidenciasTable');
    table.innerHTML = '';

    data.forEach(item => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${item.id_incidencia}</td>
        <td>${item.emp_no} - ${item.first_name || ''} ${item.last_name || ''}</td>
        <td>${item.tipo}</td>
        <td>${item.fecha?.split('T')[0] || item.fecha}</td>
        <td>${item.descripcion}</td>
        <td>${item.estatus}</td>
        <td>
          <div class="acciones">
            <button class="btn-secundario">Editar</button>
            <button class="btn-peligro">Eliminar</button>
          </div>
        </td>
      `;

      const [editBtn, deleteBtn] = tr.querySelectorAll('button');
      editBtn.addEventListener('click', () => editarIncidencia(item));
      deleteBtn.addEventListener('click', () => eliminarIncidencia(item.id_incidencia));

      table.appendChild(tr);
    });
  } catch (error) {
    console.error(error);
  }
}

function editarIncidencia(item) {
  document.getElementById('id_incidencia').value = item.id_incidencia;
  document.getElementById('emp_no').value = item.emp_no;
  document.getElementById('tipo').value = item.tipo;
  document.getElementById('fecha').value = item.fecha?.split('T')[0] || item.fecha;
  document.getElementById('descripcion').value = item.descripcion;
  document.getElementById('estatus').value = item.estatus;
}

async function eliminarIncidencia(id) {
  if (!confirm('¿Seguro que deseas eliminar esta incidencia?')) return;

  try {
    const response = await fetch(`${API_INCIDENCIAS}/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      const data = await response.json();
      alert(`Error al eliminar: ${data.error || response.statusText}`);
      return;
    }
    cargarIncidencias();
  } catch (error) {
    console.error(error);
    alert('Error de red al eliminar la incidencia');
  }
}

document.getElementById('incidenciaForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const id = document.getElementById('id_incidencia').value;

  const body = {
    emp_no: document.getElementById('emp_no').value,
    tipo: document.getElementById('tipo').value,
    fecha: document.getElementById('fecha').value,
    descripcion: document.getElementById('descripcion').value,
    estatus: document.getElementById('estatus').value
  };

  try {
    const options = {
      method: id ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    };

    const url = id ? `${API_INCIDENCIAS}/${id}` : API_INCIDENCIAS;
    const response = await fetch(url, options);
    if (!response.ok) {
      const data = await response.json();
      alert(`Error al guardar: ${data.error || response.statusText}`);
      return;
    }

    document.getElementById('incidenciaForm').reset();
    document.getElementById('id_incidencia').value = '';
    cargarIncidencias();
  } catch (error) {
    console.error(error);
    alert('Error de red al guardar la incidencia');
  }
});

cargarIncidencias();
