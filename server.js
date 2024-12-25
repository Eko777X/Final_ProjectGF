const express = require('express');
const path = require('path');
const { appPort } = require('./config/connect');
const routes = require('./routers');

const app = express();


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));

// Middleware untuk menyajikan file statis dari node_modules
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));

app.use(routes);


app.listen(appPort, () => {
  console.log(`Server running at http://localhost:${appPort}`);
});
