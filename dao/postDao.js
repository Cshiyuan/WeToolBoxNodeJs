/**
 * Created by chenshyiuan on 2018/02/03.
 */

const pool = require('./mysqlPool');

let insertPost = function (object) {


    return new Promise(function (resolve, reject) {

        //此处到object_id 实际为 activity_id
        if (!object.post) {
            reject('param is err')
        }

        pool.getConnection(function (err, connection) {

            connection.query('INSERT INTO wb_post SET ? ',
                object.post, function (error, results, fields) {
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

let getPost = function (object) {


    return new Promise(function (resolve, reject) {

        if (!object.post_id) {
            reject('param is err!');
        }

        pool.getConnection(function (err, connection) {

            connection.query('SELECT * FROM wb_post WHERE post_id = ?',
                object.post_id, function (error, results, fields) {

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

let deletePost = function (object) {

    return new Promise(function (resolve, reject) {

        if (!object.post_id) {
            reject('param is err!');
        }

        pool.getConnection(function (err, connection) {

            connection.query('DELETE FROM wb_post WHERE post_id = ?',
                object.post_id, function (error, results, fields) {

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

let getPostList = function (object) {

    return new Promise(function (resolve, reject) {


        let start = object.start || 0;
        let length = object.length || 10;
        if (!object.object_id) {
            reject('param is err!');
        }

        pool.getConnection(function (err, connection) {

            connection.query('SELECT * FROM wb_post INNER JOIN wb_user ON wb_post.open_id = wb_user.open_id AND wb_post.object_id = ?' +
                ' ORDER BY wb_post.create_time desc, wb_post.post_id limit ?, ?',
                [object.object_id, start, length], function (error, results, fields) {

                    if (error) {
                        reject(error);
                    }
                    connection.release();
                    resolve(results);
                }
            );

        });
    });

    // ' ORDER BY wb_activity_user_signup_relation.create_time desc, wb_activity.activity_id limit ?, ?',
}

let insertComment = function (object) {

    return new Promise(function (resolve, reject) {

        //此处到object_id 实际为 activity_id
        if (!object.comment) {
            reject('param is err')
        }

        pool.getConnection(function (err, connection) {

            connection.query('INSERT INTO wb_comment SET ? ',
                object.comment, function (error, results, fields) {
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

let starPost = function (object) {

    return new Promise(function (resolve, reject) {

        //此处到object_id 实际为 activity_id
        if (!object.open_id && !object.post_id) {
            reject('param is err')
        }

        let relation = {
            post_id: object.post_id || '',
            open_id: object.open_id || '',
            extra: object.extra || ''
        }
        let post_id = object.post_id;

        pool.getConnection(function (err, connection) {

            // let mysqlResults = {}
            //开启事务
            connection.beginTransaction(function (err) {
                if (err) {
                    reject(err)
                    // throw err;
                }
                connection.query('INSERT INTO wb_post_user_star_relation SET ?  ', relation, function (error, results, fields) {
                    if (error) {
                        return connection.rollback(function () {
                            reject(err)
                            // throw error;
                        });
                    }

                    // mysqlResults['album'] = results;

                    connection.query('UPDATE wb_post SET star = star+1 WHERE post_id = ? ',
                        post_id, function (error, results, fields) {
                            if (error) {
                                return connection.rollback(function () {
                                    // throw error;
                                    reject(err)
                                });
                            }
                            // mysqlResults[0] = results;
                            connection.commit(function (err) {
                                if (err) {
                                    return connection.rollback(function () {
                                        // throw err;
                                        reject(err)
                                    });
                                }

                                resolve(results)  //终于可以返回最终结果
                            });
                        });
                });
            });
        });
    });
}

let unStarPost = function (object) {

    return new Promise(function (resolve, reject) {

        //此处到object_id 实际为 activity_id
        if (!object.open_id && !object.post_id) {
            reject('param is err')
        }


        let post_id = object.post_id;
        let open_id = object.open_id;

        pool.getConnection(function (err, connection) {

            // let mysqlResults = {}
            //开启事务
            connection.beginTransaction(function (err) {
                if (err) {
                    reject(err)
                    // throw err;
                }
                connection.query('DELETE FROM wb_post_user_star_relation WHERE post_id = ? AND open_id = ? ', [post_id, open_id], function (error, results, fields) {
                    if (error) {
                        return connection.rollback(function () {
                            reject(err)
                            // throw error;
                        });
                    }

                    // mysqlResults['album'] = results;
                    // console.log()

                    connection.query('UPDATE wb_post SET star = star-1 WHERE post_id = ? ',
                        post_id, function (error, results, fields) {
                            if (error) {
                                return connection.rollback(function () {
                                    // throw error;
                                    reject(err)
                                });
                            }
                            // mysqlResults[0] = results;
                            connection.commit(function (err) {
                                if (err) {
                                    return connection.rollback(function () {
                                        // throw err;
                                        reject(err)
                                    });
                                }

                                resolve(results)  //终于可以返回最终结果
                            });
                        });
                });
            });
        });
    });
}

let checkStarsState = function (object) {

    return new Promise(function (resolve, reject) {

        //此处到object_id 实际为 activity_id
        if (!object.open_id && !object.post_id) {
            reject('param is err')
        }


        let post_id = object.post_id;
        let open_id = object.open_id;

        pool.getConnection(function (err, connection) {

            connection.query('SELECT count(1) FROM wb_post_user_star_relation WHERE post_id = ? AND open_id = ?',
                [post_id, open_id], function (error, results, fields) {

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

let deleteComment = function (object) {

    return new Promise(function (resolve, reject) {

        //此处到object_id 实际为 activity_id
        if (!object.comment_id) {
            reject('param is err')
        }

        pool.getConnection(function (err, connection) {

            connection.query('DELETE FROM  wb_comment WHERE comment_id =  ? ',
                object.comment_id, function (error, results, fields) {
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


let getCommentList = function (object) {

    return new Promise(function (resolve, reject) {


        let start = object.start || 0;
        let length = object.length || 10;
        if (!object.object_id) {
            reject('param is err!');
        }

        pool.getConnection(function (err, connection) {

            connection.query('SELECT * FROM wb_comment INNER JOIN wb_user ON wb_comment.open_id = wb_user.open_id AND wb_comment.object_id = ?' +
                ' ORDER BY wb_comment.create_time desc, wb_comment.comment_id limit ?, ?',
                [object.object_id, start, length], function (error, results, fields) {

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

    insertPost: insertPost,
    getPost: getPost,
    getPostList: getPostList,
    insertComment: insertComment,
    getCommentList: getCommentList,
    deleteComment: deleteComment,

    deletePost: deletePost,

    starPost: starPost,
    unStarPost: unStarPost,
    checkStarsState: checkStarsState

};