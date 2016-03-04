'use strict';
const Jwt = require('hapi-auth-jwt2');

exports.register = function(server, options, next) {

  server.decorate('server', 'authenticate', authenticate);

  server.auth.strategy('jwt', 'jwt', {
    key: options.jwtKey,
    validateFunc: server.authenticate
  });

  next();

  function authenticate(decoded, request, cb) {
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
}

exports.register.attributes = {
  name: 'local-jwt-strategy'
};