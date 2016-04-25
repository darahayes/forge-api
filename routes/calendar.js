'use strict';

const _ = require('lodash');
const Joi = require('joi');
const Boom = require('boom');
const Validations = require('../lib/validations');

exports.register = function(server, options, next) {
    options = { basePath: '/api/calendar' };

    const routes = [
      {
        method: 'GET',
        path: options.basePath,
        config: {
          auth: 'jwt',
          handler: get_history
        }
      },
      {
        method: 'GET',
        path: options.basePath + '/sync',
        config: {
          auth: 'jwt',
          handler: get_sync_token
        }
      },
      {
        method: 'POST',
        path: options.basePath,
        config: {
          auth: 'jwt',
          validate: {
            payload: {
              id: Joi.string(),
              workouts: Validations.workouts
            }
          },
          handler: save_history
        }
      }
    ];

    function save_history(request, reply) {
      let msg = {
        role: 'calendar',
        cmd: 'save_history',
        userId: request.auth.credentials.user,
        workouts: request.payload.workouts
      }
      request.seneca.act(msg, (err, result) => {
        if (err){
          return reply(Boom.unexpectedError(err));
        }
        console.log('Received response from microservice');
        return reply(result);
      })
    }

    function get_history(request, reply) {
      let msg = {
        role: 'calendar',
        cmd: 'get_history',
        userId: request.auth.credentials.user
      };
      request.seneca.act(msg, (err, result) => {
        if (err){
          return reply(Boom.unexpectedError(err));
        }
        console.log('Received response from microservice');
        return reply(result);
      })
    }

    function get_sync_token(request, reply) {
      let msg = {
        role: 'calendar',
        cmd: 'get_sync_token',
        userId: request.auth.credentials.user
      }
      request.seneca.act(msg, (err, result) => {
        if (err){
          return reply(Boom.unexpectedError(err));
        }
        console.log('Received response from microservice');
        console.log(JSON.stringify(msg, null, 2));
        return reply(result);
      })
    }

    server.route(routes);
    next();
};

exports.register.attributes = {
  name: 'api-calendar-service'
};