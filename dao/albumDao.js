/**
 * Created by chenshyiuan on 2018/01/28.
 */
const pool = require('./mysqlPool');

let insetAlbum = function (object) {

    return new Promise(function (resolve, reject) {

        pool.getConnection(function (err, connection) {

            connection.query('INSERT INTO wb_album SET ? ',
                object.album, function (error, results, fields) {
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

//插入图片到一个实体到默认相册, 如果默认相册没有创建，则会创建一个。
let insertPhotosToDefaultAlbum = function (object) {

    return new Promise(function (resolve, reject) {

        //此处到object_id 实际为 activity_id
        if (!object.object_id || !object.photos) {
            reject('param is err')
        }
        let mysqlResults = {};
        let album_id = 'AB' + object;
        let coverUrl = object.photos[0][4];
        console.log('album_id is ' + album_id);
        let album = {
            album_id: album_id,
            object_id: object.object_id,
            open_id: '',
            title: '动态相册',
            description: '',
            cover: coverUrl || '',
            extra: ''
        }
        pool.getConnection(function (err, connection) {

            //开启事务
            connection.beginTransaction(function (err) {
                if (err) {
                    reject(err)
                    // throw err;
                }
                connection.query('REPLACE INTO wb_album SET ? ', album, function (error, results, fields) {
                    if (error) {
                        return connection.rollback(function () {
                            reject(err)
                            // throw error;
                        });
                    }

                    // mysqlResults['album'] = results;

                    connection.query('INSERT INTO wb_photo(photo_id, album_id, open_id, name, url, extra) VALUES ? ',
                        [object.photos], function (error, results, fields) {
                            if (error) {
                                return connection.rollback(function () {
                                    // throw error;
                                    reject(err)
                                });
                            }
                            mysqlResults['photo'] = results;
                            connection.commit(function (err) {
                                if (err) {
                                    return connection.rollback(function () {
                                        // throw err;
                                        reject(err)
                                    });
                                }
                                connection.release();
                                resolve(mysqlResults)  //终于可以返回最终结果
                            });
                        });
                });
            });
        });
    });

}

let insertPhotos = function (object) {

    return new Promise(function (resolve, reject) {

        if (!object.photos) {  //参数错误
            reject('param is err')
        }


        pool.getConnection(function (err, connection) {

            let album_id = object.photos[0][1];
            let url = object.photos[0][4];
            //开启事务
            connection.beginTransaction(function (err) {
                if (err) {
                    reject(err)
                    // throw err;
                }
                connection.query('UPDATE wb_album SET cover = ? WHERE album_id = ? ', [url, album_id], function (error, results, fields) {
                    if (error) {
                        return connection.rollback(function () {
                            reject(err)
                            // throw error;
                        });
                    }

                    // mysqlResults['album'] = results;

                    connection.query('INSERT INTO wb_photo(photo_id, album_id, open_id, name, url, extra) VALUES ? ',
                        [object.photos], function (error, results, fields) {
                            if (error) {
                                return connection.rollback(function () {
                                    // throw error;
                                    reject(err)
                                });
                            }
                            // mysqlResults['photo'] = results;
                            connection.commit(function (err) {
                                if (err) {
                                    return connection.rollback(function () {
                                        // throw err;
                                        reject(err)
                                    });
                                }
                                connection.release();
                                resolve(results)  //终于可以返回最终结果
                            });
                        });
                });
            });
        });

    });
}

let insertAlbumPhotos = function (object) {

    return new Promise(function (resolve, reject) {

        if (!object.album || !object.photos) {
            reject('param is err')
        }
        let mysqlResults = {};
        pool.getConnection(function (err, connection) {

            //开启事务
            connection.beginTransaction(function (err) {
                if (err) {
                    reject(err)
                    // throw err;
                }
                connection.query('INSERT INTO wb_album SET ? ', object.album, function (error, results, fields) {
                    if (error) {
                        return connection.rollback(function () {
                            reject(err)
                            // throw error;
                        });
                    }

                    mysqlResults['album'] = results;

                    connection.query('INSERT INTO wb_photo(photo_id, album_id, open_id, name, url, extra) VALUES ? ',
                        [object.photos], function (error, results, fields) {
                            if (error) {
                                return connection.rollback(function () {
                                    // throw error;
                                    reject(err)
                                });
                            }
                            mysqlResults['photo'] = results;
                            connection.commit(function (err) {
                                if (err) {
                                    return connection.rollback(function () {
                                        // throw err;
                                        reject(err)
                                    });
                                }
                                connection.release();

                                resolve(mysqlResults)  //终于可以返回最终结果
                            });
                        });
                });
            });
        });
    });
}

let getAlbum = function (object) {

    return new Promise(function (resolve, reject) {

        if (!object.album_id) {
            reject('param is err!');
        }

        pool.getConnection(function (err, connection) {

            connection.query('SELECT * FROM wb_album WHERE album_id = ?',
                object.album_id, function (error, results, fields) {

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

let getAlbumList = function (object) {

    return new Promise(function (resolve, reject) {

        if (!object.object_id) {
            reject('param is err!');
        }

        pool.getConnection(function (err, connection) {

            connection.query('SELECT * FROM wb_album WHERE object_id = ? ORDER BY wb_album.create_time desc',
                object.object_id, function (error, results, fields) {

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

let getPhotosByAlbumId = function (object) {

    return new Promise(function (resolve, reject) {

        if (!object.album_id) {
            reject('param is err!');
        }

        pool.getConnection(function (err, connection) {

            // INNER JOIN wb_user ON wb_activity_user_punch_relation.open_id = wb_user.open_id AND wb_activity_user_punch_relation.activity_id = ?
            connection.query('SELECT * FROM wb_photo INNER JOIN wb_user ON wb_user.open_id = wb_photo.open_id WHERE wb_photo.album_id = ?',
                object.album_id, function (error, results, fields) {

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

let deleteAlbum = function (object) {

    return new Promise(function (resolve, reject) {

        if (!object.album_id) {
            reject('param is err!');
        }

        pool.getConnection(function (err, connection) {

            let mysql = 'DELETE FROM wb_album WHERE album_id = ?; ';

            connection.query(mysql,
                [object.album_id], function (error, results, fields) {

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

let deletePhotoByPhotoId = function (object) {

    return new Promise(function (resolve, reject) {

        if (!object.photo_id) {
            reject('param is err!');
        }

        pool.getConnection(function (err, connection) {

            let mysql = 'DELETE FROM wb_photo WHERE photo_id = ?; ';

            connection.query(mysql,
                [object.photo_id], function (error, results, fields) {

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

let deletePhotosByAlbumId = function (object) {

    return new Promise(function (resolve, reject) {

        if (!object.album_id) {
            reject('param is err!');
        }

        pool.getConnection(function (err, connection) {

            let mysql = 'DELETE FROM wb_photo WHERE album_id = ?; ';

            connection.query(mysql,
                [object.album_id], function (error, results, fields) {

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

    insetAlbum: insetAlbum,
    insertPhotos: insertPhotos,
    getAlbum: getAlbum,
    getAlbumList: getAlbumList,
    getPhotosByAlbumId: getPhotosByAlbumId,
    deleteAlbum: deleteAlbum,
    deletePhotosByAlbumId: deletePhotosByAlbumId,
    deletePhotoByPhotoId: deletePhotoByPhotoId,
    insertAlbumPhotos: insertAlbumPhotos,
    insertPhotosToDefaultAlbum: insertPhotosToDefaultAlbum

};