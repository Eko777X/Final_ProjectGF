const UsersManagementModel = require('../models/userManagementModel');
const RoleModel = require('../models/roleModel');
const {db} = require('../config/connect');

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