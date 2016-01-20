var _ = require('lodash');
var Joi = require('joi');
var Boom = require('boom');
var moment = require('moment');
var validations = require('./validations');

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
              exercises: validations.exercise
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
      msg = (request.query.date) ? _.extend({date: request.query.date}, msg) : msg;
      return reply.act(msg);
    }

    server.route(routes);
    next();
};

exports.register.attributes = {
  name: 'api-calendar-service'
};