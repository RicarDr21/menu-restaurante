# Menu Restaurante - Backend

API y sitio web del restaurante, hecho con Express, EJS, SQLite (platos y chefs) y MongoDB Atlas (resenas).

## Que hace

- Muestra el catalogo de platos con su chef (SQLite)
- Pagina de detalle por plato con sus resenas (MongoDB)
- CRUD de resenas con formularios HTML (crear, editar, eliminar)
- API REST de resenas en /api/resenas (5 endpoints)
- API REST de platos en /api/platos (solo lectura)
- Documentacion interactiva con Swagger en /api-docs
- Indice en MongoDB sobre resenas.platoId para consultas mas rapidas
- CORS habilitado, autoriza al frontend en localhost:5173

## Instalar y correr

npm install
node index.js

Abrir http://localhost:3001
Documentacion Swagger en http://localhost:3001/api-docs

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

Probado en Postman y en Swagger UI, las 5 operaciones responden con el status correcto.

## API REST - Platos

GET /api/platos -> lista todos los platos con su chef (200)

## CORS

Habilitado con el paquete cors, autorizando unicamente al origen http://localhost:5173, que es donde corre el frontend en Vue.

## Frontend relacionado

https://github.com/RicarDr21/menu-restaurante-front
