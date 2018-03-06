/**
 * Created by chenshyiuan on 2018/01/28.
 */
const pool = require('./mysqlPool');

let insetUserGroupRelation = function (object) {

    return new Promise(function (resolve, reject) {

        //此处到object_id 实际为 activity_id
        if (!object.open_id && !object.openg_id) {
            reject('param is err')
        }

        let relation = {
            open_id: object.open_id || '',
            openg_id: object.openg_id || '',
            extra: object.extra || ''
        }

        pool.getConnection(function (err, connection) {

            connection.query('REPLACE INTO wb_user_group_relation SET ? ',
                relation, function (error, results, fields) {
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

let getUserListByGroup = function (object) {

    return new Promise(function (resolve, reject) {

        if (!object.open_id) {
            reject('param is err!');
        }

        pool.getConnection(function (err, connection) {

            connection.query('SELECT * FROM wb_user_group_relation WHERE open_id = ?',
                object.open_id, function (error, results, fields) {

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

let getGroupListByUser = function (object) {

    return new Promise(function (resolve, reject) {

        if (!object.openg_id) {
            reject('param is err!');
        }

        pool.getConnection(function (err, connection) {

            connection.query('SELECT * FROM wb_user_group_relation'
                + ' INNER JOIN wb_user ON wb_user_group_relation.open_id = wb_user.open_id AND wb_user_group_relation.openg_id = ?',
                object.openg_id, function (error, results, fields) {

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



let deleteUserGroupRelation = function (object) {
    return new Promise(function (resolve, reject) {

        if (!object.open_id || !object.openg_id) {
            reject('param is err!');
        }

        pool.getConnection(function (err, connection) {

            let mysql = 'DELETE FROM wb_user_group_relation WHERE open_id = ? and openg_id = ?; ';

            connection.query(mysql,
                [object.open_id, object.openg_id], function (error, results, fields) {

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


module.exports = {

    insetUserGroupRelation: insetUserGroupRelation,
    getUserListByGroup: getUserListByGroup,
    getGroupListByUser: getGroupListByUser,
    deleteUserGroupRelation: deleteUserGroupRelation,
};