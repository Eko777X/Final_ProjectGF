const express = require('express');
const router = express.Router();
const RolesController = require('../controllers/rolesController');
const UsersController = require('../controllers/usersController');
const UsersManagementController = require('../controllers/usersManagementController');
const authMiddleware = require('../middleware/validate');



// Routes for roles
router.get(
    '/roles',
    authMiddleware.authenticate, // Middleware autentikasi
    authMiddleware.authorizeRole([1]), // Hanya admin yang bisa mengakses
    RolesController.getAllRoles
  );
  router.post(
    '/roles',
    authMiddleware.authenticate,
    authMiddleware.authorizeRole([1]), // Hanya admin
    RolesController.createRole
  );

// Routes for users
router.get('/register', UsersController.getAllUsers );
router.post('/register', UsersController.createUser);
router.get('/verify-email', UsersController.verifyEmail);

// Routes for user management
router.get(
    '/user-management',
    authMiddleware.authenticate, // Middleware autentikasi
    authMiddleware.authorizeRole([2]), // Role 2 bisa mengakses
    UsersManagementController.getAllUserManagement
  );
  router.post(
    '/user-management',
    authMiddleware.authenticate,
    authMiddleware.authorizeRole([2]),
    UsersManagementController.createUserManagement
  );

module.exports = router;

