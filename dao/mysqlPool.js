/**
 * Created by chenshyiuan on 2017/11/22.
 */
const mysql = require('mysql');

const pool = mysql.createPool({
    port: 3306,
    host: "localhost",
    user: "root",
    password: "root",
    database: 'wetoolbox'
});

module.exports = pool;