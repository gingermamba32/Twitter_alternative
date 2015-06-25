var promise = require('bluebird')

var express = require('express');
var router = express.Router();
var cookie = require('cookie-parser');


var pg = require('pg');
var passport = require('passport');

//var db = require('../db');

var env = process.env.NODE_ENV || 'development';
var knexConfig = require('../knexfile.js')[env];
var knex = require('knex')(knexConfig);
var bookshelf = require('bookshelf')(knex);

// var redis = require("redis"),
//     client = redis.createClient();



//define the database table as an object
 var User = bookshelf.Model.extend({
  tableName: 'users'
});
var Post = bookshelf.Model.extend({
    tableName: 'posts'
 });

 var Posts = bookshelf.Collection.extend({
  model: Post,
  userNames: function(){
  	this.belongsTo(User);
  }
});
 



/* render login page. */
//route directly to the login page when the app loads
router.get('/', function(req, res, next) {
      //check for cookie and redirct to either twitter.jade or login.jade
      
    if(req.cookies.username) {
        new User({username: req.cookies.username})
        .fetch()
        .then(function(model){
            if(model !== null) {
                res.redirect('/twitter'); 
   
            } else {
                res.redirect('/login');
            }

        });

        //use cookie.value go to db grab their
        //minions, followers,feed, etc
        //get minion obj, overlord obj, twits obj
    } else {
      res.render('login', { title: 'Express' });
    }
});


//render the index page used to store peoples info in the signup process
router.get('/index', function(req, res, next) {

    res.render('index')

});


//*********check if valid userID exists before proceeding to the twitter page********// 
router.post('/login', function(req, res, next){
	//in the login file check to see if the username exists and is valid
	//var newusers [];
	
	var validUserName = function() {

		//bookshelf fetch
		new User({username: req.body.username})
            .fetch()
            .then(function(model){
            if(model !== null) {
                if(model.attributes.password === req.body.password) {
                    res.cookie('username',req.body.username);  
                    res.cookie('password',req.body.password);
                    res.cookie('id', model.attributes.id);

                    res.redirect('/twitter'); 
                } else {
                    console.log('your password literally does not exist').done();

                } 
            } else {
                res.redirect('/index');
            }               
        });
    }
        

    validUserName(); 
});



//****************SIGNUP page*********************
//run a router.post on signup.jade...same interface as the login page just easier to apply this way
router.post('/index',function(req,res,next){

    res.cookie('username',req.body.username); 
    res.cookie('password',req.body.password);

    User.forge({ username: req.body.username, password:req.body.password }).save().then(function(user) {
        console.log('user added %j',user);
        res.render('twitter');
    });

    
});

//************run router.get on the twitter to gather and print out the data of the posts table************//
router.post('/twitter', function(req, res, next){

    Post.forge({ content: req.body.content, userid: req.body.userid}).save().then(function(post) {
        console.log('post added %j',post);
        res.redirect('/twitter');
    });

    
})



router.get('/twitter',function(req,res,next){

    // var newUserId = parseInt(req.cookies.id);

    // knex.select('*').from('posts').where()




    
    //var newUserId = parseInt(req.cookies.id);
            
            new User({username: req.cookies.username})
                .fetch()
                .then(function(model){
                   var userid = model.attributes.id;
                   console.log(userid);

                new Posts()
                   .query('where', 'userid', '=', userid)
                   .fetch()
                   .then(function(data){
                        
                        var posts = data;
                        console.log(posts);
                         
                        res.render('twitter', {username: req.cookies.username, posts: posts.models, userid: userid})
                   });
               });
                    
    });












// router.get('/', function(req, res, next) {
// 	// console.log("cookies: ", req.cookies);
// 	User.where({username: req.cookies.indusername, password: req.cookies.induserpassword}).fetchAll().then(function(user) {
//  //  	console.log(res.toJSON());

//  	if (user){
// 	// if (req.cookies.indusername && req.cookies.induserpassword) {

// 		// User.where({ name: indusername }).fetchAll().then(function(result) {
//  	// 	console.log(result.toJSON());
// 		// })
// 		// .done();

// 		// User.where({ password: induserpassword }).fetchAll().then(function(result) {
//  	// 	console.log(result.toJSON());
// 		// })
// 		// .done();


// 	res.render('twitter', {title: 'Express', name: req.cookies.indusername, password: req.cookies.induserpassword});
// 		}
// 	else {
// 		console.log('Please Sign Up')
// 		res.redirect('/signup');
// 		}
// 	});	
// });

//use router.post to store the contents of the twitter submit within the database
// router.post('/twitter', function(req, res, next) {
// 	Contents.forge({ content: req.body.content, username: req.cookie.username}).save().then(function(text) {
//   	console.log('created a content %j', text.toJSON());
// 	});
// 	res.render('/twitter');
// });




// router.post('/twitter', function(req, res, next) {
// 	res.cookie("indusername", req.body.username);
// 	res.cookie("induserpassword", req.body.password);

	// User.forge({ username: req.body.username, password: req.body.password}).save().then(function(user) {
//   	console.log('created a user %j', user.toJSON());
// 	});


// 	res.redirect('/twitter');
// });

module.exports = router;
