const express = require('express');
const router  = express.Router();
const {
  getEmployees,
  getEmployeeById,
  getEmployeeHistory,
  createEmployee,
  updateEmployee,
  deleteEmployee
} = require('../controllers/employeesController');

router.get('/',              getEmployees);
router.get('/:id/historial', getEmployeeHistory);
router.get('/:id',           getEmployeeById);
router.post('/',             createEmployee);
router.put('/:id',           updateEmployee);
router.delete('/:id',        deleteEmployee);

module.exports = router;
