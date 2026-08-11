const express = require('express');
const path = require('path');
const Database = require('better-sqlite3');

const app = express();
const db = new Database('restaurante.db');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  const platos = db.prepare(`SELECT platos.*, chefs.nombre AS chef_nombre, chefs.especialidad AS chef_especialidad FROM platos JOIN chefs ON platos.chef_id = chefs.id`).all();
  res.render('index', { platos });
});

app.get('/plato/:id', (req, res) => {
  const plato = db.prepare(`SELECT platos.*, chefs.nombre AS chef_nombre, chefs.especialidad AS chef_especialidad FROM platos JOIN chefs ON platos.chef_id = chefs.id WHERE platos.id = ?`).get(req.params.id);
  if (!plato) {
    return res.status(404).send('Plato no encontrado');
  }
  res.render('detalle', { plato });
});

app.listen(3001, () => {
  console.log('Servidor corriendo en http://localhost:3001');
});
