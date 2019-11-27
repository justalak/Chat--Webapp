var contactController =require('../controller/contactController');
var convesationController=require('../controller/conversationController');
var userController=require('../controller/userController');
var loginController=require('../controller/loginController')
var messageController=require('../controller/messageController') 

module.exports= (app)=>{
    app.get('/',function(req,res,next){
        res.redirect('/login');
    })
    app.route('/login').post(loginController.login)
        .get(function(req,res){
            if(req.cookies && req.session.user){
                res.redirect('/home');
            }
            else{
                res.render('login');
            }
        });
    app.route('/register').post(loginController.register);
    app.route('/logout').get(function(erq,res){
        res.clearCookie('sid');
        
        res.redirect('/login');
    })
    app.route('/getuser/:user_id').get(userController.getUser);
    app.route('/getinfor/:username').get(userController.getInfor);
    app.route('/get')
    app.route('/home').get(async function(req,res){
        if(req.cookies.sid && req.session.user){
            res.render('chat-window',{
                user: req.session.user
            });
            
        }
        else res.redirect('/login');
    })
    //Contact
    app.route('/addfr/:name').get(contactController.addContact);
    app.route('/getfr').get(contactController.getContact);
    app.route('/get-notification/:user_id').get(contactController.getNotification);
    app.route('/check-notifications/:user_id').put(contactController.checkNotifications);
    //Conversation
    app.route('/loadconv/:type').get(convesationController.loadConversation);
    app.route('/getconv/:conv_id').get(convesationController.getConversation);
    app.route('/preview/:conv_id').get(messageController.getPreview);
    app.route('/creategroup').post(convesationController.createGroupChat);
    app.route('/update-group-name/:conv_id').put(convesationController.changeGroupName);
    app.route('/add-members/:conv_id').post(convesationController.addMembersToGroup);
    //Message
    app.route('/getmessage/:conv_id/:page').get(messageController.getMessage);
    app.route('/sendmessage').post(messageController.addMessage);
    app.route('/sendattachment/:conv_id/:user_send').post(messageController.addAttachment);
    //UpdateProfie
    app.route('/upload').post(userController.updateProfile);
}