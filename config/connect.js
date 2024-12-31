// config/connect.js
const knex = require('knex');
const config = require('./knexfile');
const environment = 'development';
const dbConfig = config[environment];

let db;

try {
  db = knex(dbConfig);

  // Tes koneksi menggunakan pool bawaan Knex
  db.raw('SELECT 1')
    .then(() => {
      console.log('Koneksi ke database berhasil!');
    })
    .catch((err) => {
      console.error('Gagal menyambung ke database:', err.message);
      process.exit(1); // Keluar dari proses jika koneksi gagal
    });
} catch (err) {
  console.error('Kesalahan saat inisialisasi database:', err.message);
  process.exit(1); // Keluar dari proses jika konfigurasi bermasalah
}

module.exports = {
  db,
  appPort: dbConfig.app?.port || 3000,
};
