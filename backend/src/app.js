const express = require('express');
const cors = require('cors');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const employeesRoutes = require('./routes/employeesRoutes');
const departmentsRoutes = require('./routes/departmentsRoutes');
const incidenciasRoutes = require('./routes/incidenciasRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../../frontend')));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => {
  res.json({
    mensaje: 'API de Recursos Humanos funcionando'
  });
});

app.use('/api/employees', employeesRoutes);
app.use('/api/departments', departmentsRoutes);
app.use('/api/incidencias', incidenciasRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    error: 'Ocurrió un error en el servidor'
  });
});

module.exports = app;
