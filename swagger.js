const swaggerJsdoc = require('swagger-jsdoc');

const spec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Menu Restaurante API',
      version: '1.0.0',
      description: 'API REST de reseñas de platos, sobre MongoDB Atlas'
    }
  },
  apis: ['./routes/api/*.js']
});

module.exports = spec;