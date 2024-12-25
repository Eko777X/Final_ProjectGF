const UsersManagementModel = require('../models/userManagementModel');
const RoleModel = require('../models/roleModel');

class UsersManagementController {
  static async getAllUserManagement(req, res) {
    try {
      const usersManagement = await UsersManagementModel.getAllUsersManagement();
      const roles = await RoleModel.getAllRoles(); // Mengambil data role

      res.render('users_management/index', { 
        usersManagement, 
        roles,
        title: 'Management', });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async createUserManagement(req, res) {
    try {
      const { nama_user, username, email, password, id_role, id_user } = req.body;
      await UsersManagementModel.createUserManagement(nama_user, username, email, password, id_role, id_user);
      res.redirect('/user-management');
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = UsersManagementController;
