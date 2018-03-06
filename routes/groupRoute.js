
const express = require('express');
const router = express.Router();
const WXBizDataCrypt = require('../wafer-node-session/lib/WXBizDataCrypt');
const groupDao = require('../dao/groupDao');

let appId = 'wx4097cfe13dfa3a6c';

/**
 * 解密接口
 */
router.use('/decryptData', function (req, res, next) {

    let encryptedData = req.body.encryptedData || '';
    let iv = req.body.iv || '';
    let sessionKey = req.session.sessionKey || '';
    // let session = req.session || {};
    

    console.log('decryptData session is ', req.session);
    console.log('decryptData body is ', req.body);

    var pc = new WXBizDataCrypt(appId, sessionKey)

    var data = pc.decryptData(encryptedData, iv)

    // console.log('解密后 data: ', data)

    let openg_id = data.openGId || '';
    let open_id = session.userInfo.openId || '';  //用户的open_id
    groupDao.insetUserGroupRelation({   //添加用户和群的关系
        openg_id: openg_id,
        open_id: open_id
    })

    res.json(data);

});


/**
 * 获取用户的群列表
 */
router.use('/getGroupListByUser', function (req, res, next) {


    // let openg_id = data.openGId || '';
    let open_id = session.userInfo.openId || '';  //用户的open_id

    groupDao.getGroupListByUser({   //添加用户和群的关系
        open_id: open_id
    }).then(result => {

        res.json(data);
    }).catch(err => {

        res.json(err);
    })
});

/**
 * 获取群的用户列表
 */
router.use('/getUserListByGroup', function (req, res, next) {


    // let openg_id = data.openGId || '';
    let open_id = session.userInfo.openId || '';  //用户的open_id
    let openg_id = req.body.openg_id || '';

    groupDao.getUserListByGroup({   //添加用户和群的关系
        openg_id: openg_id
    }).then(result => {

        res.json(data);
    }).catch(err => {

        res.json(err);
    })
});


/**
 * 获取群的用户列表
 */
router.use('/deleteUserGroupRelation', function (req, res, next) {


    // let openg_id = data.openGId || '';
    let open_id = session.userInfo.openId || '';  //用户的open_id
    let openg_id = req.body.openg_id || '';

    groupDao.deleteUserGroupRelation({   //添加用户和群的关系
        openg_id: openg_id,
        open_id: open_id

    }).then(result => {

        res.json(data);
    }).catch(err => {

        res.json(err);
    })
});





module.exports = router;