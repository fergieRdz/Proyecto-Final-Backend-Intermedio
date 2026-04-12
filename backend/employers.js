app.get('/api/employees', (req, res) => {
  db.query('SELECT * FROM employees LIMIT 10', (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener empleados' });
    }
    res.json(results);
  });
});
