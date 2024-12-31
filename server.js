const express = require('express');
const path = require('path');
const { appPort } = require('./config/connect');
const routes = require('./routers');
const authRoutes = require('./routers/auth');
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));

// Middleware untuk menyajikan file statis dari node_modules
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));
app.use(cookieParser());
app.use('/auth', authRoutes);
app.use(routes);

app.get('/', (req, res) => {
  res.render('login'); // Pastikan login.ejs ada di folder views
});

app.listen(appPort, () => {
  console.log(`Server running at http://localhost:${appPort}`);
});

