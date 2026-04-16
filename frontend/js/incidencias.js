const API_INCIDENCIAS = 'http://localhost:3000/api/incidencias';

// ── Active nav ────────────────────────────────
(function () {
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.menu a').forEach(a => {
    if (a.getAttribute('href') === current) a.classList.add('active');
  });
})();

// ── Status badge helper ───────────────────────
function badgeEstatus(estatus) {
  const map = {
    'Pendiente':   'badge-pendiente',
    'En revisión': 'badge-revision',
    'Resuelta':    'badge-resuelta'
  };
  const cls = map[estatus] || 'badge-pendiente';
  return `<span class="badge ${cls}">${estatus}</span>`;
}

// ── Load incidencias ──────────────────────────
async function cargarIncidencias() {
  try {
    const response = await fetch(API_INCIDENCIAS);
    const data = await response.json();

    const table = document.getElementById('incidenciasTable');
    table.innerHTML = '';

    if (data.length === 0) {
      table.innerHTML = '<tr><td colspan="7" class="empty-state">Sin incidencias registradas</td></tr>';
      return;
    }

    data.forEach(item => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${item.id_incidencia}</td>
        <td><strong>${item.emp_no}</strong> — ${item.first_name || ''} ${item.last_name || ''}</td>
        <td>${item.tipo}</td>
        <td>${item.fecha?.split('T')[0] || item.fecha}</td>
        <td>${item.descripcion}</td>
        <td>${badgeEstatus(item.estatus)}</td>
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

// ── Fill form for editing ─────────────────────
function editarIncidencia(item) {
  document.getElementById('id_incidencia').value = item.id_incidencia;
  document.getElementById('emp_no').value        = item.emp_no;
  document.getElementById('tipo').value          = item.tipo;
  document.getElementById('fecha').value         = item.fecha?.split('T')[0] || item.fecha;
  document.getElementById('descripcion').value   = item.descripcion;
  document.getElementById('estatus').value       = item.estatus;
  document.getElementById('emp_no').focus();
}

// ── Delete ────────────────────────────────────
async function eliminarIncidencia(id) {
  if (!confirm('¿Seguro que deseas eliminar esta incidencia?')) return;

  try {
    const response = await fetch(`${API_INCIDENCIAS}/${id}`, { method: 'DELETE' });
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

// ── Create / Update ───────────────────────────
document.getElementById('incidenciaForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const id = document.getElementById('id_incidencia').value;
  const body = {
    emp_no:      document.getElementById('emp_no').value,
    tipo:        document.getElementById('tipo').value,
    fecha:       document.getElementById('fecha').value,
    descripcion: document.getElementById('descripcion').value,
    estatus:     document.getElementById('estatus').value
  };

  try {
    const url     = id ? `${API_INCIDENCIAS}/${id}` : API_INCIDENCIAS;
    const method  = id ? 'PUT' : 'POST';
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

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
