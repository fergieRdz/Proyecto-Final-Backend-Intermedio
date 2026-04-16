const API_URL = 'http://localhost:3000/api';

// ── Active nav ────────────────────────────────
(function () {
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.menu a').forEach(a => {
    if (a.getAttribute('href') === current) a.classList.add('active');
  });
})();

// ── Date widget ───────────────────────────────
function mostrarFecha() {
  const fecha = new Date().toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  document.getElementById('fechaActual').textContent = `📅 ${fecha}`;
}

// ── Weather widget ────────────────────────────
async function cargarClima() {
  try {
    const response = await fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=25.6866&longitude=-100.3161&current=temperature_2m,weathercode'
    );
    const data = await response.json();
    const temp = data.current.temperature_2m;
    document.getElementById('climaActual').textContent = `🌡️ Monterrey: ${temp}°C`;
  } catch {
    document.getElementById('climaActual').textContent = '🌡️ Clima no disponible';
  }
}

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

// ── Dashboard data ────────────────────────────
async function cargarResumen() {
  try {
    const response = await fetch(`${API_URL}/dashboard/resumen`);
    const data = await response.json();

    // Stat cards
    document.getElementById('totalEmployees').textContent = data.totalEmployees;
    document.getElementById('totalDepartamentos').textContent = data.employeesByDepartment.length;
    document.getElementById('totalIncidencias').textContent = data.totalIncidencias ?? '—';

    // Bar chart — employees by department
    const labels = data.employeesByDepartment.map(d => d.dept_name);
    const values = data.employeesByDepartment.map(d => d.total);

    const ctx = document.getElementById('chartDepartamentos').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Empleados',
          data: values,
          backgroundColor: 'rgba(29, 78, 216, 0.8)',
          borderColor: '#1d4ed8',
          borderWidth: 1,
          borderRadius: 6,
          borderSkipped: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: ctx => ` ${ctx.parsed.y} empleados`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { precision: 0, color: '#64748b' },
            grid: { color: '#f1f5f9' }
          },
          x: {
            ticks: { color: '#64748b' },
            grid: { display: false }
          }
        }
      }
    });

    // Recent incidencias list
    const lista = document.getElementById('listaIncidencias');
    lista.innerHTML = '';

    if (data.recentIncidencias.length === 0) {
      lista.innerHTML = '<li class="empty-state">Sin incidencias registradas</li>';
      return;
    }

    data.recentIncidencias.forEach(item => {
      const fecha = item.fecha?.split('T')[0] || item.fecha;
      lista.innerHTML += `
        <li class="incidencia-item">
          <div>
            <div class="incidencia-emp">Empleado #${item.emp_no}</div>
            <div class="incidencia-meta">${item.tipo} · ${fecha}</div>
          </div>
          ${badgeEstatus(item.estatus)}
        </li>
      `;
    });

  } catch (error) {
    console.error(error);
  }
}

mostrarFecha();
cargarClima();
cargarResumen();
