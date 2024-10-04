const Ajv = require('ajv').default;

const ajv = new Ajv({
  verbose: true,
  allErrors: true,
  $data: true,
  trim: true,
  useDefaults: true,
  allowUnionTypes: true,
});

require('ajv-formats')(ajv);
require('ajv-errors')(ajv, { singleError: true });
require('ajv-keywords')(ajv);

ajv.addKeyword({
  keyword: 'unique-mobile-number',
  type: 'array',
  schemaType: 'boolean',
  $data: true,
  validate: (schema, data) => {
    if (!schema) return true;
    const mobileNumberList = new Set();

    const hasDuplicate = data.some((item) => {
      if (item.mobileNumber && mobileNumberList.has(item.mobileNumber)) {
        return true;
      }
      mobileNumberList.add(item.mobileNumber);

      return false;
    });

    return !hasDuplicate;
  },
});

ajv.addKeyword({
  keyword: 'unique-document-number',
  type: 'array',
  schemaType: 'boolean',
  $data: true,
  validate: (schema, data) => {
    if (!schema) return true;
    const documentNumberList = new Set();

    const hasDuplicate = data.some((item) => {
      if (item.number && documentNumberList.has(item.number)) {
        return true;
      }
      documentNumberList.add(item.number);

      return false;
    });

    return !hasDuplicate;
  },
});

ajv.addKeyword({
  keyword: 'unique-document-type',
  type: 'array',
  schemaType: 'boolean',
  $data: true,
  validate: (schema, data) => {
    if (!schema) return true;
    const documentTypeList = new Set();

    const hasDuplicate = data.some((item) => {
      if (item.type && documentTypeList.has(item.type)) {
        return true;
      }
      documentTypeList.add(item.type);

      return false;
    });

    return !hasDuplicate;
  },
});

const isValidUuid = (uuid) => {
  /**
   * The Following RegExp Expression is used to ensure provided public-id is valid uuid
   * Please refers the following link for better understanding.
   * link:- https://www.npmjs.com/package/is-uuid
   * https://github.com/afram/is-uuid
   */
  const expression = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

  return expression.test(uuid);
};

const isSchemaValid = ({ schema, data }) => {
  const validator = ajv.compile(schema);
  const isValid = validator(data);
  const errors = [];

  if (!isValid) {
    validator.errors.forEach((error) => {
      const {
        message,
        params: { errors: paramErrors },
      } = error;

      let errorDetails;

      let errorParams;

      if (paramErrors && paramErrors.length) {
        errorParams = { ...paramErrors[0] };
      } else {
        errorParams = error;
      }
      const {
        instancePath, params: { missingProperty: name, additionalProperty }, dataPath, keyword,
      } = errorParams;

      if (name) {
        errorDetails = {
          name,
          message,
        };
      } else {
        errorDetails = {
          name: 'error',
          message,
        };
      }

      errors.push(errorDetails);
    });

    return { errors };
  }

  return { data };
};

module.exports = {
  isValidUuid,
  isSchemaValid,
};
