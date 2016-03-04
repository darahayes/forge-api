'use strict';

const _ = require('lodash');
const Joi = require('joi');
const Boom = require('boom');

exports.register = function(server, options, next) {
    options = { basePath: '/api/exercises' };

    const routes = [
      {
        method: 'POST',
        path: options.basePath,
        config: {
          auth: 'jwt',
          validate: {
            payload: {
              name: Joi.string().required(),
              category: Joi.string().valid('Resistance', 'Cardio').required(),
              tags: Joi.array().items(Joi.string()).required().min(1)
            }
          },
          handler: save_exercise
        }
      },
      {
        method: 'GET',
        path: options.basePath,
        config: {
          auth: {
            mode: 'try',
            strategy: 'jwt'
          },
          handler: list_exercises
        }
      },
      {
        method: 'DELETE',
        path: options.basePath,
        config: {
          auth: 'jwt',
          handler : remove_exercises
        }
      }
    ];

    function save_exercise(request, reply) {
      console.log('\n\n\n\nPARAMS\n\n\n\n', request.payload);
      let msg = _.extend({role: 'exercises', cmd: 'save', created_by: request.auth.credentials.user}, request.payload);
      request.seneca.act(msg, (err, out) => {
        if (err) return reply(Boom.expectationFailed('Error Saving Exercise'));
        return reply(out);
      });
    }

    function list_exercises(request, reply) {
      let user = (request.auth.credentials) ? request.auth.credentials.user : null
      return reply.act({role: 'exercises', cmd: 'list', created_by: user});
    }

    function remove_exercises(request, reply) {
      return reply.act({role: 'exercises', cmd: 'remove_exercises', user: request.auth.credentials.user});
    }

    server.route(routes);
    next();
};

exports.register.attributes = {
  name: 'api-exercises-service'
};