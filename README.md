# Menu Restaurante

App de catalogo de platos con Express, EJS, SQLite (platos y chefs) y MongoDB Atlas (reseñas).

## Instalar y correr

npm install
node index.js

Abrir http://localhost:3001

Necesitas un archivo .env en la raiz con:

MONGO_URI=mongodb+srv://usuario:password@devweb.tmpnhh2.mongodb.net/?appName=DevWeb

## API REST - Resenas

Base: http://localhost:3001/api/resenas

GET    /api/resenas       -> lista todas (200)
GET    /api/resenas/:id   -> una por id (200 / 404)
POST   /api/resenas       -> crear (201)
PUT    /api/resenas/:id   -> editar (200 / 404)
DELETE /api/resenas/:id   -> eliminar (204 / 404)

Body para POST:
{
  "platoId": 1,
  "nombre": "David",
  "comentario": "Muy buen plato",
  "calificacion": 5
}

Body para PUT:
{
  "nombre": "David",
  "comentario": "Comentario editado",
  "calificacion": 4
}

Probado en Postman, las 5 operaciones responden con el status correcto.
