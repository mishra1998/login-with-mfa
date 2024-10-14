/* eslint-disable filenames/match-regex */
module.exports = {
  up: (queryInterface, DataType) => queryInterface.createTable('otp', {
    // Primary key, auto-incrementing ID for OTP record
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataType.INTEGER,
    },

    // Public UUID used to uniquely identify OTP externally
    public_id: { type: DataType.UUID, unique: true, allowNull: false },

    // The type of OTP (e.g., email, SMS); cannot be null
    type: { type: DataType.STRING, allowNull: false },

    // Email address to which the OTP is associated
    email: { type: DataType.STRING, allowNull: false },

    // The actual OTP value sent to the user
    otp: { type: DataType.STRING, allowNull: false },

    // Expiration date/time for the OTP
    validity: { type: DataType.DATE, allowNull: false },

    // Timestamp for when the OTP record was created, defaults to the current time
    created_at: {
      allowNull: false,
      type: DataType.DATE,
      defaultValue: DataType.NOW,
    },

    // Timestamp for when the OTP record was last updated, defaults to the current time
    updated_at: {
      allowNull: false,
      type: DataType.DATE,
      defaultValue: DataType.NOW,
    },
  })
  // Adding an index to the 'email' column for faster lookups
    .then(() => queryInterface.addIndex('otp', [ 'email' ]))

  // Adding an index to the 'type' column for faster querying by OTP type
    .then(() => queryInterface.addIndex('otp', [ 'type' ])),

  // Function to drop the table in case of rollback
  down: (queryInterface) => queryInterface.dropTable('otp'),
};
