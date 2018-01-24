// 腾讯云 COS 的使用
let fs = require('fs');
var crypto = require('crypto');
let COS = require('cos-nodejs-sdk-v5');

const CosConfig = {
    AppId: '1252042156',
    SecretId: 'AKIDxlU4QclKq68yYvgsSlna6ML3Yquk3o0x',
    SecretKey: 'rV9csvlNlwtc7bw76sRnz86tTs31i8JE',
    Bucket: 'wetoolbox',
    Region: 'ap-guangzhou',
};

const cos = new COS({
    AppId: CosConfig.AppId,
    SecretId: CosConfig.SecretId,
    SecretKey: CosConfig.SecretKey,
});

const tx_cos = {
    Bucket: CosConfig.Bucket,
    Region: CosConfig.Region,
}

// 图片上传 v5
function uploadFile(file) {

    return new Promise((resolve, reject) => {

        // 文件类型
        // var temp = file.originalname.split('.');
        // var fileType = temp[temp.length - 1];
        //
        // var lastName = '.' + fileType;

        // 构建图片名
        var fileName = Date.now() + file.originalname;

        // 腾讯云 文件上传
        var params = {
            Bucket: tx_cos.Bucket, /* 必须 */
            Region: tx_cos.Region, /* 必须 */
            Key: fileName, /* 必须 */
            FilePath: file.path, /* 必须 */
        }
        cos.sliceUploadFile(params, function (err, data) {
            if (err) {

                reject(err)
            } else {

                resolve(data)
            }
        });
    })

}

//签名方法 v4
function signForJsonApi(opt) {


    let once = opt.once;
    let expiresTime = parseInt(Date.now() / 1000);
    let expires = opt.Expires || opt.expires;
    if (expires === undefined) {
        expiresTime += 900; // 签名过期时间为当前 + 900s
    } else {
        expiresTime += (expires * 1) || 0;
    }

    //是否一次有效的签名
    let signature;
    if (once === undefined) {

        signature = signMore(CosConfig.Bucket, expiresTime)

    } else {

        signature = signOnce(CosConfig.Bucket, '')
    }

    console.log(signature)
    return signature
}

function signMore(bucket, expired) {
    return appSign(bucket, '', expired);
}

function signOnce(bucket, fileid) {
    return appSign(bucket, fileid, 0);
}

function appSign(bucket, fileid, expired) {

    let now = parseInt(Date.now() / 1000);
    let rdm = parseInt(Math.random() * Math.pow(2, 32));
    let secretId = CosConfig.AppId, secretKey = CosConfig.SecretKey;
    if (!secretId.length || !secretKey.length) {
        return -1;
    }
    let plainText = 'a=' + CosConfig.AppId + '&k=' + secretId + '&e=' + expired + '&t=' + now + '&r=' + rdm + '&f=' + fileid + '&b=' + bucket;

    console.log('plainText is ' + plainText)

    // plainText = 'a=200001&b=newbucket&k=AKIDUfLUEUigQiXqm7CVSspKJnuaiIKtxqAv&e=0&t=1437995645&r=1166710792&f=/200001/newbucket/tencent_test.jpg'
    // secretKey = 'bLcPnl88WU30VY57ipRhSePfPdOfSruK'

    let data = new Buffer(plainText, 'utf8');
    let res = crypto.createHmac('sha1', secretKey).update(data).digest();
    let bin = Buffer.concat([res, data]);
    let sign = bin.toString('base64');
    return sign;
}

module.exports = {
    uploadFile: uploadFile,
    signForJsonApi: signForJsonApi
};