
exports.up = function (knex) {
    return knex.schema.createTable('error_logs', (table) => {
      table.increments('id').primary(); // Primary key auto increment
      table.string('level', 50); // Level log (error, info, etc.)
      table.text('message'); // Pesan log
      table.timestamp('timestamp').defaultTo(knex.fn.now()); // Timestamp log
      table.text('stack_trace'); // Stack trace jika ada error
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTableIfExists('error_logs'); // Rollback: menghapus tabel
  };
  