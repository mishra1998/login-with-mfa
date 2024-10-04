const { register, verification, setPassword } = require('../controllers/auth');

module.exports = (router) => {
  router.post('/register', register);
  router.post('/verification', verification);
  router.post('/set-password', setPassword);
};

