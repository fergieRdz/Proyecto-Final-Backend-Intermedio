const db = require('../config/db');

const getIncidencias = (req, res) => {
  const sql = `
    SELECT i.id_incidencia, i.emp_no, e.first_name, e.last_name,
           i.tipo, i.fecha, i.descripcion, i.estatus
    FROM incidencias_rrhh i
    LEFT JOIN employees e ON i.emp_no = e.emp_no
    ORDER BY i.fecha DESC, i.id_incidencia DESC
  `;

  db.query(sql, (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Error al obtener incidencias' });
    }
    res.json(results);
  });
};

const createIncidencia = (req, res) => {
  const { emp_no, tipo, fecha, descripcion, estatus } = req.body;

  if (!emp_no || !tipo || !fecha || !descripcion || !estatus) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  const sql = `
    INSERT INTO incidencias_rrhh (emp_no, tipo, fecha, descripcion, estatus)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sql, [emp_no, tipo, fecha, descripcion, estatus], (error, result) => {
    if (error) {
      return res.status(500).json({ error: 'Error al crear la incidencia' });
    }
    res.status(201).json({ mensaje: 'Incidencia creada', id: result.insertId });
  });
};

const updateIncidencia = (req, res) => {
  const { id } = req.params;
  const { emp_no, tipo, fecha, descripcion, estatus } = req.body;

  if (!emp_no || !tipo || !fecha || !descripcion || !estatus) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  const sql = `
    UPDATE incidencias_rrhh
    SET emp_no = ?, tipo = ?, fecha = ?, descripcion = ?, estatus = ?
    WHERE id_incidencia = ?
  `;

  db.query(sql, [emp_no, tipo, fecha, descripcion, estatus, id], (error, result) => {
    if (error) {
      return res.status(500).json({ error: 'Error al actualizar la incidencia' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Incidencia no encontrada' });
    }

    res.json({ mensaje: 'Incidencia actualizada' });
  });
};

const deleteIncidencia = (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM incidencias_rrhh WHERE id_incidencia = ?';

  db.query(sql, [id], (error, result) => {
    if (error) {
      return res.status(500).json({ error: 'Error al eliminar la incidencia' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Incidencia no encontrada' });
    }

    res.json({ mensaje: 'Incidencia eliminada' });
  });
};

module.exports = {
  getIncidencias,
  createIncidencia,
  updateIncidencia,
  deleteIncidencia
};
