const { DataTypes } = require("sequelize");
const sequelize = require("../utils/sequelize");

const Course = sequelize.define("course", {
  id: {
    type: DataTypes.STRING(6),
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  registrationFees: {
    type: DataTypes.NUMBER,
    allowNull: false,
  },
  stripeRFees: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  certification: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  certificateFees: {
    type: DataTypes.NUMBER,
  },
  stripeCFees: {
    type: DataTypes.NUMBER,
  },
  level: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  credit: {
    type: DataTypes.NUMBER,
    allowNull: false,
  },
  duration: {
    type: DataTypes.NUMBER,
    allowNull: false,
  },
  instructor: {
    type: DataTypes.STRING(6),
    allowNull: false,
  },
  instructorName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isApproved: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    default: true,
  },
  isReviewed: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    default: true,
  },
  publish: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    default: true,
  },
  isPaid: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    default: true,
  },
});

const Block = sequelize.define("block", {
  id: {
    type: DataTypes.STRING(11),
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  course: {
    type: DataTypes.STRING(6),
    allowNull: false,
  },
  ordering: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

const Unit = sequelize.define("unit", {
  id: {
    type: DataTypes.STRING(11),
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lecture: {
    type: DataTypes.STRING,
  },
  block: {
    type: DataTypes.STRING(11),
    allowNull: false,
  },
  text: {
    type: DataTypes.TEXT,
  },
  ordering: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

const Topic = sequelize.define("topic", {
  id: {
    type: DataTypes.STRING(11),
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  unit: {
    type: DataTypes.STRING(11),
    allowNull: false,
  },
  ordering: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = {
  Course,
  Block,
  Unit,
  Topic,
};
