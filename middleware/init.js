const knex = require('knex');
const { development } = require('../config/knexfile');
const { Client } = require('pg'); // Import Client PostgreSQL

const DATABASE_NAME = 'DbInvenParkir';

const initDatabase = async () => {
  // Gunakan client pg langsung untuk memeriksa keberadaan database
  const client = new Client({
    user: 'postgres',
    host: 'localhost',
    password: '123', // Sesuaikan dengan password PostgreSQL Anda
    database: 'postgres', // Gunakan database default untuk mengecek dan membuat database baru
  });

  try {
    await client.connect();

    // Cek apakah database sudah ada
    const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = '${DATABASE_NAME}'`);
    if (res.rowCount === 0) {
      console.log(`Database "${DATABASE_NAME}" tidak ditemukan. Membuat database...`);
      await client.query(`CREATE DATABASE "${DATABASE_NAME}"`);
    } else {
      console.log(`Database "${DATABASE_NAME}" sudah ada.`);
    }

    await client.end();

    // Gunakan Knex untuk koneksi ke database dan menjalankan migrasi
    const db = knex(development);

    console.log('Memeriksa keberadaan tabel...');

    // Daftar tabel yang perlu diperiksa
    const tablesToCheck = ['roles', 'users', 'users_management', 'error_logs'];

    // Pemeriksaan keberadaan masing-masing tabel dan migrasi satu per satu
    for (const tableName of tablesToCheck) {
      const tableExists = await db.raw(`
        SELECT to_regclass('public.${tableName}') IS NOT NULL AS table_exists
      `);

      if (tableExists.rows[0].table_exists) {
        console.log(`Tabel "${tableName}" sudah ada, tidak perlu membuat ulang.`);
      } else {
        console.log(`Tabel "${tableName}" tidak ditemukan. Membuat tabel baru...`);
        
        // Untuk setiap tabel, jalankan migrasi terkait
        try {
          await runMigrationForTable(db, tableName);
        } catch (err) {
          console.error(`Migrasi gagal untuk tabel "${tableName}":`, err);
        }
      }
    }

    console.log('Semua migrasi berhasil dijalankan atau sudah ada.');

    await db.destroy();
  } catch (err) {
    console.error('Error saat inisialisasi database:', err);
    throw err;
  }
};

// Fungsi untuk menjalankan migrasi terkait tabel tertentu
const runMigrationForTable = async (db, tableName) => {
  // Jalankan migrasi satu per satu untuk setiap tabel yang tidak ditemukan
  switch (tableName) {
    case 'roles':
      console.log('Menjalankan migrasi untuk tabel "roles"...');
      await db.migrate.rollback({ name: 'roles' }); // Rollback jika ada migrasi sebelumnya
      await db.migrate.latest({ name: 'roles' });  // Jalankan migrasi untuk tabel roles
      break;
    case 'users':
      console.log('Menjalankan migrasi untuk tabel "users"...');
      await db.migrate.rollback({ name: 'users' });
      await db.migrate.latest({ name: 'users' });
      break;
    case 'users_management':
      console.log('Menjalankan migrasi untuk tabel "users_management"...');
      await db.migrate.rollback({ name: 'users_management' });
      await db.migrate.latest({ name: 'users_management' });
      break;
    case 'eror_logs':
      console.log('Menjalankan migrasi untuk tabel "users_management"...');
      await db.migrate.rollback({ name: 'error_logs' });
      await db.migrate.latest({ name: 'error_logs' });
      break;
    default:
      console.log(`Migrasi untuk tabel "${tableName}" tidak ditemukan.`);
      break;
  }
};

module.exports = { initDatabase };
