var express=require('express');
var app=express();
var socketio= require('socket.io')
var http=require('http').createServer(app);
var io=socketio(http);
var bodyParser=require('body-parser');
var loginController=require('./controller/loginController')
var contactController =require('./controller/contactController');
var convesationController=require('./controller/conversationController');
var userController=require('./controller/userController');
var session=require('express-session');
var route=require('./routes/route');
var cookieParser=require('cookie-parser');
var initSocket =require('./socket/index');
//Setup for server

app.use(express.static(__dirname+'/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.set('view engine', 'ejs')
app.use(session({
    key: 'sid',
    secret: 'somerandonstuffs',
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: 7*24*60*60*1000
    }
}))

//Login and register
app.use(function(req,res,next){
    if(req.cookies.sid && !req.session.user){
        res.clearCookie('sid');
    }
    next();
})
route(app);


initSocket(io);
http.listen(8080);