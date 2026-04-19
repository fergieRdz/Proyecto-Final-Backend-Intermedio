const express = require('express');
const router = express.Router();
const { getResumen } = require('../controllers/dashboardController');

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Resumen general del sistema
 */

/**
 * @swagger
 * /api/dashboard/resumen:
 *   get:
 *     summary: Resumen general del sistema
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Datos de resumen para el dashboard
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalEmployees:
 *                   type: integer
 *                   example: 300024
 *                 employeesByDepartment:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       dept_name: { type: string, example: Development }
 *                       total:     { type: integer, example: 85707 }
 *                 totalIncidencias:
 *                   type: integer
 *                   example: 12
 *                 recentIncidencias:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id_incidencia: { type: integer, example: 5 }
 *                       emp_no:        { type: integer, example: 10001 }
 *                       tipo:          { type: string,  example: Falta }
 *                       fecha:         { type: string,  format: date }
 *                       estatus:       { type: string,  example: Pendiente }
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/resumen', getResumen);

module.exports = router;
