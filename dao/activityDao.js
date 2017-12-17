/**
 * Created by chenshyiuan on 2017/11/24.
 */
const pool = require('./mysqlPool');

/**
 * @description 添加活动
 * @param object
 *  {
 *       activity_id: activity_id,
 *       open_id: open_id,
 *       type: type,
 *       title: title,
 *       description: description,
 *       images: images,
 *       position: position,
 *       time: time,
 *       date: date
 *  }
 * @returns {Promise}
 */
function insertActivity(object) {

    return new Promise(function (resolve, reject) {

        pool.getConnection(function (err, connection) {

            connection.query('INSERT INTO wb_activity SET ? ',
                object.activity, function (error, results, fields) {
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

/**
 * @description 获得活动
 * @param object
 * {
 *   activity_id: activity_id
 * }
 * @returns {Promise}
 */
function getActivity(object) {


    return new Promise(function (resolve, reject) {

        if (!object.activity_id) {
            reject('param is err!');
        }

        pool.getConnection(function (err, connection) {

            connection.query('SELECT * FROM wb_activity WHERE activity_id = ?',
                object.activity_id, function (error, results, fields) {

                    if (error) {
                        reject(error);
                    }
                    connection.release();
                    resolve(results[0]);
                }
            );

        });
    });
}

/**
 * @description 删除活动
 * @param object
 * {
 *   activity_id: activity_id
 * }
 * @returns {Promise}
 */
function deleteActivity(object) {


    return new Promise(function (resolve, reject) {

        if (!object.activity_id) {
            reject('param is err!');
        }

        pool.getConnection(function (err, connection) {

            let mysql = 'delete a.*, s.*, p.* from wb_activity as a, wb_activity_user_signup_relation as s,' +
                ' wb_activity_user_punch_relation as p' +
                ' where a.activity_id = wb_activity_user_signup_relation.activity_id' +
                ' and a.activity_id = wb_activity_user_punch_relation.activity_id and a.activity_id = ?';

            connection.query(mysql,
                object.activity_id, function (error, results, fields) {

                    if (error) {
                        reject(error);
                    }
                    connection.release();
                    resolve(results);
                }
            );

        });
    });
}

/**
 * @description 报名活动
 * @param object
 * {
 *   activity_id: activity_id,
 *   open_id: open_id,
 *   extra: extra
 * }
 * @returns {Promise}
 */
function signUpActivity(object) {

    return new Promise(function (resolve, reject) {

        if (!object.activity_id || !object.open_id) {
            reject('param is err!');
        }

        let signUpRelation = {
            activity_id: object.activity_id,
            open_id: object.open_id,
            extra: object.extra || ''
        };

        pool.getConnection(function (err, connection) {

            connection.query('INSERT INTO wb_activity_user_signup_relation SET ? ',
                signUpRelation, function (error, results, fields) {

                    if (error) {
                        reject(error);
                    }
                    connection.release();
                    resolve(results);
                }
            );

        });
    });
}

/**
 * @description 打卡活动
 * @param object
 * {
 *   activity_id: activity_id,
 *   open_id: open_id,
 *   extra: extra
 * }
 * @returns {Promise}
 */
function punchActivity(object) {

    return new Promise(function (resolve, reject) {

        if (!object.activity_id || !object.open_id) {
            reject('param is err!');
        }

        let punchRelation = {
            activity_id: object.activity_id,
            open_id: object.open_id,
            extra: object.extra || ''
        };

        pool.getConnection(function (err, connection) {

            connection.query('INSERT INTO wb_activity_user_punch_relation SET ? ',
                punchRelation, function (error, results, fields) {

                    if (error) {
                        reject(error);
                    }
                    connection.release();
                    resolve(results);
                }
            );

        });
    });
}

/**
 * @description 获得一个特定活动的报名列表
 * @param object
 */
function getActivitySignUpList(object) {

    return new Promise(function (resolve, reject) {

        if (!object.activity_id) {
            reject('param is err!');
        }

        pool.getConnection(function (err, connection) {

            connection.query('SELECT * FROM wb_activity_user_signup_relation'
                + ' INNER JOIN wb_user ON wb_activity_user_signup_relation.open_id = wb_user.open_id AND wb_activity_user_signup_relation.activity_id = ?',
                object.activity_id, function (error, results, fields) {

                    if (error) {
                        reject(error);
                    }
                    connection.release();
                    resolve(results);
                }
            );

        });
    });
}

/**
 * @description 获得一个特定活动的打卡列表
 * @param object
 */
function getActivityPunchList(object) {

    return new Promise(function (resolve, reject) {

        if (!object.activity_id) {
            reject('param is err!');
        }

        pool.getConnection(function (err, connection) {

            connection.query('SELECT * FROM wb_activity_user_punch_relation'
                + ' INNER JOIN wb_user ON wb_activity_user_punch_relation.open_id = wb_user.open_id AND wb_activity_user_punch_relation.activity_id = ?',
                object.activity_id, function (error, results, fields) {

                    if (error) {
                        reject(error);
                    }
                    connection.release();
                    resolve(results);
                }
            );

        });
    });
}


/**
 * @description 获得用户参与活动列表
 * @param { open_id } object
 * @returns {Promise}
 */
function getUserSignUpActivity(object) {

    return new Promise(function (resolve, reject) {


        let start = object.start || 0;
        let length = object.length || 10;
        if (!object.open_id) {
            reject('param is err!');
        }

        pool.getConnection(function (err, connection) {

            connection.query('SELECT * FROM wb_activity_user_signup_relation'
                + ' INNER JOIN wb_activity ON wb_activity.activity_id = wb_activity_user_signup_relation.activity_id AND wb_activity_user_signup_relation.open_id = ?' +
                ' ORDER BY wb_activity_user_signup_relation.create_time desc, wb_activity.activity_id limit ?, ?',
                [object.open_id, start, length], function (error, results, fields) {

                    if (error) {
                        reject(error);
                    }
                    connection.release();
                    resolve(results);
                }
            );

        });
    });
}

/**
 * @description 获得用户创建活动列表
 * @param object
 * {
 *   open_id: open_id
 * }
 * @returns {Promise}
 */
function getUserActivityList(object) {

    return new Promise(function (resolve, reject) {

        let start = object.start || 0;
        let length = object.length || 10;

        if (!object.open_id) {
            reject('param is err!');
        }

        pool.getConnection(function (err, connection) {

            connection.query('SELECT * FROM wb_activity WHERE open_id = ? ORDER BY create_time desc, activity_id limit ?, ?',
                [object.open_id, start, length],
                function (error, results, fields) {

                    if (error) {
                        reject(error);
                    }
                    connection.release();
                    resolve(results);
                }
            )
            ;

        });
    });
}


module.exports = {

    insertActivity: insertActivity,
    getActivity: getActivity,
    deleteActivity: deleteActivity,
    signUpActivity: signUpActivity,
    punchActivity: punchActivity,

    getUserActivityList: getUserActivityList,
    getUserSignUpActivity: getUserSignUpActivity,

    getActivitySignUpList: getActivitySignUpList,
    getActivityPunchList: getActivityPunchList
};