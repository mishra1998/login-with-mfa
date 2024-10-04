const setPassword = {
  title: 'set password form',
  description: 'Defines the structure for HTTP POST request body',
  type: 'object',
  properties: {
    name: {
      type: 'string',
      description: 'name of user',
    },
    email: {
      type: 'string',
      description: 'email of user',
      format: 'email',
    },
    mobileNumber: {
      anyOf: [ {
        type: 'string',
        description: 'Mobile number for registration',
        pattern: '^[1-9]{1}[0-9]{9}',
        maxLength: 10,
      }, {
        type: 'string',
        description: 'Mobile number for registration',
        pattern: '^[1-9]{1}[0-9]{8}',
        maxLength: 9,
      } ],
    },
    password: {
      type: 'string',
      description: 'Password.',
      pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[#$^+=!*()@%&]).{8,15}$',
    },
    confirmPassword: {
      const: {
        $data: '1/password',
      },
      type: 'string',
    },
  },
  errorMessage: {
    required: {
      email: 'Email is required in the body.',
      password: 'Password is required in the body.',
      confirmPassword: 'ConfirmPassword is required in the body.',
      name: 'name is required in the body.',
    },
    properties: {
      email: 'Parameter: email should be valid.',
      password: 'Password should be valid. should be min 8 and max 15 char, alteat one small letter, one special and one capital with number.',
      confirmPassword: 'Parameter: confirmPassword should be valid.',
      name: 'Parameter: name should be valid.',
    },
  },
  required: [ 'email', 'password', 'confirmPassword', 'name' ],
  additionalProperties: false,
};

module.exports = setPassword;
