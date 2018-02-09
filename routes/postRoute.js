/**
 * Created by chenshyiuan on 2018/02/02.
 */
const express = require('express');
const uuidv4 = require('uuid/v4');
const router = express.Router();
const postDao = require('../dao/postDao');
const albumDao = require('../dao/albumDao');


/**
 * 添加帖子
 */
router.use('/insertPost', function (req, res, next) {


    let session = req.session || {};
    let open_id = session.userInfo.openId || '';  //用户的open_id

    let activity_id = req.body.activity_id || ''; //要插入的activity_id;
    let post_id = 'PT' + uuidv4();  //逻辑id
    let album_id = 'AB' + activity_id.split('AC')[1];  //得到默认相册的id
    console.log('post_id is ' + post_id);

    let type = req.body.type || 0;  //帖子类型
    let title = req.body.title || '';  //帖子标题
    let content = req.body.content || '';  //帖子描述
    let star = req.body.star || 0; // 帖子位置
    let extra = req.body.extra || ''; // 帖子额外动作

    let photos = req.body.photos || {};   //帖子图片


    let photosArray = [];
    let images = [];

    if (photos && photos.length > 0) {
        photos.forEach(item => {
            let photo_id = 'PH' + uuidv4();  //逻辑id
            console.log('photo_id  is ' + photo_id);
            let photo = [photo_id, album_id, open_id, item.name || '', item.url || '', item.extra || ''];
            photosArray.push(photo)
            images.push(item.url);
        })
    }
    images = JSON.stringify(images); //转化为json字符串存储


    let post = {
        post_id: post_id,
        object_id: activity_id,
        open_id: open_id,
        type: type,
        title: title,
        content: content,
        images: images,
        star: star || 0,
        extra: extra || '',
    };

    let promiseArray = []
    promiseArray.push(postDao.insertPost({post: post}));
    if (photosArray.length > 0) {
        promiseArray.push(albumDao.insertPhotosToDefaultAlbum({
            object_id: activity_id,
            photos: photosArray
        }));
    }

    Promise.all(promiseArray).then(result => {

        res.json({post: post, result: result});
    }).catch(err => {

        console.log('catch err is ' + err);
        res.json(err);
    });
});

/**
 * 删除帖子
 */
router.use('/deletePost', function (req, res, next) {


    let session = req.session || {};
    let open_id = session.userInfo.openId || '';  //用户的open_id

    let post_id = req.body.post_id || ''; //要插入的activity_id;

    postDao.deletePost({
        post_id: post_id
    }).then(result => {

        res.json(result)
        console.log(result)
    }).catch(error => {

        res.json(error)
        console.log(error)
    })
});

/**
 * 添加拉取
 */
router.use('/getPostList', function (req, res, next) {


    let session = req.session || {};
    let open_id = session.userInfo.openId || '';  //用户的open_id


    let start = req.body.start || 0;
    let length = req.body.length || 10;
    let activity_id = req.body.activity_id || '';  //帖子id


    console.log('activity_id is ' + activity_id);


    postDao.getPostList({
        object_id: activity_id,
        start: start,
        length: length
    }).then(result => {

        result.forEach(item => {
            // item.
            // console.log(item.images);
            item.images = JSON.parse(item.images)
        })
        res.json(result);
    }).catch(err => {

        console.log('catch err is ' + err);
        res.json(err);
    });
});

/**
 * 添加评论
 */
router.use('/insertComment', function (req, res, next) {


    let session = req.session || {};
    let open_id = session.userInfo.openId || '';  //用户的open_id


    let post_id = req.body.post_id || '';  //帖子id
    let comment_id = 'CD' + uuidv4();  //逻辑id
    let type = req.body.type || 0;
    let content = req.body.content || '';
    let images = req.body.images || '';
    let star = req.body.star || 0;
    let extra = req.body.extra || '';


    console.log('comment_id is ' + comment_id);

    let comment = {
        comment_id: comment_id,
        object_id: post_id,
        open_id: open_id,
        type: type,
        content: content,
        images: images,
        star: star,
        extra: extra
    }


    postDao.insertComment({

        comment: comment
    }).then(result => {

        res.json({commemt: comment, result: result});
    }).catch(err => {

        console.log('catch err is ' + err);
        res.json(err);
    });
});


// starPost: starPost,
//     unStarPost: unStarPost,
//     checkStarsState: checkStarsState
/**
 * 添加评论
 */
router.use('/insertComment', function (req, res, next) {


    let session = req.session || {};
    let open_id = session.userInfo.openId || '';  //用户的open_id


    let post_id = req.body.post_id || '';  //帖子id
    let comment_id = 'CD' + uuidv4();  //逻辑id
    let type = req.body.type || 0;
    let content = req.body.content || '';
    let images = req.body.images || '';
    let star = req.body.star || 0;
    let extra = req.body.extra || '';


    console.log('comment_id is ' + comment_id);

    let comment = {
        comment_id: comment_id,
        object_id: post_id,
        open_id: open_id,
        type: type,
        content: content,
        images: images,
        star: star,
        extra: extra
    }


    postDao.insertComment({

        comment: comment
    }).then(result => {

        res.json({commemt: comment, result: result});
    }).catch(err => {

        console.log('catch err is ' + err);
        res.json(err);
    });
});



/**
 * 删除评论
 */
router.use('/deleteComment', function (req, res, next) {


    let session = req.session || {};
    let open_id = session.userInfo.openId || '';  //用户的open_id


    let comment_id = req.body.comment_id || '';  //评论id
    console.log('comment_id is ' + comment_id);


    postDao.deleteComment({

        comment_id: comment_id
    }).then(result => {

        res.json(result);
    }).catch(err => {

        console.log('catch err is ' + err);
        res.json(err);
    });
});

/**
 * 拉取评论
 */
router.use('/getCommentList', function (req, res, next) {


    let session = req.session || {};
    let open_id = session.userInfo.openId || '';  //用户的open_id


    let post_id = req.body.post_id || '';  //帖子id
    let start = req.body.start || 0;
    let length = req.body.length || 10;


    postDao.getCommentList({
        object_id: post_id,
        start: start,
        length: length
    }).then(result => {

        res.json(result);
    }).catch(err => {

        console.log('catch err is ' + err);
        res.json(err);
    });
});


module.exports = router;