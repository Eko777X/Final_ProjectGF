const express = require('express');
const path = require('path');
const RolesController = require('./controllers/rolesController');
const UsersController = require('./controllers/usersController');
const UsersManagementController = require('./controllers/usersManagementController');
const { appPort } = require('./config/connect'); // Ambil port dari konfigurasi
const app = express();


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/roles', RolesController.getAllRoles);
app.post('/roles', RolesController.createRole);

app.get('/users', UsersController.getAllUsers);
app.post('/users', UsersController.createUser);

app.get('/user-management', UsersManagementController.getAllUserManagement);
app.post('/user-management', UsersManagementController.createUserManagement);

// Start the server
app.listen(appPort, () => {
  console.log(`Server running at http://localhost:${appPort}`);
});
