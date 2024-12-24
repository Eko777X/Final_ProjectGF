
// class UserManagementModel {
//   static async createUserManagement(nama_user, username, password, id_role, id_user) {
//     return knex('users_manajemen').insert({ nama_user, username, password, id_role, id_user });
//   }

//   static async getUserManagementById(id_user_manajemen) {
//     return knex('users_manajemen').where('id_user_manajemen', id_user_manajemen).first();
//   }

//   static async getAllUserManagement() {
//     return knex('users_manajemen').select('*');
//   }

//   static async updateUserManagement(id_user_manajemen, updatedData) {
//     return knex('users_manajemen').where('id_user_manajemen', id_user_manajemen).update(updatedData);
//   }

//   static async deleteUserManagement(id_user_manajemen) {
//     return knex('users_manajemen').where('id_user_manajemen', id_user_manajemen).del();
//   }
// }

// module.exports = UserManagementModel;

const {db} = require('../config/connect');

class UserManagementModel {
  static async getAllUsersManagement() {
    return db('users_management').select('*');
  }

  static async createUserManagement(nama_user, username, email, password, id_role, id_user) {
    return db('users_management').insert({ nama_user, username, email, password, id_role, id_user });
  }
}

module.exports = UserManagementModel;
