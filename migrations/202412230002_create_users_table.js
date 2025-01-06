const bcrypt = require('bcryptjs');

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
    table.string('profile_image').nullable();
    table.timestamps(true, true);
  });
  const plainPassword = 'superadmin';
  const hashedPassword = await bcrypt.hash(plainPassword, 10);
  const role = await knex('roles').where({ id_role: 1 }).first();

  if (role) {
    // Memeriksa apakah user super_admin dengan id_user = 1 sudah ada
    const existingSuperAdmin = await knex('users').where({ id_user: 1 }).first();
    
    if (!existingSuperAdmin) {
      // Jika `id_user = 1` tidak ada, insert user super_admin dengan id_user = 1
      await knex('users').insert({
        id_user: 1,  // ID tetap untuk super_admin
        nama_user: 'super_admin',
        username: 'superadmin',
        email: 'superadmin@gmail.com',
        password: hashedPassword,
        id_role: role.id_role,
      });
    }

    // Mengatur ulang urutan auto increment untuk memastikan urutan ID tetap benar
    const maxId = await knex('users').max('id_user as max_id').first();
    if (maxId && maxId.max_id) {
      await knex.raw(`
        SELECT setval(pg_get_serial_sequence('users', 'id_user'), ?, false);
      `, [maxId.max_id]);
    }
  }

};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('users');
};
