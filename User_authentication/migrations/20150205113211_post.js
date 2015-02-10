'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.createTable('posts', function(table) {
    table.increments('id').primary();
    table.integer('userid').references('id').inTable('users');
    table.string('content');
    table.timestamps()
  });
};  ///migrate:latest

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('posts');
};   ///migarte rollback