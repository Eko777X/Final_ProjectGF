
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
    return db('users_management')
    .leftJoin('roles', 'users_management.id_role', 'roles.id_role')
    .select(
      'users_management.id_user_management',
      'users_management.nama_user',
      'users_management.username',
      'users_management.email',
      'users_management.status',
      'roles.nama_role',
      'users_management.id_user'
    );
  }
  static async getRolesExcept(excludedRoles = [1, 2, 3]) {
    return db('roles').whereNotIn('id_role', excludedRoles);
  }
  
  static async createUserManagement(nama_user, username, email, password, id_role, id_user) {
    return db('users_management').insert({ nama_user, username, email, password, id_role, id_user });
  }
  static async getUsersById(id_user) {
    return db('users_management') // Ganti dengan nama tabel yang sesuai
      .where('id_user', id_user) // Menambahkan filter berdasarkan id_user
      .select('*');
  }
  static async getUsersWithRoles(id_user) {
    return db('users_management')
      .leftJoin('roles', 'users_management.id_role', 'roles.id_role')
      .select(
        'users_management.id_user_management',
        'users_management.nama_user',
        'users_management.username',
        'users_management.email',
        'users_management.status',
        'roles.nama_role',  // Ambil nama_role langsung
        'users_management.id_user'
      )
      .where('users_management.id_user', id_user);  // Hanya ambil user dengan id_user tertentu
}

}

module.exports = UserManagementModel;