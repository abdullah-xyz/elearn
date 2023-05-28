const { DataTypes } = require("sequelize");
const sequelize = require("../utils/sequelize");

const Order = sequelize.define("order", {
  id: {
    type: DataTypes.STRING(11),
    primaryKey: true,
    allowNull: false,
  },
  course: {
    type: DataTypes.STRING(6),
    allowNull: false,
  },
  student: {
    type: DataTypes.STRING(6),
    allowNull: false,
  },
  certificate: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
});

module.exports = {
  Order,
};
