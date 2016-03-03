var Chairo = require('chairo');
var Hapi = require('hapi');
var options = require('./config');
var boom = require('boom');
var jwt = require('hapi-auth-jwt2');

//connection options
var server = new Hapi.Server(options['hapi-server']);
server.connection(options['hapi-connection']);
// server.ext('onPreResponse', cors);

function checkHapiPluginError(error) {
  if (error) {
    console.log('An error occurred while loading a hapi plugin');
    throw error;
  }
}

// Register plugins
var plugins = [{register: Chairo}, {register: jwt}];

server.register(plugins, function (err) {
  checkHapiPluginError(err);
  var seneca = server.seneca;

  seneca.ready(function(err) {

    server.auth.strategy('jwt', 'jwt', {
      key: options.jwtKey,
      validateFunc: authenticate
    });

    server.register(require('./routes/exercises'), function(err) {
      checkHapiPluginError(err);
    });

    server.register(require('./routes/calendar'), function(err) {
      checkHapiPluginError(err);
    });

    server.register(require('./routes/auth'), function(err) {
      checkHapiPluginError(err);
    });

    options.clients.forEach(function(opts) {
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
  var token = decoded;
  request.seneca.act({role: 'user', cmd:'auth', token: token}, function (err, resp) {
    if (err) return cb(null, err);
    if (resp.ok === false) {
      return cb(null, false)
    }
    return cb(null, true)
  });
}
