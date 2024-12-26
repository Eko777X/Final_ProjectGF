const RoleModel = require('../models/roleModel');
const {db} = require('../config/connect');

class RolesController {
  static async getAllRoles(req, res) {    
    try {
      
      const tableExists = await db.schema.hasTable('roles');
      if (!tableExists) {
        console.log('Tabel "roles" tidak ada, menjalankan migrasi...');
        await db.migrate.up('202412230001_create_roles_table.js'); 
        console.log('Migrasi selesai, tabel "roles" telah dibuat.');
      }

      const roles = await RoleModel.getAllRoles();
      res.render('roles/index', { 
        title: 'Manage Roles',
        roles: roles});
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async createRole(req, res) {
    try {
      const { nama_role } = req.body;
      await RoleModel.createRole(nama_role);
      res.redirect('/roles');
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = RolesController;
