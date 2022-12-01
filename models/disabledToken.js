const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../util/db");

class DisabledToken extends Model {}

DisabledToken.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: "disabledToken",
  }
);

module.exports = DisabledToken;
