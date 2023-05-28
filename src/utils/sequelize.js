const Sequelize = require("sequelize");
require("dotenv").config();

const host = process.env.DB_HOST;
const port = process.env.DB_PORT;
const dbNmae = process.env.DB_NAME;
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;

const path = `mysql://${user}:${password}@${host}:${port}/${dbNmae}`;

const sequelize = new Sequelize(path, {
  operatorAliases: false,
  logging: false,
});

module.exports = sequelize;
