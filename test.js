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
  request({method: 'POST', url:'http://localhost:3000/api/exercises', json: true, body: {"name": "my_pushup", "category": "Resistance", "tags": ["Chest", "Arms"]}}, function(err,response,body){ 
      console.log(response.headers['content-type']);
      console.log(err)
      console.log(body)
  });
  request({method: 'GET', url:'http://localhost:3000/api/exercises'}, function(err,resp,body) {
    console.log('body', body);
  })
  // request({method: 'GET', url:'http://localhost:3000/api/exercises', qs: {userExercises: true}}, function(err,resp,body) {
  //   console.log('body', body);
  // })
  // request({method: 'DELETE', url:'http://localhost:3000/api/exercises'}, function(err,resp,body) {
  //   console.log(err, body);
  // })
});

// request.get({url: 'http://localhost:3000/api/hello', token: login}, function(err, resp, body) {
//    console.log(err)
//    console.log(resp)
//    console.log(JSON.parse(body));
// })