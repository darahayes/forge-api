var Chairo = require('chairo');
var Hapi = require('hapi');
var options = require('./config');
var Hapi_Cookie = require('hapi-auth-cookie');
var boom = require('boom');

//connection options
var server = new Hapi.Server();
server.connection({ port: 3000 });

//create authentication strategy
server.auth.scheme('custom', scheme);
server.auth.strategy('logged_in', 'custom');

function scheme (server, options) {
  return {
    authenticate: function (request, reply) {
      if (request.state['seneca-login']) {
        console.log(request)
        var token = request.state['seneca-login']['seneca-login'];
        request.seneca.act({role: 'user', cmd:'auth', token: token}, function (err, resp) {
          if (err) return reply(err);
          if (resp.ok === false) {
            return reply('login not ok');
          }
          return reply.continue({ credentials: { login: resp.login } });
        });
      }
      else {
        return reply(boom.unauthorized('You must be logged in to continue'));
      }
    }
  };
}

function checkHapiPluginError(error) {
  if (error) {
    console.log('An error occurred while loading a hapu plugin');
    throw error;
  }
}

// Register plugins
var plugins = [Hapi_Cookie, Chairo];

server.register(plugins, function (err) {
  checkHapiPluginError(err);
  var seneca = server.seneca;

  seneca
    .use('mongo-store', options.mongo)
    .use('progress-calendar')
    .use('progress-exercises')
    .use('user')
    .use('auth', {
      restrict: '/api',
      server: 'hapi',
      strategies: [
        {
          provider: 'local'
        }
      ]
    });

  seneca.ready(function(err) {
    server.register(require('./lib/exercises'), function(err) {
      checkHapiPluginError(err);
    });

    server.register(require('./lib/calendar'), function(err) {
      checkHapiPluginError(err);
    });

    server.start(() => {
      console.log('Server running at:', server.info.uri);
    });
  }); 
});

//register routes