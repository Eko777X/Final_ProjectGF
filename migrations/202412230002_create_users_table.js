exports.up = async function (knex) {
  // Membuat tabel users
  await knex.schema.createTable('users', function (table) {
    table.increments('id_user').primary();
    table.string('nama_user').notNullable();
    table.string('username').unique().notNullable();
    table.string('email').notNullable();
    table.string('password').notNullable();
    table.string('status').notNullable().defaultTo('active');
    table
      .integer('id_role')
      .unsigned()
      .references('id_role')
      .inTable('roles')
      .onDelete('CASCADE');
  });

  const role = await knex('roles').where({ nama_role: 'super_admin' }).first();
  if (role) {
    await knex('users').insert({
      nama_user: 'super_admin',
      username: 'superadmin',
      email: 'superadmin@gmail.com',
      password: 'superadmin',
      id_role: role.id_role,
    });
  }
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('users');
};
