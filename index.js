var Chairo = require('chairo');
var Hapi = require('hapi');
var options = require('./config');
var Hapi_Cookie = require('hapi-auth-cookie');
var boom = require('boom');

var server = new Hapi.Server();
server.connection({ port: 3000 });
// Register plugin

server.auth.scheme('custom', scheme);
server.auth.strategy('logged_in', 'custom');
// server.auth.default('default');

server.route({
  method: 'GET',
  path: '/api/hello',
  config: {
    auth: 'logged_in',
    handler: function (request, reply) {
      return reply.act({role: 'calendar', cmd: 'history', user: request.auth.credentials.login});
    }
  }
});

var exercises = require('./lib/exercises');
server.register(exercises, function(err) {
  checkHapiPluginError(err);
});

var plugins = [
  Hapi_Cookie,
  Chairo
];

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

  server.start(() => {
    console.log('Server running at:', server.info.uri);
  });
});

function scheme (server, options) {
  return {
    authenticate: function (request, reply) {
      if (request.state['seneca-login']) {
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