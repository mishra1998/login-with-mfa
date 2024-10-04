const express = require('express');
const { Sequelize } = require('sequelize');
const config = require('./config/config.json');
const defaultRoutes = require('./routes/index');

const app = express();
const port = 3000;

app.use(express.json());

const environment = process.env.NODE_ENV || 'development';
const dbConfig = config[environment];
const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  dialect: dbConfig.dialect,
});

sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

app.use('/api', defaultRoutes);
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
