// knexfile.js
module.exports = {
  development: {
    client: 'pg',  // Gunakan 'pg' untuk PostgreSQL
    connection: {
      host: 'localhost',
      user: 'postgres',
      password: '123',
      database: 'DbInvenParkir'
    },
    migrations: {
      directory: './migrations'
    },
    app: {
      port: 3000, // Tambahkan port untuk aplikasi
    },
  }
};
