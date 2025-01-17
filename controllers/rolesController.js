const RoleModel = require('../models/roleModel');
const {db} = require('../config/connect');

class RolesController {
  static async getAllRoles(req, res) {    
    try {
      const roles = await RoleModel.getAllRoles();
      const roleX = await RoleModel.getRolesExceptSp();
      res.render('admin/roles', { 
        name: req.user.name,
        rol: req.user.role,
        title: 'Manage Roles',
        roles: roles,
        roleX,
        profile_image: req.user.profile_image || 'default.jpg',});
    } catch (err) {
      // Tangani error dan lempar ke global error handler
      next(err);
    }
  }

  static async createRole(req, res) {
    try {
      const { nama_role } = req.body;
      await RoleModel.createRole(nama_role);
      res.redirect('/roles');
    } catch (err) {
      // Tangani error dan lempar ke global error handler
      next(err);
    }
  }
}

module.exports = RolesController;