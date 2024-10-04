const authService = require('../service/auth');
const Validator = require('../utils/validator');
const { register: registerSchema, verification: verificationSchema, setPassword: setPasswordSchema } = require('../dto-schemas/auth');

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

module.exports = { register, verification, setPassword };
