const platos = [
  {
    id: 1,
    nombre: 'Bandeja Paisa',
    descripcion: 'Frijoles, arroz, carne molida, chicharrón, huevo, plátano y arepa.',
    precio: 32000,
    categoria: 'Plato fuerte',
    chef: {
      nombre: 'Carlos Ramírez',
      especialidad: 'Cocina tradicional colombiana'
    }
  },
  {
    id: 2,
    nombre: 'Ceviche de Camarón',
    descripcion: 'Camarones frescos marinados en limón con cebolla morada y cilantro.',
    precio: 28000,
    categoria: 'Entrada',
    chef: {
      nombre: 'Laura Gómez',
      especialidad: 'Cocina costeña'
    }
  },
  {
    id: 3,
    nombre: 'Sancocho de Gallina',
    descripcion: 'Sopa tradicional con gallina, yuca, plátano y mazorca.',
    precio: 25000,
    categoria: 'Sopa',
    chef: {
      nombre: 'Carlos Ramírez',
      especialidad: 'Cocina tradicional colombiana'
    }
  },
  {
    id: 4,
    nombre: 'Tres Leches',
    descripcion: 'Postre húmedo bañado en tres tipos de leche, con canela.',
    precio: 12000,
    categoria: 'Postre',
    chef: {
      nombre: 'Ana Torres',
      especialidad: 'Repostería'
    }
  }
];

module.exports = platos;