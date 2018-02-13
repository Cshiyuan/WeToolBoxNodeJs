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
    let cover = req.body.cover || '';  //相册封面
    let extra = req.body.extra || '';

    if (cover === '') {  //如果没有封面,设置为默认封面
        cover = '/20180213/895b61fe-85e0-4e6f-9051-90a8a5fa7797.png'
    }


    let album_id = 'AB' + uuidv4();  //逻辑id
    console.log('albumId  is ' + album_id);

    let album = {
        album_id: album_id,
        object_id: object_id,
        open_id: open_id,
        title: title,
        description: description,
        cover: cover,
        extra: extra
    }

    let photos = req.body.photos || [];
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


    let promiseArray = [];
    promiseArray.push(albumDao.insetAlbum({
        album: album,
    }));
    if (photosArray.length > 0) {
        promiseArray.push(albumDao.insertPhotos({
            photos: photosArray
        }));
    }


    Promise.all(promiseArray).then(results => {
        console.log(results)
        let returnResults = {};
        if (results[0]) {
            returnResults['album'] = album;
        }

        if (results[1]) {

            results[1].forEach(item => {
                let isOwner = item.open_id === open_id;
                item.isOwner = isOwner;
            })
            returnResults['photos'] = results[1];
        }

        res.json(returnResults)

    }).catch(err => {

        res.json(err)
    })


});


/**
 * 获得相册
 */
router.use('/getAlbumPhotos', function (req, res, next) {

    let album_id = req.body.album_id || '';
    let session = req.session || {};
    let open_id = session.userInfo.openId || '';  //用户的open_id
    let results = {};
    albumDao.getPhotosByAlbumId({

        album_id: album_id
    }).then(result => {

        result.forEach(item => {
            let isOwner = item.open_id === open_id;
            item.isOwner = isOwner;
        })
        // results['photos'] = result;
        res.json(result)

    }).catch(err => {

        console.log(err)
        res.json(err)
    })


});


/**
 * 获得相册列表
 */
router.use('/getAlbumList', function (req, res, next) {

    let activity_id = req.body.activity_id || '';
    // let results = {};
    albumDao.getAlbumList({

        object_id: activity_id
    }).then(result => {

        res.json(result);

    }).catch(err => {

        res.json(err)
    })


});


/**
 * 插入图片到特定相册
 */
router.use('/insertPhotoToAlbum', function (req, res, next) {

    let session = req.session || {};
    let open_id = session.userInfo.openId || '';  //用户的open_id

    let album_id = req.body.album_id || '';

    console.log('albumId  is ' + album_id);

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

    albumDao.insertPhotos({
        photos: photosArray
    }).then(result => {

        return albumDao.getPhotosByAlbumId({
            album_id: album_id
        })

    }).then(result => {

        result.forEach(item => {
            let isOwner = item.open_id === open_id;
            item.isOwner = isOwner;
        })
        // results['photos'] = result;
        res.json(result)

    }).catch(err => {

        res.json(err)
    })

});


/**
 * 删除特定图片
 */
router.use('/deletePhoto', function (req, res, next) {

    let session = req.session || {};
    let open_id = session.userInfo.openId || '';  //用户的open_id

    let album_id = req.body.album_id || '';

    console.log('albumId  is ' + album_id);

    let photoIds = req.body.photoIds || {};
    let promiseArray = [];
    photoIds.forEach(item => {

        promiseArray.push(albumDao.deletePhotoByPhotoId({
            photo_id: item
        }));
    })

    Promise.all(promiseArray).then(result => {

        return albumDao.getPhotosByAlbumId({
            album_id: album_id
        })
    }).then(result => {

        result.forEach(item => {
            let isOwner = item.open_id === open_id;
            item.isOwner = isOwner;
        })
        res.json(result)
    }).catch(err => {

        res.json(err)
    });

});


module.exports = router;