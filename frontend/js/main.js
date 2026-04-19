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

// ── Weather helpers ───────────────────────────
const WMO_CODES = {
  0:  { label: 'Despejado',            icon: '☀️'  },
  1:  { label: 'Mayormente despejado', icon: '🌤️' },
  2:  { label: 'Parcialmente nublado', icon: '⛅'  },
  3:  { label: 'Nublado',              icon: '☁️'  },
  45: { label: 'Neblina',              icon: '🌫️' },
  48: { label: 'Neblina helada',       icon: '🌫️' },
  51: { label: 'Llovizna ligera',      icon: '🌦️' },
  53: { label: 'Llovizna moderada',    icon: '🌦️' },
  55: { label: 'Llovizna intensa',     icon: '🌧️' },
  61: { label: 'Lluvia ligera',        icon: '🌧️' },
  63: { label: 'Lluvia moderada',      icon: '🌧️' },
  65: { label: 'Lluvia intensa',       icon: '🌧️' },
  71: { label: 'Nieve ligera',         icon: '🌨️' },
  73: { label: 'Nieve moderada',       icon: '🌨️' },
  75: { label: 'Nieve intensa',        icon: '❄️'  },
  80: { label: 'Chubascos ligeros',    icon: '🌦️' },
  81: { label: 'Chubascos moderados',  icon: '🌧️' },
  82: { label: 'Chubascos intensos',   icon: '⛈️'  },
  95: { label: 'Tormenta eléctrica',   icon: '⛈️'  },
  99: { label: 'Tormenta con granizo', icon: '⛈️'  },
};

function wmoInfo(code) {
  return WMO_CODES[code] || { label: 'Desconocido', icon: '🌡️' };
}

// ── Weather widget ────────────────────────────
async function cargarClima() {
  try {
    const url = 'https://api.open-meteo.com/v1/forecast' +
      '?latitude=25.6866&longitude=-100.3161' +
      '&current=temperature_2m,apparent_temperature,weathercode,' +
      'windspeed_10m,relativehumidity_2m,precipitation';
    const response = await fetch(url);
    const data = await response.json();
    const c = data.current;

    const { label, icon } = wmoInfo(c.weathercode);

    // Header mini-widget
    document.getElementById('climaActual').textContent = `${icon} Monterrey: ${c.temperature_2m}°C`;

    // Main section
    document.getElementById('climaIcono').textContent      = icon;
    document.getElementById('climaTemp').textContent       = `${c.temperature_2m}°C`;
    document.getElementById('climaCondicion').textContent  = label;
    document.getElementById('climaSensacion').textContent  = `${c.apparent_temperature}°C`;
    document.getElementById('climaViento').textContent     = `${c.windspeed_10m} km/h`;
    document.getElementById('climaHumedad').textContent    = `${c.relativehumidity_2m}%`;
    document.getElementById('climaPrecip').textContent     = `${c.precipitation} mm`;

    const hora = new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
    document.getElementById('climaFecha').textContent = `Actualizado ${hora}`;
  } catch {
    document.getElementById('climaActual').textContent = '🌡️ Clima no disponible';
    document.getElementById('climaCondicion').textContent = 'No disponible';
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
