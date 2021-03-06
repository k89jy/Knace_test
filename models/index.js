"use strict";
switch (process.env.NODE_ENV) {
  case "development":
    require("dotenv").config({ path: __dirname + "/../env.development" });
    break;
  case "test":
    require("dotenv").config({ path: __dirname + "/../env.test" });
    break;
  case "production":
    require("dotenv").config({ path: __dirname + "/../env.production" });
    break;
}
console.log(`process.env.NODE_ENV ${process.env.NODE_ENV}`);

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const env = process.env.NODE_ENVß || "development";
const jsconfig = require(__dirname + "/../config/config.js");

const configJson = JSON.parse(JSON.stringify(jsconfig));

const config = configJson[env];
const db = {};

let sequelize;

if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
