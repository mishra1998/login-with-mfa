const { USER_STATUS } = require('../utils/constant');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'user',
    {
      public_id: {
        type: DataTypes.UUID,
        unique: true,
        allowNull: false,
      },
      user_name: { type: DataTypes.STRING, unique: true },
      user_type: { type: DataTypes.STRING, allowNull: false },
      mobile_number: { type: DataTypes.STRING },
      is_mobile_verified: { type: DataTypes.BOOLEAN, defaultValue: false },
      email: { type: DataTypes.STRING, unique: true, allowNull: false },
      is_email_verified: { type: DataTypes.BOOLEAN, defaultValue: false },
      hashed_password: { type: DataTypes.STRING },
      system_generated_password: { type: DataTypes.BOOLEAN, defaultValue: true },
      salt: { type: DataTypes.STRING },
      status: { type: DataTypes.STRING, defaultValue: USER_STATUS.ACTIVE },
      password_validity: { type: DataTypes.DATE },
      name: { type: DataTypes.STRING },
      profile_pic_url: { type: DataTypes.STRING },
      last_login_at: { type: DataTypes.DATE },
      concurrency_stamp: { type: DataTypes.UUID, unique: true, allowNull: false },
      created_by: { type: DataTypes.UUID },
      updated_by: { type: DataTypes.UUID },
    },
    {
      freezeTableName: true,
      underscored: true,
      timestamps: true,
    },
  );

  return User;
};
