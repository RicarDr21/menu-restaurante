const Database = require('better-sqlite3');
const db = new Database('restaurante.db');

// Crear tabla de chefs
db.exec(`
  CREATE TABLE IF NOT EXISTS chefs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    especialidad TEXT NOT NULL
  )
`);

// Crear tabla de platos, con llave foranea hacia chefs
db.exec(`
  CREATE TABLE IF NOT EXISTS platos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    descripcion TEXT NOT NULL,
    precio INTEGER NOT NULL,
    categoria TEXT NOT NULL,
    chef_id INTEGER NOT NULL,
    FOREIGN KEY (chef_id) REFERENCES chefs(id)
  )
`);

// Limpiar datos previos (para poder correr este script varias veces sin duplicar)
db.exec('DELETE FROM platos');
db.exec('DELETE FROM chefs');

// Insertar chefs
const insertChef = db.prepare('INSERT INTO chefs (id, nombre, especialidad) VALUES (?, ?, ?)');
insertChef.run(1, 'Carlos Ramírez', 'Cocina tradicional colombiana');
insertChef.run(2, 'Laura Gómez', 'Cocina costeña');
insertChef.run(3, 'Ana Torres', 'Repostería');

// Insertar platos, cada uno con su chef_id
const insertPlato = db.prepare(`
  INSERT INTO platos (nombre, descripcion, precio, categoria, chef_id)
  VALUES (?, ?, ?, ?, ?)
`);
insertPlato.run('Bandeja Paisa', 'Frijoles, arroz, carne molida, chicharrón, huevo, plátano y arepa.', 32000, 'Plato fuerte', 1);
insertPlato.run('Ceviche de Camarón', 'Camarones frescos marinados en limón con cebolla morada y cilantro.', 28000, 'Entrada', 2);
insertPlato.run('Sancocho de Gallina', 'Sopa tradicional con gallina, yuca, plátano y mazorca.', 25000, 'Sopa', 1);
insertPlato.run('Tres Leches', 'Postre húmedo bañado en tres tipos de leche, con canela.', 12000, 'Postre', 3);

console.log('Base de datos creada e inicializada correctamente.');
db.close();