// const mysql = require('mysql');
const session = require('express-session');
const pool = require('./mysqlPool');
const MySQLStore = require('express-mysql-session')(session);

// const options = {
//
//     host: "localhost",
//     user: "root",
//     password: "root",
//     database: 'wetoolbox',
//     checkExpirationInterval: 259200000,
//     expiration: 1728000000,
//     createDatabaseTable: true
// };

const connection = pool; // or mysql.createPool(options);
const sessionStore = new MySQLStore({}/* session store options */, connection);

module.exports = sessionStore;