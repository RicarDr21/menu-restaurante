const express = require('express');
const path = require('path');
const Database = require('better-sqlite3');
const { ObjectId } = require('mongodb');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const { conectarMongo, getDB } = require('./db-mongo');
const resenasRouter = require('./routes/api/resenas');

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

app.use('/api/resenas', resenasRouter);

// ===== Documentación Swagger =====

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ===== Arrancar el servidor =====

conectarMongo()
  .then(() => {
    app.listen(3001, () => {
      console.log('Servidor corriendo en http://localhost:3001');
      console.log('Documentacion en http://localhost:3001/api-docs');
    });
  })
  .catch((err) => {
    console.error('No se pudo iniciar el servidor porque falló MongoDB:', err);
  });