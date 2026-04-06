const express = require('express');
const router = express.Router();
const {
  getIncidencias,
  createIncidencia,
  updateIncidencia,
  deleteIncidencia
} = require('../controllers/incidenciasController');

router.get('/', getIncidencias);
router.post('/', createIncidencia);
router.put('/:id', updateIncidencia);
router.delete('/:id', deleteIncidencia);

module.exports = router;
