'use strict';

const Chairo = require('chairo');
const Hapi = require('hapi');
const Options = require('../config');
const Boom = require('boom');
const Jwt = require('hapi-auth-jwt2');
const Good = require('good');

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
    register: require('../lib/local_jwt_auth.js'),
    options : Options
  },
  {
    register: require('../routes/auth'),
    options: Options
  },
  {
    register: require('../routes/exercises')
  },
  {
    register: require('../routes/calendar')
  },
  {
    register: Good,
    options: Options.good
  }
];

server.register(plugins, (err) => {
  checkHapiPluginError(err);
  const seneca = server.seneca;

  seneca.ready((err) => {
    if (err) {
      throw err;
    }
    if (Options.production) {
      Options.clients.forEach(function(opts) {
        console.log('Running in production mode');
        console.log('Registering Client', JSON.stringify(opts))
        seneca.client(opts);
      });
    }
    else {
      console.log('Running in development mode');
      seneca
        // .use('mongo-store', Options.mongo)
        .use('forge-calendar')
        .use('forge-exercises')
        .use('user');
    }
    server.emit('pluginsLoaded');
  }); 
});

module.exports = server