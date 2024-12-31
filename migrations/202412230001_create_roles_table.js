exports.up = async function (knex) {
  await knex.schema.createTable('roles', (table) => {
    table.increments('id_role').primary();
    table.string('nama_role').notNullable().unique();
  });

  // Isi data default
  await knex('roles').insert([
    { nama_role: 'super_admin' },
    { nama_role: 'User' },
    { nama_role: 'Parking Space Provider' }
  ]);
};
exports.down = function (knex) {
  return knex.schema.dropTable('roles');
};
