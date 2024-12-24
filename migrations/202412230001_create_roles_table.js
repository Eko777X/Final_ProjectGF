exports.up = function(knex) {
    return knex.schema.createTable('roles', function(table) {
      table.increments('id_role').primary();
      table.string('nama_role').notNullable();
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists('roles');
  };
  