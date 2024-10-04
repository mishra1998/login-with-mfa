/* eslint-disable filenames/match-regex */
const { USER_STATUS } = require('../utils/constant');

module.exports = {
  up: (queryInterface, DataTypes) => queryInterface.createTable('user', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    public_id: { type: DataTypes.UUID, unique: true, allowNull: false },
    user_name: { type: DataTypes.STRING, unique: true },
    user_type: { type: DataTypes.STRING, allowNull: false },
    mobile_number: { type: DataTypes.STRING, allowNull: false },
    is_mobile_verified: { type: DataTypes.BOOLEAN, defaultValue: false },
    email: { type: DataTypes.STRING, unique: true },
    is_email_verified: { type: DataTypes.BOOLEAN, defaultValue: false },
    hashed_password: { type: DataTypes.STRING },
    system_generated_password: { type: DataTypes.BOOLEAN, defaultValue: true },
    salt: { type: DataTypes.STRING },
    // need to add role_id once role is created
    status: { type: DataTypes.STRING, defaultValue: USER_STATUS.ACTIVE },
    password_validity: { type: DataTypes.DATE },
    name: { type: DataTypes.STRING },
    profile_pic_url: { type: DataTypes.STRING },
    last_login_at: { type: DataTypes.DATE },
    concurrency_stamp: { type: DataTypes.UUID, unique: true, allowNull: false },
    is_mfa_enabled: { type: DataTypes.BOOLEAN, defaultValue: false },
    mfa_secret: { type: DataTypes.STRING },
    created_by: { type: DataTypes.UUID },
    updated_by: { type: DataTypes.UUID },
    created_at: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }),

  down: (queryInterface) => queryInterface.dropTable('user'),
};
