const API_BASE = 'http://localhost:3000/api/employees';
const params   = new URLSearchParams(window.location.search);
const id       = params.get('id');

// ── Active nav ────────────────────────────────
(function () {
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.menu a').forEach(a => {
    if (a.getAttribute('href') === current) a.classList.add('active');
  });
})();

// ── Load detail ───────────────────────────────
async function cargarDetalle() {
  if (!id) {
    document.getElementById('detalleEmpleado').innerHTML =
      '<p style="color:red;">No se especificó un empleado. <a href="empleados.html">Volver al listado</a></p>';
    return;
  }

  try {
    // Employee info
    const detailResponse = await fetch(`${API_BASE}/${id}`);
    if (!detailResponse.ok) {
      document.getElementById('detalleEmpleado').innerHTML =
        '<p style="color:red;">Empleado no encontrado. <a href="empleados.html">Volver al listado</a></p>';
      return;
    }
    const detail = await detailResponse.json();

    document.getElementById('detalleEmpleado').innerHTML = `
      <h2 style="font-size:22px; margin-bottom:16px; color:#1f2937;">
        ${detail.first_name} ${detail.last_name}
      </h2>
      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(180px,1fr)); gap:12px;">
        <div><small style="color:#64748b; text-transform:uppercase; font-size:11px; font-weight:700;">No. empleado</small><p style="font-size:15px; margin-top:2px;">${detail.emp_no}</p></div>
        <div><small style="color:#64748b; text-transform:uppercase; font-size:11px; font-weight:700;">Género</small><p style="font-size:15px; margin-top:2px;">${detail.gender === 'M' ? 'Masculino' : 'Femenino'}</p></div>
        <div><small style="color:#64748b; text-transform:uppercase; font-size:11px; font-weight:700;">Fecha de nacimiento</small><p style="font-size:15px; margin-top:2px;">${detail.birth_date?.split('T')[0] || detail.birth_date}</p></div>
        <div><small style="color:#64748b; text-transform:uppercase; font-size:11px; font-weight:700;">Fecha de ingreso</small><p style="font-size:15px; margin-top:2px;">${detail.hire_date?.split('T')[0] || detail.hire_date}</p></div>
        <div><small style="color:#64748b; text-transform:uppercase; font-size:11px; font-weight:700;">Departamento actual</small><p style="font-size:15px; margin-top:2px;">${detail.dept_name || 'Sin asignación'}</p></div>
      </div>
    `;

    // History
    const historyResponse = await fetch(`${API_BASE}/${id}/historial`);
    const history = await historyResponse.json();

    // Titles table
    const titlesTable = document.getElementById('titlesTable');
    titlesTable.innerHTML = '';
    if (history.titles.length === 0) {
      titlesTable.innerHTML = '<tr><td colspan="3" class="empty-state">Sin historial de títulos</td></tr>';
    } else {
      history.titles.forEach(item => {
        const hasta = item.to_date?.split('T')[0] === '9999-01-01'
          ? '<span style="color:#065f46; font-weight:600;">Actual</span>'
          : (item.to_date?.split('T')[0] || item.to_date);
        titlesTable.innerHTML += `
          <tr>
            <td>${item.title}</td>
            <td>${item.from_date?.split('T')[0] || item.from_date}</td>
            <td>${hasta}</td>
          </tr>
        `;
      });
    }

    // Salaries table
    const salariesTable = document.getElementById('salariesTable');
    salariesTable.innerHTML = '';
    if (history.salaries.length === 0) {
      salariesTable.innerHTML = '<tr><td colspan="3" class="empty-state">Sin historial de salarios</td></tr>';
    } else {
      history.salaries.forEach(item => {
        const hasta = item.to_date?.split('T')[0] === '9999-01-01'
          ? '<span style="color:#065f46; font-weight:600;">Actual</span>'
          : (item.to_date?.split('T')[0] || item.to_date);
        salariesTable.innerHTML += `
          <tr>
            <td>$${item.salary.toLocaleString('es-MX')}</td>
            <td>${item.from_date?.split('T')[0] || item.from_date}</td>
            <td>${hasta}</td>
          </tr>
        `;
      });
    }

    // Salary line chart
    if (history.salaries.length > 0) {
      const sorted = [...history.salaries].reverse();
      const labels = sorted.map(s => s.from_date?.split('T')[0] || s.from_date);
      const values = sorted.map(s => s.salary);

      const ctx = document.getElementById('salaryChart').getContext('2d');
      new Chart(ctx, {
        type: 'line',
        data: {
          labels,
          datasets: [{
            label: 'Salario',
            data: values,
            borderColor: '#1d4ed8',
            backgroundColor: 'rgba(29, 78, 216, 0.08)',
            borderWidth: 2,
            pointBackgroundColor: '#1d4ed8',
            pointRadius: 5,
            fill: true,
            tension: 0.3
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: ctx => ` $${ctx.parsed.y.toLocaleString('es-MX')}`
              }
            }
          },
          scales: {
            y: {
              beginAtZero: false,
              ticks: {
                color: '#64748b',
                callback: v => `$${v.toLocaleString('es-MX')}`
              },
              grid: { color: '#f1f5f9' }
            },
            x: {
              ticks: { color: '#64748b' },
              grid: { display: false }
            }
          }
        }
      });
    } else {
      document.getElementById('salaryChart').parentElement.innerHTML =
        '<p class="empty-state">Sin datos salariales para graficar</p>';
    }

  } catch (error) {
    console.error(error);
  }
}

cargarDetalle();
