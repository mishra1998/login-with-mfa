const express = require('express');
const { Sequelize } = require('sequelize');
const config = require('./config');
const defaultRoutes = require('./routes/index');
const { CUSTOMER_IGNORE_PATH, AUDIENCE_TYPE, ISSUER } = require('./utils/constant');
const Authentication = require('./utils/middlewares/auth');

const app = express();
const port = process.env.PORT || 3002;

app.use(express.json());

const environment = process.env.NODE_ENV || 'test';
const dbConfig = config.DATABASE[environment];
const sequelize = new Sequelize(dbConfig.name, dbConfig.username, dbConfig.password, {
  host: dbConfig.options.host,
  dialect: dbConfig.options.dialect,
  port: dbConfig.options.port,
  pool: dbConfig.options.pool,
  dialectOptions: dbConfig.options.dialectOptions,
  logging: dbConfig.options.logging,
});

sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

app.use('/api', Authentication({
  AUDIENCE: AUDIENCE_TYPE.CUSTOMER,
  ignorePaths: CUSTOMER_IGNORE_PATH,
  ISSUER,
}), defaultRoutes);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
