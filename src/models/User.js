const { DataTypes } = require("sequelize");
const sequelize = require("../utils/sequelize");

const User = sequelize.define("user", {
  id: {
    type: DataTypes.STRING(6),
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM,
    values: ["student", "teacher", "admin"],
    allowNull: false,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    default: true,
  },
});

const StudentProfile = sequelize.define("studentProfile", {
  id: {
    type: DataTypes.STRING(6),
    primaryKey: true,
    allowNull: false,
    references: {
      Model: User,
      key: "id",
    },
  },
  dob: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  fatherName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  class: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  house: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  street: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pincode: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  state: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  institute: {
    type: DataTypes.STRING,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

const TeacherProfile = sequelize.define("teacherProfile", {
  id: {
    type: DataTypes.STRING(6),
    primaryKey: true,
    allowNull: false,
    references: {
      Model: User,
      key: "id",
    },
  },
  qualification: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  designation: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  institute: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  department: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  profile: {
    type: DataTypes.TEXT,
  },
  coursesAllowed: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  pincode: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  state: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.INTEGER,
  },
});

const TeacherCreationRequest = sequelize.define("teacherCreationRequest", {
  id: {
    type: DataTypes.STRING(6),
    primaryKey: true,
    allowNull: false,
  },
  qualification: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  designation: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  institute: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  department: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pincode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  state: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  profile: {
    type: DataTypes.TEXT,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  isReviewed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  isAccepted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

const AdminProfile = sequelize.define("adminProfile", {
  id: {
    type: DataTypes.STRING(6),
    primaryKey: true,
    allowNull: false,
    references: {
      Model: User,
      key: "id",
    },
  },
  employeeId: {
    type: DataTypes.STRING,
  },
});

const Contact = sequelize.define("contact", {
  id: {
    type: DataTypes.STRING(11),
    primaryKey: true,
    allowNull: false,
  },
  user: {
    type: DataTypes.STRING(6),
    primaryKey: true,
    allowNull: false,
  },
  label: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
  },
  contact: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
  },
});

module.exports = {
  User,
  StudentProfile,
  TeacherProfile,
  AdminProfile,
  TeacherCreationRequest,
  Contact,
};
