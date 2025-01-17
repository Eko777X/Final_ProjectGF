exports.up = function(knex) {
    return knex.schema.createTable('parking_lot', function(table) {
      table.increments('id_lot').primary();
      table.string('nama_lot').notNullable();
      table.string('lot_image').nullable();
      table.timestamps(true, true);
      table.double('latitude').notNullable();
      table.double('longitude').notNullable();
      table.string('status_lot').notNullable().defaultTo('active');
      table.integer('id_user').unsigned().references('id_user').inTable('users').onDelete('CASCADE');
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists('parking_lot');
  };
