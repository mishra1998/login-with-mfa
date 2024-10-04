const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const encryptPassword = (password, salt) => {
  const hashedPassword = crypto.pbkdf2Sync(password, Buffer.from(salt, 'base64'), 10000, 128, 'sha512').toString('base64');

  return hashedPassword;
};

const makeSalt = () => crypto.randomBytes(16).toString('base64');

const generateToken = (userId, userEmail) => {
  const payload = { userId, userEmail };

  const accessToken = jwt.sign(payload, 'asuhidsb8usdhSIIUASDIASUI', {
    expiresIn: '15m',
  });

  const refreshToken = jwt.sign(payload, 'ADNBCJHSABCUCJBAJSHCB', {
    expiresIn: '7d',
  });

  return { accessToken, refreshToken };
};

module.exports = {
  encryptPassword,
  makeSalt,
  generateToken,
};
