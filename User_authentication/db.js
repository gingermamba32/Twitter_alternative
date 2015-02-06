var env = process.env.NODE_ENV || 'development';
var knexConfig = require('./knexfile.js')[env];
var knex = require('knex')(knexConfig);
var bookshelf = require('bookshelf')(knex);

var User = bookshelf.Model.extend({
  tableName: 'username'
});

var Tweet = bookshelf.Model.extend({
	tableName: 'tweets'

module.exports= {
	User: User
};