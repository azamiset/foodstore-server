const mongoose = require('mongoose');
const { dbHost, dbPort, dbName } = require('../app/config');

mongoose.connect(`mongodb://${dbHost}:${dbPort}/${dbName}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

module.exports = db;