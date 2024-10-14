const setPassword = {
  title: 'Set password form',
  description: 'Defines the structure for HTTP POST request body',
  type: 'object',
  properties: {
    name: {
      type: 'string',
      description: 'Name of user',
    },
    email: {
      type: 'string',
      description: 'Email of user',
      format: 'email',
      pattern: '^[\\w.%+-]+@[\\w.-]+\\.[a-zA-Z]{2,}$',
    },
    mobileNumber: {
      anyOf: [
        {
          type: 'string',
          description: 'Mobile number for registration (10 digits)',
          pattern: '^[1-9]{1}[0-9]{9}$',
          maxLength: 10,
        },
        {
          type: 'string',
          description: 'Mobile number for registration (9 digits)',
          pattern: '^[1-9]{1}[0-9]{8}$',
          maxLength: 9,
        },
      ],
    },
    password: {
      type: 'string',
      description: 'Password',
      pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[#$^+=!*()@%&]).{8,15}$',
    },
    confirmPassword: {
      const: {
        $data: '1/password',
      },
      type: 'string',
      description: 'Confirm password (must match password)',
    },
  },
  errorMessage: {
    required: {
      email: 'Email is required in the body.',
      password: 'Password is required in the body.',
      confirmPassword: 'ConfirmPassword is required in the body.',
      name: 'Name is required in the body.',
    },
    properties: {
      email: 'Parameter: email should be valid.',
      password: 'Password should be valid. Must be 8 to 15 characters long with at least one lowercase, one uppercase, one special character, and one number.',
      confirmPassword: 'Parameter: confirmPassword should match the password.',
      name: 'Parameter: name should be valid.',
    },
  },
  required: [ 'email', 'password', 'confirmPassword', 'name' ],
  additionalProperties: false,
};

module.exports = setPassword;
