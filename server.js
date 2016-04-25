const Hapi = require('hapi');
const mongoose = require('mongoose');
const routeArray = require(__dirname + '/routes/router.js');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/planet_db');

// Create a server with a host and port
const server = module.exports = new Hapi.Server();
server.connection( {
  host: 'localhost',
  port: 3000
});

// Start server
server.start((err) => {
  if (err) {
    throw err;
  }
  console.log('Server running at:', server.info.uri);
});

server.route(routeArray);
