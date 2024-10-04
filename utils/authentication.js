const crypto = require('crypto');

const encryptPassword = (password, salt) => {
  const hashedPassword = crypto.pbkdf2Sync(password, Buffer.from(salt, 'base64'), 10000, 128, 'sha512').toString('base64');

  return hashedPassword;
};

const makeSalt = () => crypto.randomBytes(16).toString('base64');

module.exports = {
  encryptPassword,
  makeSalt,
};
