module.exports = {
	mongo: {
	 	name: 'progress',
	 	host: '127.0.0.1',
	 	port: 27017
 },
	hapi: {
		connection: {
			port: 4000
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
 jwtKey: 'password'
};