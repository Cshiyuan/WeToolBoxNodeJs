/**
 * Created by chenshyiuan on 2017/12/5.
 */
const pool = require('./mysqlPool');

/**
 * @description 添加活动
 * @param object
 *  {
 *       open_id: open_id,
 *       nick_name: nick_name,
 *       gender: gender,
 *       language: language,
 *       city: city,
 *       province: province,
 *       country: country,
 *       avatar_url: avatar_url
 *  }
 * @returns {Promise}
 */
function insertUser(object) {

    return new Promise(function (resolve, reject) {

        pool.getConnection(function (err, connection) {

            connection.query('REPLACE INTO wb_user SET ? ',
                object.user, function (error, results, fields) {
                    if (error) {
                        reject(error)
                    }
                    connection.release();
                    resolve(results);
                }
            );

        });
    });
}



module.exports = {

    insertUser: insertUser,
};