const RoleModel = require('../models/roleModel');

class RolesController {
  static async getAllRoles(req, res) {
    try {
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
