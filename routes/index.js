const express = require('express');
const router = express.Router();
const activityDao = require('../dao/activityDao');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});

    let activity = {
        activity_id: 'ads',
        open_id: 'asdasd',
        type: 1,
        title: 'asdasd',
        description: 'adasd',
        images: 'asdasd',
        position: 'asdasd',
        time: 'sadasd',
        date: 'asdasd'
    };

    activityDao.insertActivity({activity: activity}).then(value => {

    });
});


module.exports = router;
