/**
 * Created by chenshyiuan on 2017/11/24.
 */
const express = require('express');
const router = express.Router();
const activityDao = require('../dao/activityDao');


/**
 * 添加活动
 */
router.use('/insertActivity', function (req, res, next) {


    let session = req.session || {};
    let open_id = session.userInfo.openId || '';  //用户的open_id


    let type = req.body.type || 0;  //活动类型
    let title = req.body.title || '';  //活动标题
    let description = req.body.description || '';  //活动描述
    let images = req.body.images || '';   //活动图片
    let position = req.body.position || ''; //活动位置
    let time = req.body.time || '';  //活动时间
    let date = req.body.date || '';  //活动日期

    let activity_id = 'AC' + open_id + type.toString() + (new Date()).valueOf();  //逻辑id
    console.log('activityId is ' + activity_id);

    activity = {
        activity_id: activity_id,
        open_id: open_id,
        type: type,
        title: title,
        description: description,
        images: images,
        position: position,
        time: time,
        date: date
    };

    activityDao.insertActivity({activity: activity}).then(result => {

        res.json({activity: activity, result: result});
    }).catch(err => {

        console.log('catch err is ' + err);
        res.json(err);
    });
});

/**
 * 获得活动
 */
router.use('/getActivity', function (req, res, next) {

    let activity_id = req.body.activity_id || '';
    let session = req.session || {};
    let open_id = session.userInfo.openId || '';  //用户的open_id

    activityDao.getActivity({activity_id: activity_id}).then(result => {

        let getActivityPunchListPromise = activityDao.getActivityPunchList({
            activity_id: result.activity_id,
        });
        let getActivitySignUpListPromise = activityDao.getActivitySignUpList(({
            activity_id: result.activity_id
        }));
        return Promise.all([getActivityPunchListPromise, getActivitySignUpListPromise, Promise.resolve(result)]);

    }).then(results => {

        let punchList = results[0];
        let signUpList = results[1];
        let result = results[2];

        let activity = result;
        activity.punchList = punchList;
        activity.signUpList = signUpList;

        let isSignUp = false;
        let isPunch = false;

        punchList.forEach((item) => {
            if (item.open_id === open_id) {
                isPunch = true;
            }
        });

        signUpList.forEach((item) => {
            if (item.open_id === open_id) {
                isSignUp = true;
            }
        });

        activity.isSignUp = isSignUp;
        activity.isPunch = isPunch;
        let isOwner = activity.open_id === open_id;  //判断是否是创建者

        res.json({activity: activity, result: result, isOwner: isOwner});

    }).catch(err => {

        console.log('catch err is ' + err);
        res.json(err);
    });
});


/**
 * 改变活动
 */
router.use('/changeActivityType', function (req, res, next) {

    let type = req.body.type || 0;
    let activity_id = req.body.activity_id || '';

    activityDao.changeActivityType({
        type: type,
        activity_id: activity_id
    }).then(result => {


        res.json({result: result});

    }).catch(err => {

        console.log('catch err is ' + err);
        res.json(err);
    });
});


/**
 * 获得一个用户的活动
 */
router.use('/getUserActivityList', function (req, res, next) {

    let session = req.session || {};
    let open_id = session.userInfo.openId || '';  //用户的open_id
    let start = req.body.start || 0;
    let length = req.body.length || 10;

    activityDao.getUserActivityList({
        open_id: open_id,
        start: start,
        length: length
    }).then(result => {

        console.log(result);
        res.json(result);

    }).catch(err => {

        console.log('catch err is ' + err);
        res.json(err);
    });
});


/**
 * 获得一个用户的活动
 */
router.use('/getUserSignUpActivity', function (req, res, next) {

    let session = req.session || {};
    let open_id = session.userInfo.openId || '';  //用户的open_id

    let start = req.body.start || 0;
    let length = req.body.length || 10;

    activityDao.getUserSignUpActivity({
        open_id: open_id,
        start: start,
        length: length
    }).then(result => {

        console.log(result);

        let promiseList = [];

        result.forEach(item => {
            let getActivitySignUpListPromise = activityDao.getActivitySignUpList(({
                activity_id: item.activity_id
            })).then(result => {
                item.signUpList = result;
                return item
            })
            promiseList.push(getActivitySignUpListPromise);
        })

        return Promise.all(promiseList);

    }).then(results => {


        res.json(results)

    }).catch(err => {

        console.log('catch err is ' + err);
        res.json(err);
    });
});

/**
 * 删除活动
 */
router.use('/deleteActivity', function (req, res, next) {

    let activity_id = req.body.activity_id || '';
    let deleteActivityPromise = activityDao.deleteActivity({activity_id: activity_id});
    let deleteActivitySignUpRelationPromise = activityDao.deleteSignUpRelation(({activity_id: activity_id}));
    let deleteActivityPunchRelationPromise = activityDao.deletePunchRelation(({activity_id: activity_id}));

    Promise.all([deleteActivityPromise, deleteActivitySignUpRelationPromise, deleteActivityPunchRelationPromise]).then(result => {

        console.log(result);
        res.json({ret: 1, result: result});

    }).catch(err => {

        console.log('catch err is ' + err);
        res.json(err);
    });
});

/**
 * 报名活动
 */
router.use('/signUpActivity', function (req, res, next) {

    let session = req.session || {};
    let open_id = session.userInfo.openId || '';  //用户的open_id

    let activity_id = req.body.activity_id || '';
    let extra = req.body.extra || '';

    activityDao.signUpActivity({
        activity_id: activity_id,
        open_id: open_id,
        extra: extra
    }).then(result => {

        console.log(result);
        return activityDao.getActivitySignUpList({
            activity_id: activity_id
        });

    }).then(result => {

        res.json(result);
    }).catch(err => {

        console.log('catch err is ' + err);
        res.json(err);
    });
});

/**
 * 打卡活动
 */
router.use('/punchActivity', function (req, res, next) {

    let session = req.session || {};
    let open_id = session.userInfo.openId || '';  //用户的open_id

    let activity_id = req.body.activity_id || '';
    let extra = req.body.extra || '';

    activityDao.getActivity({activity_id: activity_id}).then(result => {

        let type = result.type;
        if (type === 1) {  //说明创建者禁止了打卡

            res.json({ret: -1, message: '创建者禁止了打卡', data:{}});
            return Promise.resolve();
        } else {

            return activityDao.punchActivity({
                activity_id: activity_id,
                open_id: open_id,
                extra: extra
            }).then(result => {

                console.log(result);
                return activityDao.getActivityPunchList({
                    activity_id: activity_id
                });
            }).then(result => {

                res.json({ret: 0, message: 'success', data: result});
            });
        }

    }).catch(err => {

        console.log('catch err is ' + err);
        res.json(err);
    });


});


/**
 * 获得活动打卡列表
 */
router.use('/getActivityPunchList', function (req, res, next) {

    let activity_id = req.body.activity_id || '';

    activityDao.getActivityPunchList({
        activity_id: activity_id,
    }).then(result => {

        console.log(result);
        res.json(result);

    }).catch(err => {

        console.log('catch err is ' + err);
        res.json(err);
    });
});

/**
 * 获得活动报名列表
 */
router.use('/getActivitySignUpList', function (req, res, next) {

    let activity_id = req.body.activity_id || '';

    activityDao.getActivitySignUpList({
        activity_id: activity_id,
    }).then(result => {

        console.log(result);

    }).catch(err => {

        console.log('catch err is ' + err);
        res.json(err);
    });
});


module.exports = router;
