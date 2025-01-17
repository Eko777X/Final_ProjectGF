const UsersManagementModel = require('../models/userManagementModel');
const {db} = require('../config/connect');
const bcrypt = require('bcryptjs');

class UsersManagementController {
  static async getAllUserManagement(req, res) {
    try {
      const id_user = req.user?.id; // Ambil id_user yang login

      // Cek jika id_user ada
      if (!id_user) {
        return res.status(401).send('User is not authenticated');
      }

      // Ambil data user yang sesuai dengan id_user
      const users = await UsersManagementModel.getUsersWithRoles(id_user);   // Filter berdasarkan id_user
      const roles = await UsersManagementModel.getRolesExcept();
      
      // Kirim data ke view
      res.render('users_management/staffManage', { 
        name: req.user.name,
        rol: req.user.role,
        users, 
        id_user,
        roles,
        title: 'Staff Management',
        profile_image: req.user.profile_image || 'default.jpg',
      });
    } catch (err) {
      // Tangani error dan lempar ke global error handler
      next(err);
    }
  }

  static async createUserManagement(req, res,next) {
    try {

      const { nama_user, username, email, password, id_role, id_user } = req.body;
      const [usersTable, usersManagementTable] = await Promise.all([
        db('users').where({ username }).first(),
        db('users_management').where({ username }).first(),
      ]);

      if (usersTable || usersManagementTable) {
        return res.status(400).json({ message: 'Username already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      await UsersManagementModel.createUserManagement(nama_user, username, email, hashedPassword, id_role, id_user);
      res.redirect('/user-management');
    } catch (err) {
      // Tangani error dan lempar ke global error handler
      next(err);
    }
  }
}

module.exports = UsersManagementController;