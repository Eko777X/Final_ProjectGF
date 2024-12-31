exports.up = function(knex) {
    return knex.schema.createTable('users_management', function(table) {
      table.increments('id_user_management').primary();
      table.string('nama_user').notNullable();
      table.string('username').unique().notNullable();
      table.string('email').notNullable();
      table.string('password').notNullable();
      table.string('status').notNullable().defaultTo('active');
      table.integer('id_role').unsigned().references('id_role').inTable('roles').onDelete('CASCADE');
      table.integer('id_user').unsigned().references('id_user').inTable('users').onDelete('CASCADE');
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists('users_management');
  };
