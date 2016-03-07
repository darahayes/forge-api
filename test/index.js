'use strict';

const api = require('../server/server')
const Hapi = require('hapi');
const Code = require('code');
const Lab = require('lab');
const Options = require('../config');
const Jwt = require('hapi-auth-jwt2');
// shortcuts
const lab = exports.lab = Lab.script();
const describe = lab.describe;
const it = lab.it;
const before = lab.before;
const expect = Code.expect;

before(function (done) {
    api.on('pluginsLoaded', () => {
      done();
    });
});

describe('Testing exercises routes', () => {
  let server = new Hapi.Server()
  server.connection()

  before((done) => {
    let plugins = [{register: Jwt},{register: require('../lib/local_jwt_auth')}]
    server.register(plugins, (err) => {
      done()
    });
  });

  it('exercises plugin can load', (done) => {
    let plugin = {register: require('../routes/exercises')}
    server.register(plugin, (err) => {
      expect(err).to.be.equal(undefined);
      done()
    });
  });

  it('GET /exercises should work when unauthenticated', (done) => {
    let options = {
      url: '/api/exercises',
      method: 'GET'
    }
    api.inject(options, (response) => {
      expect(response.result).to.be.instanceof(Array);
      expect(response.result).to.have.length(594);
      done();
    });
  });
}) 