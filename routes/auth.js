var _ = require('lodash');
var Joi = require('joi');
var Boom = require('boom');
var jwt = require('jsonwebtoken');
var options = require('../config');

exports.register = function(server, options, next) {

	var routes = [
	  {
	    method: 'POST',
	    path: '/api/register',
	    config: {
	      validate: {
	        payload: {
	          name: Joi.string().required(),
	          email: Joi.string().email().required(),
	          password: Joi.string().required().min(6)
	        }
	      },
	      handler: register
	    }
	  },
	  {
	  	method: 'POST',
	    path: '/api/login',
	    config: {
	      validate: {
	        payload: {
	          email: Joi.string().email().required(),
	          password: Joi.string().required()
	        }
	      },
	      handler: login
	    }
	  },
	  {
	  	method: 'POST',
	    path: '/api/logout',
	    config: {
	    	auth: 'jwt',
	      handler: logout
	    }
	  },
	];

	server.route(routes);
	next();
}

function register(request, reply) {
	var msg = _.extend({role: 'user', cmd: 'register'}, request.payload);
	request.seneca.act(msg, function(err, out) {
		if (err) return reply(Boom.expectationFailed('Something went terribly wrong, please try again.'));
		console.log(out);
		var token = jwt.sign(out.login, options.jwtKey);
		return reply(out.user).header('Authorization', token);
	}); 
}

function login(request, reply) {
	var msg = _.extend({role: 'user', cmd: 'login'}, request.payload);
	request.seneca.act(msg, function(err, out) {
		if (err) {
			request.log('error', err);
			return reply(Boom.expectationFailed('Something went terribly wrong, please try again.'));
		}
		return reply(clean_user(out.user)).header('Authorization', jwt.sign(out.login, options.jwtKey));
	});
}

function logout(request, reply) {
	request.seneca.act({role: 'user', cmd: 'logout', token: request.auth.credentials.token}, function(err, result) {
		if (err) {
			console.log('error', err);
			return reply(Boom.expectationFailed('Something went wrong, please try again.'));
		}
		return reply('Logged out');
	})
}

function clean_user(user) {
	return {name: user.name, email: user.email, id: user.id}
}

exports.register.attributes = {
  name: 'api-auth-service'
};

