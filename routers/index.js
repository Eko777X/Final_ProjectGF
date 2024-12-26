const express = require('express');
const router = express.Router();
const RolesController = require('../controllers/rolesController');
const UsersController = require('../controllers/usersController');
const UsersManagementController = require('../controllers/usersManagementController');

// Routes for roles
router.get('/roles', RolesController.getAllRoles);
router.post('/roles', RolesController.createRole);

// Routes for users
router.get('/user', UsersController.getAllUsers);
router.post('/user', UsersController.createUser);

// Routes for user management
router.get('/user-management', UsersManagementController.getAllUserManagement);
router.post('/user-management', UsersManagementController.createUserManagement);

module.exports = router;

