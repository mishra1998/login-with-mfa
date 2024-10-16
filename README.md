# login-with-mfa
 
This project is the API for login-with-mfa. The project is designed to be used with Node.js and MySQL, with Sequelize as the ORM for database management.
 
## Getting Started
 
These instructions will help you set up the project on your local machine for development and testing purposes.
 
### Prerequisites
 
Ensure you have the following installed on your machine:
 
- Node.js (v16.x.x)
- MySQL (v8.x)
 
### Environment variable used in application.
 
The following environment variables are used in the application:
 
| Variable             | Description                                           | Example                                             |
| -------------------  | ----------------------------------------------------- | --------------------------------------------------- |
| SERVER_PORT          | Set this variable to run your app on this port        | 3002                                                |
| DB_CONNECTION_STRING | This variable is used to connect to the database      | mysql://username:password@host:port/database_name   |
| DB_NAME_DEV          | Development database name                             | dev_db                                              |
| DB_USER_NAME_DEV     | Development database username                         | root                                                |
| DB_PASSWORD_DEV      | Development database password                         | password                                            |
| DB_HOST_DEV          | Development database host                             | localhost                                           |
| DB_PORT_DEV          | Development database port                             | 3306                                                |
| DB_NAME_TEST         | Test database name                                    | test_db                                             |
| DB_USER_NAME_TEST    | Test database username                                | root                                                |
| DB_PASSWORD_TEST     | Test database password                                | password                                            |
| DB_HOST_TEST         | Test database host                                    | localhost                                           |
| DB_PORT_TEST         | Test database port                                    | 3306                                                |
| DB_NAME_PROD         | Production database name                              | prod_db                                             |
| DB_USER_NAME_PROD    | Production database username                          | root                                                |
| DB_PASSWORD_PROD     | Production database password                          | password                                            |
| DB_HOST_PROD         | Production database host                              | localhost                                           |
| DB_PORT_PROD         | Production database port                              | 3306                                                |
 
### Installing
 
A step by step series that will tell you how to get a development env running
 
Navigate to the project directory:
 
$ cd path/to/project
 
Install all dependencies:
 
```
$ npm ci
```
 
Database Setup
Ensure MySQL is running on your local machine. You can configure the connection details in the .env file or in your environment variables.
 
Database Creation
Use Sequelize to create the database:
 
 
$ node_modules/.bin/sequelize db:create --url 'mysql://username:password@host:port/database_name'
 
| Keyword       | Example     | Description            |
| ------------- | ----------- | ---------------------- |
| dialect       | mysql       | Database type          |
| username      | root        | Username for the database |
| password      | password    | Password for the database |
| host          | localhost   | Database host          |
| port          | 3306        | Database port          |
| database_name | dev_db      | Name of the database   |
 
 
Database Management
You can create new database migrations using Sequelize:
 
$ node_modules/.bin/sequelize migration:create --name migration_name
 
Running Migrations
To run database migrations:
 
$ node_modules/.bin/sequelize db:migrate --url 'mysql://username:password@host:port/database_name'
 
 
or you are creating the migration manually then use this
npx sequelize-cli db:migrate
 
To undo the last migration:
$ node_modules/.bin/sequelize db:migrate:undo
 
 
Running the Application
Development Mode
 
To start the server in development mode:
$ npm run start:dev
 
 
The app will be running at http://localhost:3002.
 
To run the test cases:
$ npm run test
