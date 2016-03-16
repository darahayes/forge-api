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
    debug: {
      log: [],
      request: ['received', 'auth jwt', 'handler', 'handler-error', 'response', 'response-error', 'validation-error']
    }
  },
  'hapi-connection': {
    host: process.env.HOST || '0.0.0.0',
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
    name: process.env.MONGO_NAME || 'forge',
    host: process.env.MONGO_HOST || '127.0.0.1',
    port: process.env.MONGO_PORT || 27017
  },
 jwtKey: process.env.JWT_KEY || 'password',
 production: process.env.PRODUCTION || false
};
