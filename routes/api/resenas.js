const express = require('express');
const { ObjectId } = require('mongodb');
const { getDB } = require('../../db-mongo');

const router = express.Router();

/**
 * @openapi
 * /api/resenas:
 *   get:
 *     summary: Devuelve todas las reseñas registradas
 *     responses:
 *       200:
 *         description: Lista de reseñas devuelta correctamente
 */
router.get('/', async (req, res) => {
  const mongo = getDB();
  const todas = await mongo.collection('resenas').find().sort({ fecha: -1 }).toArray();
  res.status(200).json(todas);
});

/**
 * @openapi
 * /api/resenas/{id}:
 *   get:
 *     summary: Devuelve una reseña por su id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Reseña encontrada
 *       404:
 *         description: Reseña no encontrada
 */
router.get('/:id', async (req, res) => {
  const mongo = getDB();
  const resena = await mongo.collection('resenas').findOne({ _id: new ObjectId(req.params.id) });
  if (!resena) return res.status(404).json({ error: 'Reseña no encontrada' });
  res.status(200).json(resena);
});

/**
 * @openapi
 * /api/resenas:
 *   post:
 *     summary: Crea una reseña nueva
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               platoId:
 *                 type: integer
 *               nombre:
 *                 type: string
 *               comentario:
 *                 type: string
 *               calificacion:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Reseña creada correctamente
 */
router.post('/', async (req, res) => {
  const mongo = getDB();
  const { platoId, nombre, comentario, calificacion } = req.body;

  const nueva = {
    platoId: parseInt(platoId),
    nombre,
    comentario,
    calificacion: parseInt(calificacion),
    fecha: new Date()
  };

  const resultado = await mongo.collection('resenas').insertOne(nueva);
  res.status(201).json({ _id: resultado.insertedId, ...nueva });
});

/**
 * @openapi
 * /api/resenas/{id}:
 *   put:
 *     summary: Edita una reseña existente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               comentario:
 *                 type: string
 *               calificacion:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Reseña actualizada correctamente
 *       404:
 *         description: Reseña no encontrada
 */
router.put('/:id', async (req, res) => {
  const mongo = getDB();
  const { nombre, comentario, calificacion } = req.body;

  const actualizada = await mongo.collection('resenas').findOneAndUpdate(
    { _id: new ObjectId(req.params.id) },
    { $set: { nombre, comentario, calificacion: parseInt(calificacion) } },
    { returnDocument: 'after' }
  );

  if (!actualizada) return res.status(404).json({ error: 'Reseña no encontrada' });
  res.status(200).json(actualizada);
});

/**
 * @openapi
 * /api/resenas/{id}:
 *   delete:
 *     summary: Elimina una reseña
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Reseña eliminada correctamente
 *       404:
 *         description: Reseña no encontrada
 */
router.delete('/:id', async (req, res) => {
  const mongo = getDB();
  const eliminada = await mongo.collection('resenas').findOneAndDelete({ _id: new ObjectId(req.params.id) });
  if (!eliminada) return res.status(404).json({ error: 'Reseña no encontrada' });
  res.status(204).send();
});

module.exports = router;