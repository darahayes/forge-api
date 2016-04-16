'use strict';

var server = require('../server/server')
const Code = require('code');
const Lab = require('lab');
// shortcuts
const lab = exports.lab = Lab.script();
const describe = lab.describe;
const it = lab.it;
const expect = Code.expect;

lab.before(function (done) {
    server.on('pluginsLoaded', done);
});

describe('Testing exercises routes', () => {
  it('/exercises should return a large array', (done) => {
    let options = {
      url: '/api/exercises',
      method: 'GET'
    }
    server.inject(options, (response) => {
      expect(response.result).to.be.instanceof(Array);
      expect(response.result).to.have.length(594);
      done();
    })
  })
}) 