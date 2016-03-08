const trueVals = ['true', 'TRUE', '1', 'YES', 'yes', 'y', 'Y'];

module.exports = {
  'hapi-server': {
    connections: {
      routes: { 
        cors: {
          additionalExposedHeaders: ['Authorization', 'authorization'],
          credentials: true
        } 
      }
    },
    debug: (includes(trueVals, process.env.API_DEBUG)) ? 
    {
      log: [],
      request: ['received', 'auth jwt', 'handler', 'handler-error', 'response', 'response-error', 'validation-error']
    } : false 
  },
  'hapi-connection': {
    host: process.env.API_HOST || '0.0.0.0',
    port: process.env.API_PORT || 4000
  },
  clients: [
    {
      type: 'web',
      host: process.env.CALENDAR_HOST || '127.0.0.1',
      port: 9001,
      pin: 'role:calendar,cmd:*'
    },
    {
      type: 'web',
      host: process.env.EXERCISES_HOST || '127.0.0.1',
      port: 9002,
      pin: 'role:exercises,cmd:*'
    },
    {
      type: 'web',
      host: process.env.USERS_HOST || '127.0.0.1',
      port: 9003,
      pin: 'role:user,cmd:*'
    }
  ],
  'mongo': {
    name: process.env.MONGO_NAME || 'progress',
    host: process.env.MONGO_HOST || '127.0.0.1',
    port: process.env.MONGO_PORT || 27017,
    username: process.env.MONGO_USERNAME,
    password: process.env.MONGO_PASSWORD
  },
 jwtKey: process.env.JWT_KEY || 'password',
 production: includes(trueVals, process.env.PRODUCTION) || false
};

function includes(array, item) {
  return (array.indexOf(item) > -1)
}