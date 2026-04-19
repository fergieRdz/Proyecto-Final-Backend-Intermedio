const express = require('express');
const router = express.Router();
const {
  getIncidencias,
  createIncidencia,
  updateIncidencia,
  deleteIncidencia
} = require('../controllers/incidenciasController');

/**
 * @swagger
 * tags:
 *   name: Incidencias
 *   description: Gestión de incidencias de RRHH
 */

/**
 * @swagger
 * /api/incidencias:
 *   get:
 *     summary: Listar todas las incidencias
 *     tags: [Incidencias]
 *     responses:
 *       200:
 *         description: Lista de incidencias ordenadas por fecha descendente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Incidencia'
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   post:
 *     summary: Crear una nueva incidencia
 *     tags: [Incidencias]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/IncidenciaInput'
 *     responses:
 *       201:
 *         description: Incidencia creada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje: { type: string, example: Incidencia creada }
 *                 id:      { type: integer, example: 42 }
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
router.get('/', getIncidencias);
router.post('/', createIncidencia);

/**
 * @swagger
 * /api/incidencias/{id}:
 *   put:
 *     summary: Actualizar una incidencia
 *     tags: [Incidencias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la incidencia
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/IncidenciaInput'
 *     responses:
 *       200:
 *         description: Incidencia actualizada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje: { type: string, example: Incidencia actualizada }
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Incidencia no encontrada
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
 *     summary: Eliminar una incidencia
 *     tags: [Incidencias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la incidencia
 *     responses:
 *       200:
 *         description: Incidencia eliminada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje: { type: string, example: Incidencia eliminada }
 *       404:
 *         description: Incidencia no encontrada
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
router.put('/:id', updateIncidencia);
router.delete('/:id', deleteIncidencia);

module.exports = router;
