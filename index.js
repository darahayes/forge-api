var Chairo = require('chairo');
var Hapi = require('hapi');
var options = require('./config');
var Hapi_Cookie = require('hapi-auth-cookie'); 

var server = new Hapi.Server();
server.connection({ port: 3000 });
server.method('getUser', getUser, {}); 
// Register plugin

server.route({
  method: 'GET',
  path: '/api/hello',
  handler: function (request, reply) {
    server.methods.getUser(request, function(err, out) {
      return reply.act({role: 'calendar', cmd: 'history', user: out.user.id});
    });
  }
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

function checkHapiPluginError(error) {
  if (error) {
    console.log('An error occurred while loading a hapu plugin');
    throw error;
  }
}

function getUser (request, cb) {
  var token = request.state['seneca-login']['seneca-login'];
  if (token) {
    request.seneca.act({role: 'user', cmd:'auth', token: token}, function (err, resp) {
      if (err) return cb(err);
      if (resp.ok === false) {
        return cb('login not ok');
      }
      return cb(null, resp);
    });
  } else {
    setImmediate(cb);
  }
}