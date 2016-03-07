var server = require('./server/server');


server.on('pluginsLoaded', () => {
  server.start(() => {
    console.log('Server running at:', server.info.uri);
  });
})