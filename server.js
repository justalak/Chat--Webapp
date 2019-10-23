var express=require('express');
var app=express();
var http=require('http').createServer(app);
var bodyParser=require('body-parser');
var loginController=require('./controller/loginController')
var contactController =require('./controller/contactController');
var session=require('express-session');
var cookieParser=require('cookie-parser');

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

app.get('/',function(req,res,next){
    res.redirect('/login');
})
app.route('/login').post(loginController.login)
    .get(function(req,res){
        if(req.cookies && req.session.user){
            res.redirect('/home');
        }
        else{
            res.sendFile(__dirname+'/public/login.html');
        }
    });
app.route('/register').post(loginController.register);
app.route('/logout').get(function(erq,res){
    res.clearCookie('sid');
    
    res.redirect('/login');
})
app.route('/home').get(async function(req,res){
    if(req.cookies.sid && req.session.user){
        res.render(__dirname+'/public/view/chat-window.ejs',{
            user: req.session.user
        });
        
    }
    else res.redirect('/login');
})
//Contact
app.route('/addfr/:name').get(contactController.addContact);
app.route('/getfr').get(contactController.getContact);

http.listen(8080);