const express = require('express');
const router = express.Router();
const albumDao = require('../dao/albumDao')


/**
 * 添加相册
 */
router.use('/insertAlbum', function (req, res, next) {


    let session = req.session || {};
    let open_id = session.userInfo.openId || '';  //用户的open_id

    let object_id = req.body.object_id;
    let title = req.body.title || '';  //活动标题
    let description = req.body.description || '';  //活动描述
    let extra = req.body.extra || '';


    let album_id = 'AB' + open_id + type.toString() + (new Date()).valueOf();  //逻辑id
    console.log('albumId  is ' + album_id);

    let album = {
        album_id: album_id,
        object_id: object_id,
        open_id: open_id,
        title: title,
        description: description,
        extra: extra
    }

    let photos = req.body.photos;


    albumDao.insertAlbumPhotos({
        album: album,
        photos: photos
    }).then(result => {
        // console.log(result)
        res.json(result);
    }).catch(err => {

        res.json(err)
    })
});


/**
 * 获得相册
 */
router.use('/getAlbum', function (req, res, next) {

    let album_id = req.body.album_id || '';
    let result = {};
    albumDao.getAlbum({

        album_id: album_id
    }).then(result => {

        result['album'] = result;
        return albumDao.getPhotosByAlbumId({
            album_id:album_id
        })

    }).then(result => {

        result['photo'] = result;
        res.json(result)

    }).catch(err => {

        res.json(err)
    })


});


module.exports = router;