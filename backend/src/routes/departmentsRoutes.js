const express = require('express');
const router = express.Router();
const {
  getDepartments,
  getEmployeesByDepartment
} = require('../controllers/departmentsController');

router.get('/', getDepartments);
router.get('/:dept_no/employees', getEmployeesByDepartment);

module.exports = router;
