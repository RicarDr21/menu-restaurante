// db-mongo.js
require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

let db;

async function conectarMongo() {
  try {
    await client.connect();
    console.log('✅ Conectado a MongoDB Atlas');
    db = client.db('menu_restaurante');
    return db;
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB:', error);
    throw error;
  }
}

function getDB() {
  if (!db) {
    throw new Error('La base de datos no ha sido inicializada. Llama a conectarMongo() primero.');
  }
  return db;
}

module.exports = { conectarMongo, getDB };