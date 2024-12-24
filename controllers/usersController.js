const UserModel = require('../models/userModel');

class UsersController {
  static async getAllUsers(req, res) {
    try {
      const users = await UserModel.getAllUsers();
      res.render('users/index', { users });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async createUser(req, res) {
    try {
      const { nama_user, username, email, password, id_role } = req.body;
      await UserModel.createUser(nama_user, username, email, password, id_role);
      res.redirect('/users');
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = UsersController;
