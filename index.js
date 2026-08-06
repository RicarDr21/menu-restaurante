const express = require('express');
const path = require('path');
const platos = require('./data/platos');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('index', { platos });
});

app.get('/plato/:id', (req, res) => {
  const plato = platos.find(p => p.id === parseInt(req.params.id));
  if (!plato) {
    return res.status(404).send('Plato no encontrado');
  }
  res.render('detalle', { plato });
});

app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
