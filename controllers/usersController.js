const UserModel = require('../models/userModel');
const {db} = require('../config/connect');

class UsersController {
  static async getAllUsers(req, res) {
    try {
      const tableExists = await db.schema.hasTable('users');
      if (!tableExists) {
        console.log('Tabel "users" tidak ada, menjalankan migrasi...');
  
        await db.migrate.up('202412230002_create_users_table.js'); 
        
        console.log('Migrasi selesai, tabel "users" telah dibuat.');
      }
      const users = await UserModel.getAllUsers();
      const roles = await UserModel.getRolesExceptSuperAdmin();
      res.render('user/index', { 
        users,
        roles,
       });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async createUser(req, res) {
    try {
      const { nama_user, username, email, password, id_role } = req.body;
      await UserModel.createUser(nama_user, username, email, password, id_role);
      res.redirect('/user');
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = UsersController;
