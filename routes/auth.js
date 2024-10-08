const {
  register, verification, setPassword, login, createMFA, verifyMFA,
} = require('../controllers/auth');

module.exports = (router) => {
  router.post('/register', register);
  router.post('/verification', verification);
  router.post('/set-password', setPassword);
  router.post('/login', login);
  router.get('/mfa/create', createMFA);
  router.post('/mfa/verify', verifyMFA);
};

