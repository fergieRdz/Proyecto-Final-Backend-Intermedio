const API_EMPLOYEES = 'http://localhost:3000/api/employees';

// ── Active nav ────────────────────────────────
(function () {
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.menu a').forEach(a => {
    if (a.getAttribute('href') === current) a.classList.add('active');
  });
})();

// ── Load employees ────────────────────────────
async function cargarEmpleados(search = '') {
  try {
    const response = await fetch(`${API_EMPLOYEES}?search=${encodeURIComponent(search)}`);
    if (!response.ok) throw new Error('No se pudieron cargar los empleados');

    const data  = await response.json();
    const table = document.getElementById('employeesTable');
    table.innerHTML = '';

    if (data.length === 0) {
      table.innerHTML = '<tr><td colspan="7" class="empty-state">No se encontraron empleados</td></tr>';
      return;
    }

    data.forEach(emp => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${emp.emp_no}</td>
        <td>${emp.first_name}</td>
        <td>${emp.last_name}</td>
        <td>${emp.gender === 'M' ? 'Masculino' : 'Femenino'}</td>
        <td>${emp.hire_date?.split('T')[0] || emp.hire_date}</td>
        <td><a href="detalle-empleado.html?id=${emp.emp_no}">Ver detalle →</a></td>
        <td>
          <div class="acciones">
            <button class="btn-secundario">Editar</button>
            <button class="btn-peligro">Eliminar</button>
          </div>
        </td>
      `;
      const [editBtn, deleteBtn] = tr.querySelectorAll('button');
      editBtn.addEventListener('click',   () => editarEmpleado(emp));
      deleteBtn.addEventListener('click', () => eliminarEmpleado(emp.emp_no));
      table.appendChild(tr);
    });
  } catch (error) {
    console.error('Error:', error);
  }
}

// ── Fill form for editing ─────────────────────
function editarEmpleado(emp) {
  document.getElementById('emp_no_edit').value = emp.emp_no;
  document.getElementById('first_name').value  = emp.first_name;
  document.getElementById('last_name').value   = emp.last_name;
  document.getElementById('gender').value      = emp.gender;
  document.getElementById('hire_date').value   = emp.hire_date?.split('T')[0]  || emp.hire_date;

  // birth_date is not in the list response — fetch full detail
  fetch(`${API_EMPLOYEES}/${emp.emp_no}`)
    .then(r => r.json())
    .then(detail => {
      document.getElementById('birth_date').value = detail.birth_date?.split('T')[0] || detail.birth_date;
    });

  document.getElementById('cancelBtn').style.display = 'inline-block';
  document.getElementById('first_name').focus();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── Cancel edit ───────────────────────────────
function resetForm() {
  document.getElementById('empleadoForm').reset();
  document.getElementById('emp_no_edit').value      = '';
  document.getElementById('cancelBtn').style.display = 'none';
}

document.getElementById('cancelBtn').addEventListener('click', resetForm);

// ── Delete ────────────────────────────────────
async function eliminarEmpleado(id) {
  if (!confirm(`¿Seguro que deseas eliminar al empleado #${id}? Se eliminarán también sus incidencias y datos asociados.`)) return;

  try {
    const response = await fetch(`${API_EMPLOYEES}/${id}`, { method: 'DELETE' });
    if (!response.ok) {
      const data = await response.json();
      alert(`Error al eliminar: ${data.error || response.statusText}`);
      return;
    }
    cargarEmpleados();
  } catch (error) {
    console.error(error);
    alert('Error de red al eliminar el empleado');
  }
}

// ── Create / Update ───────────────────────────
document.getElementById('empleadoForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const id = document.getElementById('emp_no_edit').value;
  const body = {
    first_name: document.getElementById('first_name').value.trim(),
    last_name:  document.getElementById('last_name').value.trim(),
    gender:     document.getElementById('gender').value,
    birth_date: document.getElementById('birth_date').value,
    hire_date:  document.getElementById('hire_date').value
  };

  try {
    const url      = id ? `${API_EMPLOYEES}/${id}` : API_EMPLOYEES;
    const method   = id ? 'PUT' : 'POST';
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

    resetForm();
    cargarEmpleados();
  } catch (error) {
    console.error(error);
    alert('Error de red al guardar el empleado');
  }
});

// ── Search button ─────────────────────────────
document.getElementById('searchBtn').addEventListener('click', () => {
  cargarEmpleados(document.getElementById('searchInput').value.trim());
});

// ── Search on Enter ───────────────────────────
document.getElementById('searchInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') cargarEmpleados(document.getElementById('searchInput').value.trim());
});

cargarEmpleados();
