const emailVerification = {
  title: 'email verification form',
  description: 'Defines the structure for HTTP POST request body',
  type: 'object',
  properties: {
    email: {
      type: 'string',
      description: 'email of user',
      format: 'email',
    },
    otp: {
      type: 'string',
      description: 'OTP, one time password sent on user email.',
      pattern: '^[0-9]{6}',
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
