exports.up = function(knex) {
    return knex.schema.createTable('users', function(table) {
      table.increments('id_user').primary();
      table.string('nama_user').notNullable();
      table.string('username').unique().notNullable();
      table.string('email').notNullable();
      table.string('password').notNullable();
      table.string('status').notNullable().defaultTo('active');
      table.integer('id_role').unsigned().references('id_role').inTable('roles').onDelete('CASCADE');
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists('users');
  };
  