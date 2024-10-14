const emailVerification = {
  title: 'Email verification form',
  description: 'Defines the structure for HTTP POST request body',
  type: 'object',
  properties: {
    email: {
      type: 'string',
      description: 'Email of user',
      format: 'email',
      pattern: '^[\\w.%+-]+@[\\w.-]+\\.[a-zA-Z]{2,}$',
    },
    otp: {
      type: 'string',
      description: 'OTP (One-Time Password) sent to the users email.',
      pattern: '^[0-9]{6}$',
      maxLength: 6,
    },
  },
  errorMessage: {
    required: {
      email: 'Parameter: email is required in the body.',
      otp: 'Parameter: otp is required in the body.',
    },
    properties: {
      email: 'Parameter: email should be valid.',
      otp: 'Parameter: otp should be valid.',
    },
  },
  required: [ 'email', 'otp' ],
  additionalProperties: false,
};

module.exports = emailVerification;
