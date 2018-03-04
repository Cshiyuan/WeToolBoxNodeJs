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

    let object_id = req.body.object_id || ''; //要插入的activity_id;
    let post_id = 'PT' + uuidv4();  //逻辑id
    let album_id = 'AB' + object_id;  //得到默认相册的id
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
    let imagesString = JSON.stringify(images); //转化为json字符串存储


    let post = {
        post_id: post_id,
        object_id: object_id,
        open_id: open_id,
        type: type,
        title: title,
        content: content,
        images: imagesString,
        star: star || 0,
        extra: extra || '',
    };

    let promiseArray = []
    promiseArray.push(postDao.insertPost({ post: post }));
    if (photosArray.length > 0) {
        promiseArray.push(albumDao.insertPhotosToDefaultAlbum({
            object_id: object_id,
            photos: photosArray
        }));
    }

    Promise.all(promiseArray).then(result => {
        //创建返回默认
        post.images = images;
        post.isStar = false;
        post.star = 0;
        post.comment = 0;
        post.time = '刚刚'

        post.open_id = session.userInfo.openId || '';
        post.nick_name = session.userInfo.nickName || '';
        post.gender = session.userInfo.gender || 1;
        post.language = session.userInfo.language || 0;
        post.city = session.userInfo.city || '';
        post.province = session.userInfo.province || '';
        post.country = session.userInfo.country || '';
        post.avatar_url = session.userInfo.avatarUrl || '';


        res.json({ post: post, result: result });
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

    let post_id = req.body.post_id || ''; 

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
router.use('/getPostListAndAlbumList', function (req, res, next) {


    let session = req.session || {};
    let open_id = session.userInfo.openId || '';  //用户的open_id


    let start = req.body.start || 0;
    let length = req.body.length || 10;
    let object_id = req.body.object_id || '';  //帖子id


    console.log('object_id is ' + object_id);

    let returnPromiseArray = {};

    Promise.all([postDao.getPostList({
        object_id: object_id,
        start: start,
        length: length
    }), albumDao.getAlbumList({

        object_id: object_id
    })]).then(results => {

        console.log(results);
        let promiseArray = [];

        //遍历相册，设置权限
        results[1].forEach(item => {
            let isOwner = item.open_id === open_id;
            item.isOwner = isOwner;
        })
        // results['photos'] = result;

        //遍历帖子，设置权限
        results[0].forEach(item => {
            let isOwner = item.open_id === open_id;
            item.isOwner = isOwner;
            item.images = JSON.parse(item.images);
            promiseArray.push(postDao.checkStarsState({
                post_id: item.post_id,
                open_id: open_id
            }));
        })

        returnPromiseArray['postList'] = results[0];
        returnPromiseArray['albumList'] = results[1];
        return Promise.all(promiseArray);

    }).then(results => {

        returnPromiseArray['postList'].forEach((item, index) => {
            item.isStar = results[index][0]['count(1)'] > 0;
        })
        res.json(returnPromiseArray);

    }).catch(err => {

        console.log('catch err is ' + err);
        res.json(err);
    });
});


/**
 * 添加拉取
 */
router.use('/getPostList', function (req, res, next) {


    let session = req.session || {};
    let open_id = session.userInfo.openId || '';  //用户的open_id


    let start = req.body.start || 0;
    let length = req.body.length || 10;
    let object_id = req.body.object_id || '';  //帖子id


    console.log('object_id is ' + object_id);

    let returnPromiseArray = [];

    postDao.getPostList({
        object_id: object_id,
        start: start,
        length: length
    }).then(result => {

        let promiseArray = [];
        result.forEach(item => {
            item.images = JSON.parse(item.images);
            promiseArray.push(postDao.checkStarsState({
                post_id: item.post_id,
                open_id: open_id
            }));
        })
        returnPromiseArray = result;
        return Promise.all(promiseArray);

    }).then(results => {

        returnPromiseArray.forEach((item, index) => {
            item.isStar = results[index][0]['count(1)'] > 0;
        })
        res.json(returnPromiseArray);

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

        // comment
        comment.time = '刚刚'
        comment.open_id = session.userInfo.openId || '';
        comment.nick_name = session.userInfo.nickName || '';
        comment.gender = session.userInfo.gender || 1;
        comment.language = session.userInfo.language || 0;
        comment.city = session.userInfo.city || '';
        comment.province = session.userInfo.province || '';
        comment.country = session.userInfo.country || '';
        comment.avatar_url = session.userInfo.avatarUrl || '';
        res.json({ comment: comment, result: result });
    }).catch(err => {

        console.log('catch err is ' + err);
        res.json(err);
    });
});


/**
 * 点赞帖子
 */
router.use('/starPost', function (req, res, next) {


    let session = req.session || {};
    let open_id = session.userInfo.openId || '';  //用户的open_id


    let post_id = req.body.post_id || '';  //帖子id

    console.log('post_id is ' + post_id);

    postDao.starPost({

        post_id: post_id,
        open_id: open_id
    }).then(result => {

        console.log(result)
        res.json(result);
    }).catch(err => {

        console.log('catch err is ' + err);
        res.json(err);
    });
});

/**
 * 点赞帖子
 */
router.use('/unStarPost', function (req, res, next) {


    let session = req.session || {};
    let open_id = session.userInfo.openId || '';  //用户的open_id

    let post_id = req.body.post_id || '';  //帖子id

    console.log('post_id is ' + post_id);

    postDao.unStarPost({

        post_id: post_id,
        open_id: open_id
    }).then(result => {

        console.log(result)
        res.json(result);
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
    let object_id = req.body.object_id || ''; //帖子id
    console.log('comment_id is ' + comment_id);


    postDao.deleteComment({

        comment_id: comment_id,
        object_id: object_id
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
    }).then(results => {

        // let returnResult = {};
        // returnResult.comments = results[0];
        // returnResult.starState = results[1];
        res.json(results);
    }).catch(err => {

        console.log('catch err is ' + err);
        res.json(err);
    });
});


module.exports = router;