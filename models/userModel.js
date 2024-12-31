
// class UserModel {
//   static async createUser(nama_user, email, password, id_role) {
//     return knex('users').insert({ nama_user, email, password, id_role });
//   }

//   static async getUserById(id_user) {
//     return knex('users').where('id_user', id_user).first();
//   }

//   static async getAllUsers() {
//     return knex('users').select('*');
//   }

//   static async updateUser(id_user, updatedData) {
//     return knex('users').where('id_user', id_user).update(updatedData);
//   }

//   static async deleteUser(id_user) {
//     return knex('users').where('id_user', id_user).del();
//   }
// }

// module.exports = UserModel;

const {db} = require('../config/connect');

class UserModel {
  static async getAllUsers() {
    return db('users').select('*');
  }

  static async getRolesExceptSuperAdmin() {
    return db('roles').whereNot('id_role', 1);
  }

  static async createUser(nama_user, username, email, password, id_role) {
    return db('users').insert({ nama_user, username, email, password, id_role });
  }
}

module.exports = UserModel;