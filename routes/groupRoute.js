
const express = require('express');
const router = express.Router();
const WXBizDataCrypt = require('../wafer-node-session/lib/WXBizDataCrypt');

let appId = 'wx4097cfe13dfa3a6c';

/**
 * 解密接口
 */
router.use('/decryptData', function (req, res, next) {

    let encryptedData = req.body.encryptedData || '';
    let iv = req.body.iv || '';
    let sessionKey = req.session.sessionKey || '';

    var pc = new WXBizDataCrypt(appId, sessionKey)

    var data = pc.decryptData(encryptedData, iv)

    // console.log('解密后 data: ', data)
    res.json(data);


});




module.exports = router;