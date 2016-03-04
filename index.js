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
const plugins = [{register: Chairo}, {register: Jwt}];

server.register(plugins, (err) => {
  checkHapiPluginError(err);
  const seneca = server.seneca;

  seneca.ready((err) => {

    server.auth.strategy('jwt', 'jwt', {
      key: Options.jwtKey,
      validateFunc: authenticate
    });

    server.register(require('./routes/exercises'), (err) => {
      checkHapiPluginError(err);
    });

    server.register(require('./routes/calendar'), (err) => {
      checkHapiPluginError(err);
    });

    server.register(require('./routes/auth'), (err) => {
      checkHapiPluginError(err);
    });

    Options.clients.forEach(function(opts) {
      console.log('Registering Client', JSON.stringify(opts))
      seneca.client(opts);
    })

    server.start(() => {
      console.log('Server running at:', server.info.uri);
    });
  }); 
});

function authenticate(decoded, request, cb) {
  // console.log(request)
  console.log('Decoded', decoded)
  const token = decoded;
  request.seneca.act({role: 'user', cmd:'auth', token: token}, (err, resp) => {
    if (err) return cb(null, err);
    if (resp.ok === false) {
      return cb(null, false)
    }
    return cb(null, true)
  });
}
