const UsersManagementModel = require('../models/userManagementModel');
const {db} = require('../config/connect');
const bcrypt = require('bcryptjs');

class UsersManagementController {
  static async getAllUserManagement(req, res) {
    try {
      const tableExists = await db.schema.hasTable('users_management');
      if (!tableExists) {
        console.log('Tabel "users_management" tidak ada, menjalankan migrasi...');
  
        await db.migrate.up('202412230003_create_users_table.js'); 
        
        console.log('Migrasi selesai, tabel "users_management" telah dibuat.');
      }
      const usersManagement = await UsersManagementModel.getAllUsersManagement();
      const roles = await UsersManagementModel.getRolesExcept();
      const id_user = req.user?.id;
      res.render('users_management/index', { 
        usersManagement, 
        id_user,
        roles,
        title: 'Staff Management', });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async createUserManagement(req, res) {
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
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = UsersManagementController;