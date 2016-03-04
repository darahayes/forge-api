'use strict';

const Chairo = require('chairo');
const Hapi = require('hapi');
const Options = require('./config');
const Boom = require('boom');
const Jwt = require('hapi-auth-jwt2');

//connection options
const server = new Hapi.Server(Options['hapi-server']);
server.connection(Options['hapi-connection']);
// server.ext('onPreResponse', cors);

function checkHapiPluginError(error) {
  if (error) {
    console.log('An error occurred while loading a hapi plugin');
    throw error;
  }
}

// Register plugins
const plugins = [
  {
    register: Chairo
  },
  {
    register: Jwt
  },
  {
    register: require('./lib/local_jwt_auth.js'),
    options : Options
  },
  {
    register: require('./routes/auth'),
    options: Options
  },
  {
    register: require('./routes/exercises')
  },
  {
    register: require('./routes/calendar')
  }
];

server.register(plugins, (err) => {
  checkHapiPluginError(err);
  const seneca = server.seneca;

  seneca.ready((err) => {
    if (err) {
      throw err;
    }

    Options.clients.forEach(function(opts) {
      console.log('Registering Client', JSON.stringify(opts))
      seneca.client(opts);
    })

    server.start(() => {
      console.log('Server running at:', server.info.uri);
    });
  }); 
});
