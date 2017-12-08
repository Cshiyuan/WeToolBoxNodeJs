const mysql = require('mysql');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

const options = {

    host: "localhost",
    user: "root",
    password: "root",
    database: 'wetoolbox',
    checkExpirationInterval: 259200000,
    // The maximum age of a valid session; milliseconds:
    expiration: 1728000000,
    // Whether or not to create the sessions database table, if one does not already exist:
    createDatabaseTable: true
};

const connection = mysql.createConnection(options); // or mysql.createPool(options);
const sessionStore = new MySQLStore({}/* session store options */, connection);

module.exports = sessionStore;