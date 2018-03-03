var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
const activityRoute = require('./routes/activityRoute');
const albumRoute = require('./routes/albumRoute');
const postRoute = require('./routes/postRoute');
const groupRoute = require('./routes/groupRoute');



var app = express();


const session = require('./wafer-node-session');
const sessionStore = require('./dao/sessionStore');


app.use(session({

    // 小程序 appId
    appId: 'wx4097cfe13dfa3a6c',
    // 小程序 appSecret
    appSecret: 'd195ea01fa7d3b5892c5aea58565d808',
    // 登录地址
    loginPath: '/login',
    // 会话存储
    store: sessionStore
}));

// //一个中间件，检查请求里的Session
// function getUserInfoBySession(req, res, next) {
//
//     next();
//     let session = req.session;
//     if (session) {
//         const getUserBySession = (session => {
//                     return {
//                         open_id: session.userInfo.openId || '',
//                         nick_name: session.userInfo.nickName || '',
//                         gender: session.userInfo.gender || 1,
//                         language: session.userInfo.language || 0,
//                         city: session.userInfo.city || '',
//                         province: session.userInfo.province || '',
//                         country: session.userInfo.country || '',
//                         avatar_url: session.userInfo.avatarUrl || ''
//                     }
//                 }
//             )
//         ;
//         userDao.insertUser({
//             user: getUserBySession(session)
//         }).then(result => {
//             }
//         );
//     }
// }
//
// app.use(getUserInfoBySession);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/activity', activityRoute);
app.use('/album', albumRoute);
app.use('/post', postRoute);
app.use('/group', groupRoute);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
