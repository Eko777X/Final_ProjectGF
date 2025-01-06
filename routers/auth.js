const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { db } = require('../config/connect');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

const router = express.Router();


router.get('/login', (req, res) => {
  res.render('login',{title : 'Login Page'});
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Validasi input
  if (!username || !password) {
    return res.render('login', { 
      error: 'Usernameand Password required',
      title : 'Login Page'});
  }

  try {
    // Cari pengguna berdasarkan username
    const [usersTable, usersManagementTable] = await Promise.all([
      db('users').where({ username }).first(), 
      db('users_management').where({ username }).first(),
    ]);

    if (!usersTable && !usersManagementTable) {
      return res.render('login', { 
        error: 'Username not existing',
        title : 'Login Page'
       });
    }
    const user = usersTable || usersManagementTable;

    // Verifikasi password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render('login', { 
        error: 'Invalid username or password!',
        title : 'Login Page'
       });
    }

    // Buat token JWT
    const token = jwt.sign(
      {
        id: user.id_user,
        username: user.username,
        role: user.id_role,
        name: user.nama_user,
        profile_image: user.profile_image

      },
      JWT_SECRET,
      { expiresIn: '1h' } // Token berlaku selama 1 jam
    );

    res.cookie("token", token, { httpOnly: true, maxAge: 3600000 });
    if (user.id_role === 1) {
      res.redirect('/admin-dashboard');
    } else if ([2, 3].includes(user.id_role)) {
      res.redirect('/user-management');
    } else {
      console.error('Invalid Role');
      res.status(403);
      return res.render('login', { 
        error: 'Access Denied',
        title : 'Login Page'
       });
    }
    
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'An error occurred during login.' });
  }
});

module.exports = router;
