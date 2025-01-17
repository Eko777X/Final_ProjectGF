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
        .leftJoin('users_management', 'users.id_user', 'users_management.id_user_management')
        .leftJoin('roles', 'users.id_role', 'roles.id_role')
        .select(
            'users.id_user',
            'users.nama_user',
            'users.username',
            'users.email',
            'users.status',
            'users.id_role',
            'users.profile_image',
            'roles.nama_role as role_name',
            'users_management.id_user_management as management_id',
            'users_management.nama_user as management_name',
            'users_management.username as management_username',
            'users_management.email as management_email',
            'users_management.status as management_status',
            'users_management.id_role as management_role'
          );
         
      // Render halaman admin dengan data pengguna
      return res.render('admin/index', {
        users,
        title: 'SuperAdmin Dashboard',
        rol: req.user.role,
        name: req.user.name,
        profile_image: req.user.profile_image || 'default.jpg',
      });
      
    } catch (err) {
      // Tangani error dan lempar ke global error handler
      next(err);
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
      } catch (err) {
        // Tangani error dan lempar ke global error handler
        next(err);
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

      if (req.user.role === 1) {
        // Jika id_role = 1 (superadmin), redirect ke admin-dashboard
        return res.redirect('/admin-dashboard');
      }
  
      // Jika bukan superadmin, redirect ke halaman profil atau halaman lain yang sesuai
      return res.redirect('/user-management');

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred while updating the profile' });
    }
  
}

  // Staff Details
  static async detailsStaff(req, res) {
    try {
      const { id } = req.params; // Ambil ID dari parameter URL

      // Ambil data dari tabel users dengan join ke tabel users_management
      const users = await db('users')
        .leftJoin('users_management', 'users.id_user', 'users_management.id_user')
        .leftJoin('roles as users_role', 'users.id_role', 'users_role.id_role')
        .leftJoin('roles as management_role', 'users_management.id_role', 'management_role.id_role')
        .select(
          'users.id_user',
          'users.nama_user',
          'users.username',
          'users.email',
          'users.status',
          'users.profile_image',
          'users_role.nama_role as role_name',
          'management_role.nama_role as staffRole_name',
          'users_management.id_user_management as management_id',
          'users_management.nama_user as management_name',
          'users_management.username as management_username',
          'users_management.email as management_email',
          'users_management.status as management_status',
          'users_management.id_role as management_role'
        )
        .where('users.id_user', id);

      if (!users) {
        return res.status(404).render('404', { message: 'Staff not found' });
      }

      res.render('admin/detailsStaff', { 
        users,
        title : 'Details Staff',
        rol: req.user.role,
        name: req.user.name,
        profile_image: req.user.profile_image || 'default.jpg',
       });
    } catch (err) {
      // Tangani error dan lempar ke global error handler
      next(err);
    }
  }

  static async updateStatus(req, res) {
      try {
        // Ambil id_user dan status dari req.body
        const { id_user, management_id, status } = req.body;
        
        // Pastikan id_user ada di database
          const user = await db('users_management').where({ id_user_management : management_id  }).first();
        
        if (user) {
          // Update status user
          await db('users_management').where({ id_user_management : management_id }).update({ status });
        }

      // Redirect ke halaman staff details setelah update status
      return res.redirect(`/staff-details/${id_user}`);
    } catch (err) {
      // Tangani error dan lempar ke global error handler
      next(err);
    }
  }

}
module.exports = DashboardController;
