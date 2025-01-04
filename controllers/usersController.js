const UserModel = require('../models/userModel');
const { db } = require('../config/connect');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

// Konfigurasi transporter Mailtrap
const transporter = nodemailer.createTransport({
  host: 'smtp.mailtrap.io',
  port: 587,
  auth: {
    user: process.env.MAILTRAP_USER, // Username dari Mailtrap
    pass: process.env.MAILTRAP_PASS, // Password dari Mailtrap
  },
  tls: {
    rejectUnauthorized: false, // Abaikan sertifikat tidak valid
  },
});

const unverifiedUsers = [];  // Array untuk menyimpan pengguna yang belum terverifikasi

class UsersController {
  // Mendapatkan semua pengguna
  static async getAllUsers(req, res) {
    try {
      const tableExists = await db.schema.hasTable('users');
      if (!tableExists) {
        console.log('Tabel "users" tidak ada, menjalankan migrasi...');
        await db.migrate.up('202412230002_create_users_table.js');
        console.log('Migrasi selesai, tabel "users" telah dibuat.');
      }

      const users = await UserModel.getAllUsers();
      const roles = await UserModel.getRolesExceptSuperAdmin();
      res.render('register', { users, roles });
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Error fetching users.' });
    }
  }

  // Membuat pengguna baru
  static async createUser(req, res) {
    try {
      const { nama_user, username, email, password, id_role } = req.body;

      // Validasi input
      if (!nama_user || !username || !email || !password || !id_role) {
        return res.status(400).json({ message: 'All fields are required.' });
      }

     // Periksa apakah username sudah digunakan di dua tabel
      const [usersTable, usersManagementTable] = await Promise.all([
        db('users').where({ username }).first(),
        db('users_management').where({ username }).first(),
      ]);

      if (usersTable || usersManagementTable) {
        return res.status(400).json({ message: 'Username already exists' });
      }

      // Lanjutkan proses jika username belum digunakan

      // Enkripsi password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Simpan pengguna baru ke array sementara (unverifiedUsers)
      const newUser = { nama_user, username, email, password: hashedPassword, id_role, isVerified: false };
      unverifiedUsers.push(newUser);  // Menyimpan pengguna ke dalam array sementara

      // Buat JWT token untuk verifikasi email
      const token = jwt.sign(
        { email: newUser.email },
        JWT_SECRET,
        { expiresIn: '1h' }
      );

      // Kirim email verifikasi
      const mailOptions = {
        from: 'noreply@example.com',
        to: email,
        subject: 'Email Verification',
        html: `
          <p>Thank you for registering. Please verify your email by clicking the link below:</p>
          <a href="http://localhost:3000/verify-email?token=${token}">Verify Email</a>
        `,
      };

      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.error('Error sending email:', err);
          return res.status(500).json({ message: 'Failed to send verification email' });
        }
        console.log('Verification email sent:', info.response);
        res.status(201).json({ message: 'User registered successfully. Verification email sent.' });
      });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ message: 'Error creating user.' });
    }
  }

  // Verifikasi email
  static async verifyEmail(req, res) {
    try {
      const { token } = req.query;

      if (!token) {
        return res.status(400).json({ message: 'Token is required.' });
      }

      // Verifikasi token
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = unverifiedUsers.find(user => user.email === decoded.email);  // Cari pengguna di array sementara

      if (!user) {
        return res.status(404).json({ message: 'User not found or already verified.' });
      }

      // Tandai pengguna sebagai terverifikasi
      user.isVerified = true;

      // Pindahkan data ke database PostgreSQL setelah verifikasi
      await db('users').insert({
        nama_user: user.nama_user,
        username: user.username,
        email: user.email,
        password: user.password,
        id_role: user.id_role,
      });

      // Hapus pengguna dari array sementara
      unverifiedUsers.splice(unverifiedUsers.indexOf(user), 1);

      res.render('EmailVerified');
    } catch (error) {
      console.error('Error verifying email:', error);
      res.status(400).json({ message: 'Invalid or expired token.' });
    }
  }
}

module.exports = UsersController;
