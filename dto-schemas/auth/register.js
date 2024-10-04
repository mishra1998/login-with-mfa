const registration = {
  title: 'User registration through `email` form',
  description: 'Defines the structure for HTTP POST request body',
  type: 'object',
  properties: {
    email: {
      type: 'string',
      description: 'email of user',
      format: 'email',
    },
  },
  errorMessage: {
    required: {
      email: 'Parameter: email is required in the body.',
    },
    properties: {
      email: 'Parameter: email should be valid.',
    },
  },
  required: [ 'email' ],
  additionalProperties: false,
};

module.exports = registration;
