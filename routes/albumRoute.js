const express = require('express');
const uuidv4 = require('uuid/v4');
const router = express.Router();
const albumDao = require('../dao/albumDao')


/**
 * 添加相册
 */
router.use('/insertAlbum', function (req, res, next) {


    let session = req.session || {};
    let open_id = session.userInfo.openId || '';  //用户的open_id

    let object_id = req.body.object_id || '';
    let title = req.body.title || '';  //活动标题
    let description = req.body.description || '';  //活动描述
    let extra = req.body.extra || '';


    let album_id = 'AB' + uuidv4();  //逻辑id
    console.log('albumId  is ' + album_id);

    let album = {
        album_id: album_id,
        object_id: object_id,
        open_id: open_id,
        title: title,
        description: description,
        extra: extra
    }

    let photos = req.body.photos || {};
    let photosArray = [];
    if (photos) {
        photos.forEach(item => {
            let photo_id = 'PH' + uuidv4();  //逻辑id
            console.log('photo_id  is ' + photo_id);
            let photo = [photo_id, album_id, open_id, item.name || '', item.url || '', item.extra || ''];
            photosArray.push(photo)
            // let photo = {
            //     photo_id: photo_id,
            //     album_id: album_id,
            //     open_id: open_id,
            //     name: item.name || '',
            //     url: item.url || '',
            //     extra: item.extra || ''
            // }
        })
    }

    let results = {};
    albumDao.insertAlbumPhotos({
        album: album,
        photos: photosArray
    }).then(result => {
        // console.log(result)
        // res.json(result);
        return albumDao.getAlbum({
            album_id: album_id
        })

    }).then(result => {

        results['album'] = result;
        return albumDao.getPhotosByAlbumId({
            album_id: album_id
        })

    }).then(result => {

        results['photo'] = result;
        res.json(results)

    }).catch(err => {

        res.json(err)
    })
});


/**
 * 获得相册
 */
router.use('/getAlbum', function (req, res, next) {

    let album_id = req.body.album_id || '';
    let results = {};
    albumDao.getAlbum({

        album_id: album_id
    }).then(result => {

        results['album'] = result;
        return albumDao.getPhotosByAlbumId({
            album_id: album_id
        })

    }).then(result => {

        results['photo'] = result;
        res.json(results)

    }).catch(err => {

        res.json(err)
    })


});


module.exports = router;