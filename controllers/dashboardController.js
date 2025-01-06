const { db } = require('../config/connect');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

class DashboardController {
  // Admin Dashboard
  static async adminDashboard(req, res) {
    try {
      // Gabungkan data dari tabel 'users' dan 'users_management'
      const users = await db('users')
        .leftJoin('users_management', 'users.id_user', 'users_management.id_user')
        .select(
            'users.id_user',
            'users.nama_user',
            'users.username',
            'users.email',
            'users.status',
            'users.id_role',
            'users.profile_image',
            'users_management.id_user as management_id',
            'users_management.nama_user as management_name',
            'users_management.username as management_username',
            'users_management.email as management_email',
            'users_management.status as management_status',
            'users_management.id_role as management_role'
          );
          console.log(req.user.profile_image);
      // Render halaman admin dengan data pengguna
      return res.render('admin/index', {
        users,
        title: 'Admin Dashboard',
        rol: req.user.role,
        name: req.user.name,
        profile_image: req.user.profile_image || 'default.jpg',
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      return res.status(500).send('Error fetching users');
    }
  }

  // User Dashboard
  static async userDashboard(req, res) {
    if (req.user && req.user.id_role !== 1) {
      try {
        // Gabungkan data dari tabel 'users' dan 'users_management' berdasarkan id_user
        const user = await db('users')
          .leftJoin('users_management', 'users.id_user', 'users_management.id_user') // Sesuaikan dengan kolom kunci relasi
          .where('users.id_user', req.user.id)
          .first()
          .select(
            'users.id_user',
            'users.name',
            'users.email',
            'users_management.department',
            'users_management.role'
          ); // Sesuaikan kolom yang dibutuhkan

        // Render halaman user dengan data pengguna
        return res.render('user_management/index', { user });
      } catch (error) {
        console.error('Error fetching user data:', error);
        return res.status(500).send('Error fetching user data');
      }
    } else {
      return res.redirect('/admin-dashboard');
    }
  }

   // Update Profile Method
   static async updateProfile(req, res) {
    try {
      const { nama_user, password } = req.body;
      const id = req.user.id

      // Ambil user berdasarkan ID
      const user = await db('users').where({ id_user : id }).first();
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const updates = {};

      // Update nama
      if (nama_user) {
        updates.nama_user = nama_user;
      }

      // Update password
      if (password && password.trim() !== '') {
        const hashedPassword = await bcrypt.hash(password, 10);
        updates.password = hashedPassword;
      }

      // Update profile image
      if (req.file) {
        // Hapus file gambar lama jika ada
        if (user.profile_image && user.profile_image !== 'default.jpg') {
          const oldPath = path.join(__dirname, '../public/uploads/', user.profile_image);
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        }
        updates.profile_image = req.file.filename;
      }

      // Simpan perubahan ke database
      await db('users').where({ id_user: id }).update(updates);

      res.redirect('/admin-dashboard');
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred while updating the profile' });
    }
  
}
}

module.exports = DashboardController;
