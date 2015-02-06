var express = require('express');
var router = express.Router();
var knex = require('knex');
var pg = require('pg');
var passport = require('passport');
//var db = require('../db');

var env = process.env.NODE_ENV || 'development';
var knexConfig = require('../knexfile.js')[env];
var knex = require('knex')(knexConfig);
var bookshelf = require('bookshelf')(knex);




//define the database table as an object
 var User = bookshelf.Model.extend({
  tableName: 'users'
});

 var Tweet = bookshelf.Model.extend({
  tableName: 'posts'
});



/* GET signin page. */
//route directly to the login page when the app loads
router.get('/', function(req, res, next){
	res.render('login', {title: 'Express'});
});

router.post('/login', function(req, res, next){
	//in the login file check to see if the username exists and is valid
	//If you wish to trigger an error if the fetched model is not found, pass {require: true} as one of the options to the fetch call.
	var validUserName = function() {

		//bookshelf fetch
		new User({username: req.body.username, password: req.body.password}).fetch().then(function(model){
			 if(model) {
                    res.cookie('username',req.body.username); 
                    res.cookie('password',req.body.password);
                    res.render('twitter'); 
                } 
                //
               else {
               	res.cookie("username", req.body.username);
				res.cookie("username", req.body.password);

				User.forge({ username: req.body.username, password: req.body.password}).save().then(function(user) {
  				console.log('created a user %j', user.toJSON());
				});


					res.render('twitter');
               } 

		})	
	}
	validUserName();
 
    //bookshelf command to check database for password
    //if match, render homepage
    //if not, throw error
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
router.post('/twitter', function(req, res, next) {
	Tweet.forge({ text: req.body.post, user_id: req.body.username}).save().then(function(user) {
  	console.log('created a user %j', user.toJSON());
	});


// router.post('/', function(req, res, next) {
// 	res.cookie("indusername", req.body.username);
// 	res.cookie("induserpassword", req.body.password);

// 	User.forge({ username: req.body.username, password: req.body.password}).save().then(function(user) {
//   	console.log('created a user %j', user.toJSON());
// 	});


// 	res.redirect('/twitter');
// });

module.exports = router;
