const express = require('express');
const { Sequelize } = require('sequelize');
const config = require('./config/config.json');
const defaultRoutes = require('./routes/index');
const { CUSTOMER_IGNORE_PATH, AUDIENCE_TYPE, ISSUER } = require('./utils/constant');
const Authentication = require('./utils/middlewares/auth');

const app = express();
const port = 3002;

app.use(express.json());

const environment = process.env.NODE_ENV || 'development';
const dbConfig = config[environment];
const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  dialect: dbConfig.dialect,
  port: dbConfig.port,
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

// app.use('/api', defaultRoutes);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

