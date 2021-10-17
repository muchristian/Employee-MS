require('dotenv').config();
const {
  DB_USERNAME,
  DB_PASSWORD,
  DB_DEV_NAME,
  DB_TEST_NAME,
  DB_HOST
} = process.env;

module.exports = {
  development: {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_DEV_NAME,
    host: DB_HOST,
    dialect: "postgres",
  },
  test: {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_TEST_NAME,
    host: DB_HOST,
    dialect: "postgres",
  },
  production: {
    username: "postgres",
    password: "chris32",
    database: "backend_db_prod",
    host: "127.0.0.1",
    dialect: "postgres",
  },
};
