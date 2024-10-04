/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */

const express = require('express');

const router = express.Router();

const fs = require('fs');
const path = require('path');

const basename = path.basename(__filename);

(() => {
  fs.readdirSync(__dirname)
    .filter((file) => file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js')
    .forEach((file) => {
      const res = require(path.join(__dirname, file));

      res(router);
    });
})();

module.exports = router;
