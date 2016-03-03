module.exports = {
	mongo: {
	 	name: process.env.MONGO_NAME || 'progress',
	 	host: process.env.MONGO_HOST || '127.0.0.1',
	 	port: process.env.MONGO_PORT || 27017
 },
	hapi: {
		connection: {
			host: process.env.HOST || '0.0.0.0',
			port: process.env.API_PORT || 4000
		},
		server: {
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
		}
	},
 jwtKey: process.env.JWT_KEY || 'password'
};