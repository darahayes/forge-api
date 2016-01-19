var _ = require('lodash');
var Joi = require('joi');
var Boom = require('boom');

exports.register = function(server, options, next) {
    options = { basePath: '/api/exercises' };

    var routes = [
     {
        method: 'POST',
        path: options.basePath,
        config: {
          auth: 'logged_in',
          validate: {
            payload: {
              name: Joi.string().required(),
              category: Joi.string().valid('Resistance', 'Cardio').required(),
              tags: Joi.array().items(Joi.string()).min(1)
            }
          },
          handler: save_exercise
        }
     },
     {
      method: 'GET',
      path: options.basePath,
      config: {
        auth: 'logged_in',
        handler: list_exercises
      }
     },
     {
       method: 'DELETE',
       path: options.basePath,
       config: {
         auth: 'logged_in',
         handler : remove_exercises
       }
     }
    ];

    function save_exercise(request, reply) {
      console.log('\n\n\n\nPARAMS\n\n\n\n', request.payload);
      var msg = _.extend({role: 'exercises', cmd: 'save', created_by: request.auth.credentials.login.user}, request.payload);
      request.seneca.act(msg, function(err, out) {
        if (err) return reply(Boom.expectationFailed('Error Saving Exercise'));
        return reply(out);
      });
    }

    function list_exercises(request, reply) {
      return reply.act({role: 'exercises', cmd: 'list', created_by: request.auth.credentials.login.user});
    }

    function remove_exercises(request, reply) {
      return reply.act({role: 'exercises', cmd: 'remove_exercises', user: request.auth.credentials.login.user});
    }

    server.route(routes);
    next();
};

exports.register.attributes = {
  name: 'api-exercises-service'
};