/* eslint-disable filenames/match-regex */
const { USER_STATUS } = require('../utils/constant');

module.exports = {
  up: (queryInterface, DataTypes) => queryInterface.createTable('user', {
    // Primary key, auto-incrementing user ID
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    // Public UUID that identifies the user externally
    public_id: { type: DataTypes.UUID, unique: true, allowNull: false },

    // Username, must be unique for each user
    user_name: { type: DataTypes.STRING, unique: true },

    // Type of user (e.g., admin, customer); cannot be null
    user_type: { type: DataTypes.STRING, allowNull: false },

    // User's mobile phone number, cannot be null
    mobile_number: { type: DataTypes.STRING, allowNull: false },

    // Boolean to indicate if the mobile number is verified; default is false
    is_mobile_verified: { type: DataTypes.BOOLEAN, defaultValue: false },

    // User's email address, must be unique
    email: { type: DataTypes.STRING, unique: true },

    // Boolean to indicate if the email is verified; default is false
    is_email_verified: { type: DataTypes.BOOLEAN, defaultValue: false },

    // Hashed version of the user's password for security
    hashed_password: { type: DataTypes.STRING },

    // Boolean to track if the password was system-generated; default is true
    system_generated_password: { type: DataTypes.BOOLEAN, defaultValue: true },

    // Salt used to hash the user's password for additional security
    salt: { type: DataTypes.STRING },

    // need to add role_id once role is created
    // User's status (e.g., active, inactive), using a constant; default is 'ACTIVE'
    status: { type: DataTypes.STRING, defaultValue: USER_STATUS.ACTIVE },

    // Date when the password will expire or becomes invalid
    password_validity: { type: DataTypes.DATE },

    // User's full name
    name: { type: DataTypes.STRING },

    // URL for the user's profile picture
    profile_pic_url: { type: DataTypes.STRING },

    // Timestamp of the last time the user logged in
    last_login_at: { type: DataTypes.DATE },

    // A unique UUID used for concurrency control to prevent update conflicts
    concurrency_stamp: { type: DataTypes.UUID, unique: true, allowNull: false },

    // Boolean to indicate if multi-factor authentication (MFA) is enabled; default is false
    is_mfa_enabled: { type: DataTypes.BOOLEAN, defaultValue: false },

    // Secret key used for multi-factor authentication
    mfa_secret: { type: DataTypes.STRING },

    // UUID of the user who created this record
    created_by: { type: DataTypes.UUID },

    // UUID of the user who last updated this record
    updated_by: { type: DataTypes.UUID },

    // Timestamp for when the user was created, defaults to current time
    created_at: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },

    // Timestamp for the last update, defaults to current time
    updated_at: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }),

  // Function to drop the table in case of rollback
  down: (queryInterface) => queryInterface.dropTable('user'),
};
