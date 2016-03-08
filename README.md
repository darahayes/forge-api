# progress-api
The API for the [progress-app](https://github.com/darragh-hayes/progress-app). An API written with [Hapi](https://github.com/hapijs/hapi) which hooks into a number of [Seneca](https://github.com/senecajs/seneca) microsservices. The API can also be configured to run as a monolith by loading the microservices as plugins.

## Services
- [progress-exercises](https://github.com/darragh-hayes/progress-exercises)
- [progress-calendar](https://github.com/darragh-hayes/progress-calendar)
- [progress-users](https://github.com/darragh-hayes/progress-users)

## Install in development mode

The api requires:

- Node.js (version 4+)
- MongoDB

## Install Node
Follow instructions [here.](https://nodejs.org/en/download/package-manager/)

## Install MongoDB

#### Ubuntu 14.04
Import MongoDB public key:

```bash
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927
```

Add the repo to sources.list:

```bash
echo "deb http://repo.mongodb.org/apt/ubuntu trusty/mongodb-org/3.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.2.list
```

Update and install:

```bash
sudo apt-get update
sudo apt-get install -y mongodb-org
```

#### OSX
Using Homebrew:

```bash
brew update
brew install mongodb
```

## Install the API

Clone:

```bash
git clone https://github.com/darragh-hayes/progress-app.git
```

Install:

```bash
npm install
```

## Configuration
The app config exists in `config.js.` Most of the config options come from environment variables. Sane defaults are in place for local development.

The relevant environment variables are:

- `API_HOST` - API hostname/ip
	- `Default:` `0.0.0.0`
- `API_PORT` - API port number
	- `Default:` `4000`
- `PROGRESS_DEBUG` - Enables debug logging on the server
	- true | false
	- `Default:` `false`
- `CALENDAR_HOST` - Hostname/ip of calendar microservice
	- `Default:` `127.0.0.1`
- `EXERCISES_HOST` - Hostname/ip of exercises microservice
	- `Default:` `127.0.0.1`
- `USERS_HOST` - Hostname/ip of users microservice
	- `Default:` `127.0.0.1`
- `MONGO_NAME` - Name of Database
	- `Default:` `progress`
- `MONGO_HOST` - Hostname/ip of MongoDB server
	- `Default:` `127.0.0.1`
- `MONGO_PORT` - MongoDB server port
	- `Default:` `27017`
- `MONGO_USERNAME` - Mongo username if access control is configured (recommended for production)
	- `Default` : `null`
- `MONGO_PASSWORD`
	- `Default` : `null`
- `JWT_KEY` - Secret key for encrypting and signing JSON web tokens.
	- `Default`: `password`
- `PRODUCTION` - Determines whether the app runs as a monolith or not.
	- `TRUE:` The API runs by itself and will attempt to connect to external microservices. The other services must be installed and run
	- `FALSE:` The API loads the microservices as plugins and runs in a single process.
	- `Default:` `FALSE`
