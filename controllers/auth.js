const authService = require('../service/auth');
const Validator = require('../utils/validator');
const {
  register: registerSchema, verification: verificationSchema, setPassword: setPasswordSchema, login: loginSchema,
} = require('../dto-schemas/auth');

const register = async (req, res) => {
  try {
    const { body } = req;

    const data = { ...body };

    const { errors } = Validator.isSchemaValid({ data, schema: registerSchema });

    if (errors) {
      return res.status(400).json({ status: 'error', message: 'Field validation failed', errors });
    }

    const { errors: err, doc } = await authService.register(data);

    if (doc) {
      return res.status(201).json(doc);
    }

    return res.status(400).json({ status: 'error', message: 'Field validation failed', errors: err });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

const verification = async (req, res) => {
  try {
    const { body } = req;

    const data = { ...body };

    const { errors } = Validator.isSchemaValid({ data, schema: verificationSchema });

    if (errors) {
      return res.status(400).json({ status: 'error', message: 'Field validation failed', errors });
    }

    const { errors: err, doc } = await authService.verification(data);

    if (doc) {
      return res.status(201).json(doc);
    }

    return res.status(400).json({ status: 'error', message: 'Field validation failed', errors: err });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

const setPassword = async (req, res) => {
  try {
    const { body } = req;

    const data = { ...body };

    const { errors } = Validator.isSchemaValid({ data, schema: setPasswordSchema });

    if (errors) {
      return res.status(400).json({ status: 'error', message: 'Field validation failed', errors });
    }

    const { errors: err, doc } = await authService.setPassword(data);

    if (doc) {
      res.setHeader('message', 'Password set successfully!');

      return res.status(201).json(doc);
    }

    return res.status(400).json({ status: 'error', message: 'Field validation failed', errors: err });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

const createMFA = async (req, res) => {
  try {
    const { auth: { userId: updatedBy, userId } } = req;

    const data = { updatedBy, userId };

    const { doc, error } = await authService.createMFA(data);

    if (doc) {
      const { qr, secret } = doc;

      res.setHeader('qr', qr);
      res.setHeader('secret', secret);

      return res.status(201).json(doc);
    }

    return res.status(400).json({ status: 'error', message: 'Field validation failed', error });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

const verifyMFA = async (req, res) => {
  try {
    const {
      auth: { userId: updatedBy, userId },
      body: { otp, secret },
    } = req;

    const data = {
      updatedBy, otp, secret, userId,
    };

    const { doc, error } = await authService.verifyMFA(data);

    if (doc) {
      const { isVerified } = doc;

      res.setHeader('is-verified', isVerified);

      return res.status(201).json(doc);
    }

    return res.status(400).json({ status: 'error', message: 'Field validation failed', error });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

const login = async (req, res) => {
  try {
    const { body } = req;

    const data = { ...body };

    const { errors } = Validator.isSchemaValid({ data, schema: loginSchema });

    if (errors) {
      return res.status(400).json({ status: 'error', message: 'Field validation failed', errors });
    }

    const { errors: err, doc } = await authService.login(data);

    if (doc) {
      const { token, expiresIn, refreshToken } = doc;

      res.setHeader('token', token);
      res.setHeader('expires-in', expiresIn);
      res.setHeader('refresh-token', refreshToken);
      res.setHeader('message', 'You have been successfully logged-in.');

      return res.status(201).json(doc);
    }

    return res.status(400).json({ status: 'error', message: 'Field validation failed', errors: err });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

module.exports = {
  register, verification, setPassword, login, createMFA, verifyMFA,
};
