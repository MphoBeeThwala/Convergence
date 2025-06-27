require('dotenv').config();
const { Sequelize } = require('sequelize');
const path = require('path');

console.log('DB_USERNAME:', process.env.DB_USERNAME);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_DATABASE:', process.env.DB_DATABASE);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.resolve(__dirname, '..' , '..' , 'database.sqlite'), // Path to the SQLite database file
  logging: false, // Set to true to see SQL queries
});

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: 'sqlite',
    storage: path.resolve(__dirname, '..' , '..' , 'database.sqlite'), // Path to the SQLite database file
  },
  test: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE_TEST,
    host: process.env.DB_HOST,
    dialect: 'sqlite',
    storage: path.resolve(__dirname, '..' , '..' , 'database.sqlite'), // Path to the SQLite database file
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};

module.exports.sequelize = sequelize;