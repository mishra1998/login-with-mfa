module.exports = (sequelize, DataType) => {
  const otp = sequelize.define(
    'otp',
    {
      public_id: { type: DataType.UUID, unique: true },
      type: { type: DataType.STRING, allowNull: false },
      email: { type: DataType.STRING, allowNull: false },
      otp: { type: DataType.STRING, allowNull: false },
      validity: { type: DataType.DATE, allowNull: false },
    },
    {
      freezeTableName: true,
      underscored: true,
      timestamps: true,
    },
  );

  return otp;
};
