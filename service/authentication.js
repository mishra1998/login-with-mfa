const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const ms = require('ms');

const encryptPassword = (password, salt) => {
  const hashedPassword = crypto.pbkdf2Sync(password, Buffer.from(salt, 'base64'), 10000, 128, 'sha512').toString('base64');

  return hashedPassword;
};

const makeSalt = () => crypto.randomBytes(16).toString('base64');

const verifyPassword = (hashedPassword = '', password = '', salt = '') => encryptPassword(password, salt) === hashedPassword;

const generateToken = (userId, userEmail) => {
  const payload = { userId, userEmail };

  const accessToken = jwt.sign(payload, 'agileSecretKey', {
    expiresIn: '15m',
    audience: 'CUSTOMER',
    issuer: 'AGILE WORLD TECHNOLOGIES',
  });

  const refreshToken = jwt.sign(payload, 'agileSecretKey', {
    expiresIn: '7d',
    audience: 'CUSTOMER',
    issuer: 'AGILE WORLD TECHNOLOGIES',
  });

  return { accessToken, refreshToken };
};

const signToken = async (signedPayload) => {
  const expiresIn = '1h';

  const token = jwt.sign(signedPayload, 'agileSecretKey', {
    expiresIn,
  });

  const refreshToken = jwt.sign(signedPayload, 'agileSecretKey', {
    expiresIn: '7d',
  });

  return {
    token,
    refreshToken,
    expiresIn: moment().add(ms(expiresIn), 'milliseconds').toISOString(),
  };
};

module.exports = {
  encryptPassword,
  makeSalt,
  generateToken,
  verifyPassword,
  signToken,
};
