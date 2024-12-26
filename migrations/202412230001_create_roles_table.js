exports.up = function (knex) {
  return knex.schema.createTable('roles', (table) => {
    table.increments('id_role').primary();
    table.string('nama_role').notNullable().unique();
  })
  .then(() => {
    return knex('roles').insert({ nama_role: 'super_admin' });
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('roles');
};
