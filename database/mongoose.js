const mongoose = require('mongoose');
const log = require('../logger');

module.exports.connect = async () => {

  mongoose.connection.on('connecting', () => { 
    console.log('Connecting to MongoDB...');
    log.info('Connecting to MongoDB...');
  });
  mongoose.connection.on('error', err => { 
    console.log('Error on connecting to MongoDB', err);
    log.error('Connecting to MongoDB failed', { err });
  });
  mongoose.connection.on('connected', () => { 
    console.log('Connected to MongoDB');
    log.info('Connected to MongoDB');
  });

  const uri = process.env.MONGO_URI;

  if (uri) await mongoose.connect(uri);
  else {
    const user = process.env.MONGO_USER;
    const pass = process.env.MONGO_PWD;
    const host = process.env.MONGO_HOST;
    const db = process.env.MONGO_DB;
    const authSource = process.env.MONGO_AUTH_SOURCE;

    await mongoose.connect(`mongodb://${host}/${db}`, {
        authSource,
        user,
        pass,
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
  }
}