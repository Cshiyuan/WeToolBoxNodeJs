const express = require('express');
const router = express.Router();

const albumDao = require('../dao/albumDao');

/* GET home page. */
router.get('/', function (req, res, next) {


    let album = {
        album_id: 'sdf',
        object_id: 'asdasdwe',
        open_id: ' asdwferg',
        title: 'sdfgerg',
        description: 'sdfeberg',
        extra: 'fegrboijrtg'
    }

    let photo = {
        photo_id: 'sdfwefwrf',
        album_id: 'sdfervegv',
        open_id: 'wefevberb',
        name: 'efevgerv',
        url: 'wefwef',
        extra: 'ergergergef'
    }

    let photoArray = [];
    for (var i in photo) {

        // console.log(i, ":", photo[i]);
        photoArray.push(photo[i])
    }


    // let photoArray =

    albumDao.insetAlbum({
        album: album
    });
    console.log(photoArray)

    albumDao.insertPhotos({
        photos: [photoArray, photoArray, photoArray]
    })

    albumDao.getPhotosByAlbumId({
        album_id: 'sdfervegv'
    }).then(result => {
        console.log(result)
    })

    res.render('index', {title: 'Express'});

});


module.exports = router;
