const express = require('express');
const path = require('path');
const { appPort } = require('./config/connect');
const routes = require('./routers');
const authRoutes = require('./routers/auth');
const cookieParser = require("cookie-parser");
const { initDatabase } = require('./middleware/init');
const logger = require('./config/logger');
const app = express();

(async () => {
  try {
    // Inisialisasi database
    await initDatabase();

app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));

// Middleware untuk menyajikan file statis dari node_modules
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));
app.use(cookieParser());
app.use('/auth', authRoutes);
app.use(routes);
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

app.get('/', (req, res) => {
  res.render('index'); // Pastikan login.ejs ada di folder views
});

// Global error handler
app.use((err, req, res, next) => {
  // Log error dengan detail stack trace
  logger.error('Unexpected error: ' + err.message, { stack_trace: err.stack });
  const status = err.status || 500;
  res.status(status).render('error', {
    error: {
      message: 'Internal Server Error',
      status: status,
    },
  });
});

app.listen(appPort, () => {
  console.log(`Server running at http://localhost:${appPort}`);
});
} catch (err) {
  console.error('Failed to initialize the database:', err);
  process.exit(1);
}
})();
