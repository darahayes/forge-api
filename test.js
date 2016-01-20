var request = require('request');
request = request.defaults({jar: true, headers: {'Content-Type': 'application/json'}});
var login = {};

request({method: 'POST', url: 'http://localhost:3000/auth/login', json: true, body: {email: 'dara@example.com', password: 'password'}}, function(err,response,body) {
  console.log(err);
  console.log(response.headers['content-type']);
  // console.log(response)
  login = body.login;
  console.log(response.state);
  console.log(login);
  // request({method: 'POST', url:'http://localhost:3000/api/exercises', json: true, body: {"name": "my_pushup", "category": "Resistance", "tags": ["Chest", "Arms"]}}, function(err,response,body){ 
  //     console.log(response.headers['content-type']);
  //     console.log(err)
  //     console.log(body)
  // });
  // request({method: 'GET', url:'http://localhost:3000/api/exercises'}, function(err,resp,body) {
  //   console.log('body', body);
  // })
  // request({method: 'GET', url:'http://localhost:3000/api/exercises', qs: {userExercises: true}}, function(err,resp,body) {
  //   console.log('body', body);
  // })
  // request({method: 'DELETE', url:'http://localhost:3000/api/exercises'}, function(err,resp,body) {
  //   console.log(err, body);
  // })
  var e = {name: 'dips', category : 'Resistance', id: 'dips_id', sets: [{weight: 15, reps: 10, unit :'lbs'}, {weight: 10, reps: 12, unit :'lbs'}]}
  var e1 = {name: 'dips1', category : 'Resistance', id: 'dips_id', sets: [{weight: 15, reps: 10, unit :'lbs'}, {weight: 10, reps: 12, unit :'lbs'}]}
  var e2 = {name: 'dips2', category : 'Resistance', id: 'dips_id', sets: [{weight: 15, reps: 10, unit :'lbs'}, {weight: 10, reps: 12, unit :'lbs'}]}
  var e3 = {name: 'dips3', category : 'Resistance', id: 'dips_id', sets: [{weight: 15, reps: 10, unit :'lbs'}, {weight: 10, reps: 12, unit :'lbs'}]}
  var e4 = {name: 'running', category: 'Cardio', id: 'running_id', distance: 6.4, unit: 'km', time_ms: 1234567890987654321}
  var body = { exercises: [e, e1, e2, e3, e4]}

  request({method: 'POST', url:'http://localhost:3000/api/calendar', json: true, body: body}, function(err,response,body){ 
      console.log(response.headers['content-type']);
      console.log(err)
      console.log(body)
  });
});

// request.get({url: 'http://localhost:3000/api/hello', token: login}, function(err, resp, body) {
//    console.log(err)
//    console.log(resp)
//    console.log(JSON.parse(body));
// })