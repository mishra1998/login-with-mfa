const login = {
  description: 'Defines the structure for HTTP POST request body',
  type: 'object',
  properties: {
    email: {
      type: 'string',
      description: 'email of user',
      format: 'email',
    },
    password: {
      type: 'string',
      description: 'password',
      maxLength: 50,
    },
    totp: {
      type: 'string',
      description: 'totp',
      maxLength: 6,
    },
  },
  required: [ 'email', 'password' ],
  additionalProperties: false,
};

module.exports = login;
