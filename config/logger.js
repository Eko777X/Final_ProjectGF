const winston = require('winston');
const knexConfig = require('./knexfile'); // Import konfigurasi knex
const knex = require('knex')(knexConfig.development); // Inisialisasi knex dengan environment "development"

// Custom transport untuk Winston yang menyimpan log ke PostgreSQL menggunakan Knex
class KnexTransport extends winston.Transport {
  constructor(opts) {
    super(opts);
    this.knex = knex;
  }

  async log(info, callback) {
    setImmediate(() => this.emit('logged', info));

    const { level, message, timestamp, stack_trace } = info;

    // Hanya menyimpan log dengan level 'error'
    if (level === 'error') {
      try {
        await this.knex('error_logs').insert({
          level,
          message,
          timestamp,
          stack_trace: stack_trace || null,
        });
      } catch (err) {
        console.error('Error saving log to database:', err);
      }
    }

    callback();
  }
}

// Setup Winston logger
const logger = winston.createLogger({
  level: 'error', // Mengatur level log utama menjadi 'error'
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ level, message, timestamp, stack_trace }) => {
      return {
        level,
        message,
        timestamp,
        stack_trace,
      };
    })
  ),
  transports: [
    new winston.transports.Console({ format: winston.format.simple() }), // Menampilkan log error di konsol
    new KnexTransport(), // Menyimpan log ke PostgreSQL menggunakan Knex
  ],
});

module.exports = logger;
