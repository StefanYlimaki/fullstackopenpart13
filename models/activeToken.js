const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../util/db");

class ActiveToken extends Model {}

ActiveToken.init(
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
    }
  },
  {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: "activeToken",
  }
);

module.exports = ActiveToken;
