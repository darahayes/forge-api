'use strict';

const _ = require('lodash');
const Joi = require('joi');
const Boom = require('boom');
const Moment = require('moment');
const Validations = require('../lib/validations');

exports.register = function(server, options, next) {
    options = { basePath: '/api/calendar' };

    const routes = [
      {
        method: 'GET',
        path: options.basePath,
        config: {
          auth: 'jwt',
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
          auth: 'jwt',
          validate: {
            payload: {
              date: Joi.date().format('MM-DD-YYYY').default(Moment().format('MM-DD-YYYY')),
              exercises: Validations.exercise
            }
          },
          handler: log_workout
        }
      }
    ];

    function log_workout(request, reply) {
      let msg = {
        role: 'calendar',
        cmd : 'save',
        user: request.auth.credentials.user,
        workout: request.payload
      };
      request.seneca.act(msg, (err, resp) => {
        return reply(err, resp);
      });
    }

    function history(request, reply) {
      let msg = {role: 'calendar', cmd: 'history', user: request.auth.credentials.user};
      msg = (request.payload.date) ? _.extend({date: request.payload.date}, msg) : msg;
      return reply.act(msg);
    }

    server.route(routes);
    next();
};

exports.register.attributes = {
  name: 'api-calendar-service'
};