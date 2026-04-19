const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SGRH – API de Recursos Humanos',
      version: '1.0.0',
      description: 'API REST para el Sistema de Gestión de Recursos Humanos basado en la base de datos employees.',
    },
    servers: [
      { url: 'http://localhost:3000', description: 'Servidor local' }
    ],
    components: {
      schemas: {
        Employee: {
          type: 'object',
          properties: {
            emp_no:     { type: 'integer', example: 10001 },
            first_name: { type: 'string',  example: 'Georgi' },
            last_name:  { type: 'string',  example: 'Facello' },
            gender:     { type: 'string',  enum: ['M', 'F'], example: 'M' },
            birth_date: { type: 'string',  format: 'date', example: '1953-09-02' },
            hire_date:  { type: 'string',  format: 'date', example: '1986-06-26' },
          }
        },
        EmployeeInput: {
          type: 'object',
          required: ['first_name', 'last_name', 'gender', 'birth_date', 'hire_date'],
          properties: {
            first_name: { type: 'string',  example: 'María' },
            last_name:  { type: 'string',  example: 'López' },
            gender:     { type: 'string',  enum: ['M', 'F'], example: 'F' },
            birth_date: { type: 'string',  format: 'date', example: '1990-05-15' },
            hire_date:  { type: 'string',  format: 'date', example: '2020-01-10' },
          }
        },
        Department: {
          type: 'object',
          properties: {
            dept_no:   { type: 'string',  example: 'd001' },
            dept_name: { type: 'string',  example: 'Marketing' },
          }
        },
        Incidencia: {
          type: 'object',
          properties: {
            id_incidencia: { type: 'integer', example: 1 },
            emp_no:        { type: 'integer', example: 10001 },
            first_name:    { type: 'string',  example: 'Georgi' },
            last_name:     { type: 'string',  example: 'Facello' },
            tipo:          { type: 'string',  example: 'Falta' },
            fecha:         { type: 'string',  format: 'date', example: '2024-03-01' },
            descripcion:   { type: 'string',  example: 'Ausencia no justificada' },
            estatus:       { type: 'string',  example: 'Pendiente' },
          }
        },
        IncidenciaInput: {
          type: 'object',
          required: ['emp_no', 'tipo', 'fecha', 'descripcion', 'estatus'],
          properties: {
            emp_no:      { type: 'integer', example: 10001 },
            tipo:        { type: 'string',  example: 'Falta' },
            fecha:       { type: 'string',  format: 'date', example: '2024-03-01' },
            descripcion: { type: 'string',  example: 'Ausencia no justificada' },
            estatus:     { type: 'string',  example: 'Pendiente' },
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Ocurrió un error en el servidor' }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js'],
};

module.exports = swaggerJsdoc(options);
