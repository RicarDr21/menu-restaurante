const express = require('express');
const path = require('path');
const Database = require('better-sqlite3');
const { ObjectId } = require('mongodb');
const { conectarMongo, getDB } = require('./db-mongo');

const app = express();
const db = new Database('restaurante.db');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ===== RUTAS SQLite (platos) =====

app.get('/', (req, res) => {
  const platos = db.prepare(`SELECT platos.*, chefs.nombre AS chef_nombre, chefs.especialidad AS chef_especialidad FROM platos JOIN chefs ON platos.chef_id = chefs.id`).all();
  res.render('index', { platos });
});

app.get('/plato/:id', async (req, res) => {
  const plato = db.prepare(`SELECT platos.*, chefs.nombre AS chef_nombre, chefs.especialidad AS chef_especialidad FROM platos JOIN chefs ON platos.chef_id = chefs.id WHERE platos.id = ?`).get(req.params.id);
  if (!plato) {
    return res.status(404).send('Plato no encontrado');
  }

  const mongo = getDB();
  const resenas = await mongo.collection('resenas')
    .find({ platoId: parseInt(req.params.id) })
    .sort({ fecha: -1 })
    .toArray();

  res.render('detalle', { plato, resenas });
});

// ===== RUTAS MongoDB (reseñas) - CRUD con vistas =====

app.post('/plato/:id/resenas', async (req, res) => {
  const mongo = getDB();
  const { nombre, comentario, calificacion } = req.body;

  await mongo.collection('resenas').insertOne({
    platoId: parseInt(req.params.id),
    nombre,
    comentario,
    calificacion: parseInt(calificacion),
    fecha: new Date()
  });

  res.redirect('/plato/' + req.params.id);
});

app.get('/resena/:id/editar', async (req, res) => {
  const mongo = getDB();
  const resena = await mongo.collection('resenas').findOne({ _id: new ObjectId(req.params.id) });

  if (!resena) {
    return res.status(404).send('Reseña no encontrada');
  }

  res.render('editar-resena', { resena });
});

app.post('/resena/:id/editar', async (req, res) => {
  const mongo = getDB();
  const { nombre, comentario, calificacion } = req.body;

  const resena = await mongo.collection('resenas').findOne({ _id: new ObjectId(req.params.id) });

  await mongo.collection('resenas').updateOne(
    { _id: new ObjectId(req.params.id) },
    { $set: { nombre, comentario, calificacion: parseInt(calificacion) } }
  );

  res.redirect('/plato/' + resena.platoId);
});

app.post('/resena/:id/eliminar', async (req, res) => {
  const mongo = getDB();

  const resena = await mongo.collection('resenas').findOne({ _id: new ObjectId(req.params.id) });
  await mongo.collection('resenas').deleteOne({ _id: new ObjectId(req.params.id) });

  res.redirect('/plato/' + (resena ? resena.platoId : ''));
});

// ===== API REST - Reseñas =====

app.get('/api/resenas', async (req, res) => {
  const mongo = getDB();
  const todas = await mongo.collection('resenas').find().sort({ fecha: -1 }).toArray();
  res.status(200).json(todas);
});

app.get('/api/resenas/:id', async (req, res) => {
  const mongo = getDB();
  const resena = await mongo.collection('resenas').findOne({ _id: new ObjectId(req.params.id) });
  if (!resena) return res.status(404).json({ error: 'Reseña no encontrada' });
  res.status(200).json(resena);
});

app.post('/api/resenas', async (req, res) => {
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

app.put('/api/resenas/:id', async (req, res) => {
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

app.delete('/api/resenas/:id', async (req, res) => {
  const mongo = getDB();
  const eliminada = await mongo.collection('resenas').findOneAndDelete({ _id: new ObjectId(req.params.id) });
  if (!eliminada) return res.status(404).json({ error: 'Reseña no encontrada' });
  res.status(204).send();
});

// ===== Arrancar el servidor =====

conectarMongo()
  .then(() => {
    app.listen(3001, () => {
      console.log('Servidor corriendo en http://localhost:3001');
    });
  })
  .catch((err) => {
    console.error('No se pudo iniciar el servidor porque falló MongoDB:', err);
  });