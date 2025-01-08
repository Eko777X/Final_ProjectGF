const UserModel = require('../models/userModel');
const { db } = require('../config/connect');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { error } = require('winston');
const { start } = require('@popperjs/core');

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
      const roles = await UserModel.getRolesOnly();
      res.render('register', { 
        roles,
        title : 'Register',
        formData: req.body,
       });
    } catch (error) {
      console.error('Error fetching users:', error);
      const roles = await UserModel.getRolesOnly();
        res.status(500);
        return res.render('register',{ 
        roles,
        error: 'Error fetching users.',
        title : 'Register',
        formData: req.body, });
      }
    }

  // Membuat pengguna baru
  static async createUser(req, res) {
    try {
      const { nama_user, username, email, password, confirm_password, id_role } = req.body;

      // Validasi jika password dan confirm_password tidak cocok
  if (password !== confirm_password) {
    return res.render('register', {
      error: 'Passwords do not match!',
      roles: await UserModel.getRolesOnly(),
      title : 'Register',
      formData: req.body,
    });
  }
      
      // Validasi input
      if (!nama_user || !username || !email || !password || !id_role) {
        const roles = await UserModel.getRolesOnly();
        res.status(400);
        return res.render('register',{ 
          roles,
          error: 'All fields are required.',
          title : 'Register', });
      }

     // Periksa apakah username sudah digunakan di dua tabel
      const [usersTable, usersManagementTable] = await Promise.all([
        db('users').where({ username }).first(),
        db('users_management').where({ username }).first(),
      ]);

      if (usersTable || usersManagementTable) {
        const roles = await UserModel.getRolesOnly();
        return res.render('register',{ 
          roles,
          error: 'Username already exists',
          title : 'Register',});
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
          console.error('Failed to send verification email', err);
          res.status(err.status || 500 );
          return res.render('error', { 
          error: err
           });
        }
        console.log('Verification email sent:', info.response);
        res.status(201).json({ message: 'User registered successfully. Verification email sent.' });
      });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(error.status || 500);
      return res.render('error', {error});
    }
  }

  // Verifikasi email
  static async verifyEmail(req, res) {
    try {
      const { token } = req.query;

      if (!token) {
        console.error('Token is required.');
        res.status(error.status || 400);
        return res.render('error', { error });
      }

      // Verifikasi token
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = unverifiedUsers.find(user => user.email === decoded.email);  // Cari pengguna di array sementara

      if (!user) {
        console.error('User not found or already verified:');
        res.status(error.status || 404);
        return res.render('error', { error });
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

      res.render('emailVerified',{title : 'Email Verified'});
    } catch (error) {
      console.error('Error verifying email:', error);
      res.status(error.status || 500);
      res.render('error', { error });
    }
  }

  static async editStatus(req, res) {
    try {
      // Ambil id_user dan status dari req.body
      const { id_user, status } = req.body;

      // Pastikan id_user ada di database
        const user = await db('users').where({ id_user }).first();
      
      if (user) {
        // Update status user
        await db('users').where({ id_user : id_user }).update({ status });

        return res.redirect('/admin-dashboard');

      }
    } catch (error) {
      console.error('Error updating status:', error);
      res.status(error.status || 500);
      res.render('error', { error });
  }
}} 

module.exports = UsersController;
