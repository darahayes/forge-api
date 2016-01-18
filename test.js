var request = require('request');
request = request.defaults({jar: true});
var login = {};

request.post({url: 'http://localhost:3000/auth/login', form: {email: 'dara@example.com', password: 'password'}}, function(err,response,body) {
    console.log(err);
    console.log(response.headers['content-type']);
    // console.log(response)
    login = JSON.parse(body).login;
    console.log(response.state);
    console.log(login);
    request.get({url: 'http://localhost:3000/api/hello', token: login}, function(err, resp, body) {
    console.log(err);
    // console.log(resp)
    console.log(JSON.parse(body));
  });
});

// request.get({url: 'http://localhost:3000/api/hello', token: login}, function(err, resp, body) {
//    console.log(err)
//    console.log(resp)
//    console.log(JSON.parse(body));
// })