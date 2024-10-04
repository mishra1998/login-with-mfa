/* eslint-disable filenames/match-regex */
module.exports = {
  up: (queryInterface, DataType) => queryInterface.createTable('otp', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataType.INTEGER,
    },
    public_id: { type: DataType.UUID, unique: true, allowNull: false },
    type: { type: DataType.STRING, allowNull: false },
    email: { type: DataType.STRING, allowNull: false },
    otp: { type: DataType.STRING, allowNull: false },
    validity: { type: DataType.DATE, allowNull: false },
    created_at: {
      allowNull: false,
      type: DataType.DATE,
      defaultValue: DataType.NOW,
    },
    updated_at: {
      allowNull: false,
      type: DataType.DATE,
      defaultValue: DataType.NOW,
    },
  }).then(() => queryInterface.addIndex('otp', [ 'email' ]))
    .then(() => queryInterface.addIndex('otp', [ 'type' ])),

  down: (queryInterface) => queryInterface.dropTable('otp'),
};
