const { version, name } = require('../package.json');

module.exports = {
  VERSION: process.env.VERSION || version,
  NAME: process.env.NAME || name,
  DOMAIN: process.env.DOMAIN || 'http://localhost:3000',
  HOST: process.env.HOST || '0.0.0.0',
  PORT: process.env.PORT || 3000,
  DATABASE: {
    development: {
      name: process.env.DB_NAME_DEV || 'test',
      username: process.env.DB_USER_NAME_DEV || 'root',
      password: process.env.DB_PASSWORD_DEV || '',
      options: {
        host: process.env.DB_HOST_DEV || '127.0.0.1',
        port: process.env.DB_PORT_DEV || 3307,
        dialect: 'mysql',
        freezeTableName: true,
        define: {
          timestamps: false,
          charset: 'utf8',
          collate: 'utf8_general_ci',
        },
        pool: {
          max: 5,
          min: 0,
          acquire: 30 * 1000,
          idle: 10000,
        },
        dialectOptions: {
          decimalNumbers: true,
          charset: 'utf8mb4',
        },
        logging: false,
        schema: 'public',
      },
    },
    test: {
      name: process.env.DB_NAME_TEST || 'test',
      username: process.env.DB_USER_NAME_TEST || 'root',
      password: process.env.DB_PASSWORD_TEST || '',
      options: {
        host: process.env.DB_HOST_TEST || '127.0.0.1',
        port: process.env.DB_PORT_TEST || 3307,
        dialect: 'mysql',
        freezeTableName: true,
        define: {
          timestamps: false,
          charset: 'utf8',
          collate: 'utf8_general_ci',
        },
        pool: {
          max: 5,
          min: 0,
          acquire: 30 * 1000,
          idle: 10000,
        },
        dialectOptions: {
          decimalNumbers: true,
          charset: 'utf8mb4',
        },
        logging: false,
        schema: 'public',
      },
    },
    production: {
      name: process.env.DB_NAME_PROD || 'test',
      username: process.env.DB_USER_NAME_PROD || 'root',
      password: process.env.DB_PASSWORD_PROD || '',
      options: {
        host: process.env.DB_HOST_PROD || '127.0.0.1',
        port: process.env.DB_PORT_PROD || 3307,
        dialect: 'mysql',
        freezeTableName: true,
        define: {
          timestamps: false,
          charset: 'utf8',
          collate: 'utf8_general_ci',
        },
        pool: {
          max: 5,
          min: 0,
          acquire: 30 * 1000,
          idle: 10000,
        },
        dialectOptions: {
          decimalNumbers: true,
          charset: 'utf8mb4',
        },
        logging: false,
        schema: 'public',
      },
    },
  },
};
