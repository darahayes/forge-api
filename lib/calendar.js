var _ = require('lodash');
var Joi = require('joi');
var Boom = require('boom');
var moment = require('moment');

exports.register = function(server, options, next) {
    options = { basePath: '/api/calendar' };

    var routes = [
      {
        method: 'GET',
        path: options.basePath,
        config: {
          auth: 'logged_in',
          validate: {
            query: {
              date: Joi.date().format('MM-DD-YYYY')
            }
          },
          handler: history
        }
      },
      {
        method: 'POST',
        path: options.basePath,
        config: {
          auth: 'logged_in',
          validate: {
            payload: {
              date: Joi.date().format('MM-DD-YYYY').default(moment().format("MM-DD-YYYY")),
              exercises: Joi.array().items(Joi.object().keys({
                id: Joi.string().required(),
                name: Joi.string().required(),
                category: Joi.string().valid('Resistance').required(),
                sets: Joi.array().items(Joi.object().keys({
                  weight: Joi.number().precision(3).default(0),
                  reps: Joi.number().integer().min(1).required(),
                  unit: Joi.string().valid('lbs', 'kgs').required()
                })).required().min(1)
              }), Joi.object().keys({
                id: Joi.string().required(),
                name: Joi.string().required(),
                category: Joi.string().valid('Cardio').required(),
                distance: Joi.number().positive().required(),
                time_ms: Joi.number().positive().min(1).required(),
                unit: Joi.string().valid('mi', 'm', 'km').required()
              })).required().min(1)
            }
          },
          handler: log_workout
        }
      }
    ];

    function log_workout(request, reply) {
      var msg = {
                  role: 'calendar',
                  cmd : 'save',
                  user: request.auth.credentials.login.user,
                  workout: request.payload
                };
      request.seneca.act(msg, function(err, resp) {
        return reply(err, resp);
      });
    }

    function history(request, reply) {
      var msg = {role: 'calendar', cmd: 'history', user: request.auth.credentials.login.user};
      msg = (request.payload.date) ? _.extend({date: request.payload.date}, msg) : msg;
      return reply.act(msg);
    }

    server.route(routes);
    next();
};

exports.register.attributes = {
  name: 'api-calendar-service'
};