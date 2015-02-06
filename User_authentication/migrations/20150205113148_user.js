'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function(table) {
    table.increments('id').primary(); //userID
    table.string('username'); //name
    table.string('password');  //password
  });
};  ///migrate:latest

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};   ///migarte rollback
