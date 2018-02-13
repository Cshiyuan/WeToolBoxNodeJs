/**
 * Created by chenshyiuan on 2017/11/22.
 */
const mysql = require('mysql');

const pool = mysql.createPool({
    port: 3306,
    host: "localhost",
    user: "root",
    password: " Csy19951226!",
    database: 'wetoolbox',
    // multipleStatements: true  有可能被注入的风险
});

module.exports = pool;