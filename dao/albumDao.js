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

let insertPhotos = function (object) {

    return new Promise(function (resolve, reject) {

        if (!object.photos) {  //参数错误
            reject('param is err')
        }

        pool.getConnection(function (err, connection) {

            connection.query('INSERT INTO wb_photo(photo_id, album_id, open_id, name, url, extra) VALUES ? ',
                [object.photos], function (error, results, fields) {
                    if (error) {
                        console.log(error)
                        reject(error)
                    }
                    connection.release();
                    resolve(results);
                }
            );

        });
    });
}

let getAlbum = function(object) {

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

let getPhotosByAlbumId = function(object) {

    return new Promise(function (resolve, reject) {

        if (!object.album_id) {
            reject('param is err!');
        }

        pool.getConnection(function (err, connection) {

            connection.query('SELECT * FROM wb_photo WHERE album_id = ?',
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

let deleteAlbum = function(object) {

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

let deletePhotoByPhotoId = function(object) {

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

let deletePhotosByAlbumId = function(object) {

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
    getPhotosByAlbumId: getPhotosByAlbumId,
    deleteAlbum: deleteAlbum,
    deletePhotosByAlbumId:deletePhotosByAlbumId,
    deletePhotoByPhotoId: deletePhotoByPhotoId()

};