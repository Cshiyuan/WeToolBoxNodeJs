const express = require('express');
const router = express.Router();
const cos = require('../utils/cos')

let multer = require('multer')
let upload = multer({dest: '../tmp/'})

/* GET home page. */
router.get('/', function (req, res, next) {


    res.render('index', {title: 'Express'});

});


/* GET home page. */
router.use('/upload', upload.single('file'), function (req, res, next) {


    console.log(req)
    cos.uploadFile(req.file).then(data => {
        console.log(data)
        console.log('https://'+ data.Location)
    })
    res.json('asd')
});


module.exports = router;
