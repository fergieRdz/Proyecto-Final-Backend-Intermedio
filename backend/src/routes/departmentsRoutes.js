const express = require('express');
const router = express.Router();
const {
  getDepartments,
  getEmployeesByDepartment
} = require('../controllers/departmentsController');

/**
 * @swagger
 * tags:
 *   name: Departamentos
 *   description: Consulta de departamentos
 */

/**
 * @swagger
 * /api/departments:
 *   get:
 *     summary: Listar todos los departamentos
 *     tags: [Departamentos]
 *     responses:
 *       200:
 *         description: Lista de departamentos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Department'
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', getDepartments);

/**
 * @swagger
 * /api/departments/{dept_no}/employees:
 *   get:
 *     summary: Empleados actuales de un departamento
 *     tags: [Departamentos]
 *     parameters:
 *       - in: path
 *         name: dept_no
 *         required: true
 *         schema:
 *           type: string
 *         description: Código del departamento (p. ej. d001)
 *     responses:
 *       200:
 *         description: Lista de empleados activos en el departamento
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Employee'
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:dept_no/employees', getEmployeesByDepartment);

module.exports = router;
