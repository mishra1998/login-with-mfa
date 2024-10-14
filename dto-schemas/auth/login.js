const login = {
  description: 'Defines the structure for HTTP POST request body',
  type: 'object',
  properties: {
    email: {
      type: 'string',
      description: 'Email of user',
      format: 'email',
      pattern: '^[\\w.%+-]+@[\\w.-]+\\.[a-zA-Z]{2,}$',
    },
    password: {
      type: 'string',
      description: 'Password',
      maxLength: 50,
      pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[#$^+=!*()@%&]).{8,15}$',
    },
    totp: {
      type: 'string',
      description: 'TOTP (Time-based One-Time Password)',
      maxLength: 6,
      pattern: '^[0-9]{6}$',
    },
  },
  required: [ 'email', 'password' ],
  additionalProperties: false,
};

module.exports = login;
