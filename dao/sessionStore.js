const mysql = require('mysql');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

const options = {

    host: "localhost",
    user: "root",
    password: "root",
    database: 'wetoolbox'
};

const connection = mysql.createConnection(options); // or mysql.createPool(options);
const sessionStore = new MySQLStore({}/* session store options */, connection);

module.exports = sessionStore;