var Chairo = require('chairo');
var Hapi = require('hapi');
var options = require('./config');
var boom = require('boom');
var jwt = require('hapi-auth-jwt2');

//connection options
var server = new Hapi.Server();
server.connection({ port: 4000, routes: { cors: {additionalExposedHeaders: ['Authorization', 'authorization'], credentials: true} } });
// server.ext('onPreResponse', cors);



function checkHapiPluginError(error) {
  if (error) {
    console.log('An error occurred while loading a hapi plugin');
    throw error;
  }
}

// Register plugins
var plugins = [Chairo, jwt];

server.register(plugins, function (err) {
  checkHapiPluginError(err);
  var seneca = server.seneca;

  seneca
    .use('mongo-store', options.mongo)
    .use('progress-calendar')
    .use('progress-exercises')
    .use('user');

  server.auth.strategy('jwt', 'jwt', {
    key: options.jwtKey,
    validateFunc: authenticate
  });

  seneca.ready(function(err) {
    server.register(require('./routes/exercises'), function(err) {
      checkHapiPluginError(err);
    });

    server.register(require('./routes/calendar'), function(err) {
      checkHapiPluginError(err);
    });

    server.start(() => {
      console.log('Server running at:', server.info.uri);
    });
  }); 
});

server.register(require('./routes/auth'), function(err) {
  checkHapiPluginError(err);
});

function authenticate(decoded, request, cb) {
    // console.log(request)
    console.log('Decoded', decoded)
    var token = decoded;
    request.seneca.act({role: 'user', cmd:'auth', token: token}, function (err, resp) {
      if (err) return cb(err);
      if (resp.ok === false) {
        return cb(null, false)
      }
      return cb(null, true)
    });
  }
