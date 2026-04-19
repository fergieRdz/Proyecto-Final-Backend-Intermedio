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

/**
 * @swagger
 * tags:
 *   name: Empleados
 *   description: Gestión de empleados
 */

/**
 * @swagger
 * /api/employees:
 *   get:
 *     summary: Listar empleados
 *     tags: [Empleados]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Texto para filtrar por nombre, apellido o número de empleado
 *     responses:
 *       200:
 *         description: Lista de empleados (máx. 50)
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
router.get('/', getEmployees);

/**
 * @swagger
 * /api/employees/{id}/historial:
 *   get:
 *     summary: Historial de títulos y salarios de un empleado
 *     tags: [Empleados]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Número de empleado (emp_no)
 *     responses:
 *       200:
 *         description: Historial del empleado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 titles:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       title:     { type: string, example: Senior Engineer }
 *                       from_date: { type: string, format: date }
 *                       to_date:   { type: string, format: date }
 *                 salaries:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       salary:    { type: integer, example: 85000 }
 *                       from_date: { type: string, format: date }
 *                       to_date:   { type: string, format: date }
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id/historial', getEmployeeHistory);

/**
 * @swagger
 * /api/employees/{id}:
 *   get:
 *     summary: Obtener un empleado por ID
 *     tags: [Empleados]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Número de empleado (emp_no)
 *     responses:
 *       200:
 *         description: Datos del empleado con su departamento actual
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Employee'
 *                 - type: object
 *                   properties:
 *                     dept_no:   { type: string, example: d005 }
 *                     dept_name: { type: string, example: Development }
 *       404:
 *         description: Empleado no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   put:
 *     summary: Actualizar un empleado
 *     tags: [Empleados]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Número de empleado (emp_no)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EmployeeInput'
 *     responses:
 *       200:
 *         description: Empleado actualizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje: { type: string, example: Empleado actualizado }
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Empleado no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     summary: Eliminar un empleado
 *     tags: [Empleados]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Número de empleado (emp_no)
 *     responses:
 *       200:
 *         description: Empleado eliminado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje: { type: string, example: Empleado eliminado }
 *       404:
 *         description: Empleado no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id',           getEmployeeById);
router.put('/:id',           updateEmployee);
router.delete('/:id',        deleteEmployee);

/**
 * @swagger
 * /api/employees:
 *   post:
 *     summary: Crear un nuevo empleado
 *     tags: [Empleados]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EmployeeInput'
 *     responses:
 *       201:
 *         description: Empleado creado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje: { type: string, example: Empleado creado }
 *                 emp_no:  { type: integer, example: 500001 }
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', createEmployee);

module.exports = router;
