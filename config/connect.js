// config/connect.js
const knex = require('knex');
const config = require('../knexfile');

const environment = 'development';
const dbConfig = config[environment];
const db = knex(dbConfig);

module.exports = {
  db,
  appPort: dbConfig.app.port,
};
