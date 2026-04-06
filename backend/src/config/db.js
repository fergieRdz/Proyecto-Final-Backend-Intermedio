const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'TU_PASSWORD',
  database: 'employees'
});

connection.connect((error) => {
  if (error) {
    console.error('Error al conectar con MySQL:', error.message);
  } else {
    console.log('Conexión a MySQL exitosa');
  }
});

module.exports = connection;
