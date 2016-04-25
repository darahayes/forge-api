'use strict';

let server = require('../server/server')
const Code = require('code');
const Lab = require('lab');
// shortcuts
const lab = exports.lab = Lab.script();
const describe = lab.describe;
const it = lab.it;
const expect = Code.expect;

const exercises_db = require('./test_exercises_db');
const test_history = require('./test_history')

let testCredentials;

lab.before((done) => {
    server.on('pluginsLoaded', (err) => {
      let registration_opts = {
        url: '/api/register',
        method: 'POST',
        payload: {
          name: 'Test User',
          email: 'test@email.com',
          password: 'password'
        }
      }
      exercises_db.forEach((ex) => {
        let msg = {
          role: 'exercises',
          cmd: 'save',
          name: ex.name,
          category: ex.category,
          tags: ex.tags,
          created_by: null,
          main_target: ex.main_target,
          equipment: ex.equipment
        }
        server.seneca.act(msg, (err, result) => {

        })
      });
      server.inject(registration_opts, (response) => {
        if (response.result.user) {
          console.log('created test user');
          console.log(JSON.stringify(response.result.user))
          testCredentials = {id: response.result.user.id};
          done()
        }
      });
    });
});

describe('Testing exercises routes', () => {
  it('/api/exercises should return a large array', (done) => {
    let options = {
      url: '/api/exercises',
      method: 'GET',
      credentials: testCredentials
    }
    server.inject(options, (response) => {
      expect(response.result).to.be.instanceof(Array);
      expect(response.result).to.have.length(572);
      done();
    })
  })
})

describe('Testing calendar routes', () => {
  it('POST to /calendar should return sync_token and history', (done) => {
    let options = {
      url: '/api/calendar',
      method: 'POST',
      credentials: testCredentials,
      payload: {
        workouts: test_history
      }
    }
    server.inject(options, (response) => {
      console.log(response.result)
      expect(response.result).to.include(['history', 'sync_token']);
      done();
    })
  })

  it('GET to /calendar should return sync_token and history', (done) => {
    let options = {
      url: '/api/calendar',
      method: 'GET',
      credentials: testCredentials
    }
    server.inject(options, (response) => {
      console.log(response.result)
      expect(response.result).to.include(['history', 'sync_token']);
      done();
    })
  })

  it('GET to /calendar/sync should return sync_token', (done) => {
    let options = {
      url: '/api/calendar/sync',
      method: 'GET',
      credentials: testCredentials
    }
    server.inject(options, (response) => {
      console.log(response.result)
      expect(response.result).to.include(['timestamp', 'userId', 'id']);
      done();
    })
  })
}) 