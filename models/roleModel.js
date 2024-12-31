
// class RoleModel {
//   static async createRole(nama_role) {
//     return knex('roles').insert({ nama_role });
//   }

//   static async getRoleById(id_role) {
//     return knex('roles').where('id_role', id_role).first();
//   }

//   static async getAllRoles() {
//     return knex('roles').select('*');
//   }

//   static async updateRole(id_role, updatedData) {
//     return knex('roles').where('id_role', id_role).update(updatedData);
//   }

//   static async deleteRole(id_role) {
//     return knex('roles').where('id_role', id_role).del();
//   }
// }


const {db} = require('../config/connect');
class RoleModel {
  static async getAllRoles() {
    return db('roles').select('*');
  }

  static async createRole(nama_role) {
    return db('roles').insert({ nama_role });
  }
}

module.exports = RoleModel;