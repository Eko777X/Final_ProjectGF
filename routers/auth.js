const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { db } = require('../config/connect');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

const router = express.Router();


// Login Route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Validasi input
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  try {
    // Cari pengguna berdasarkan username
    const user = await db('users').where({ username }).first();

    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    // Verifikasi password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    // Buat token JWT
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.id_role, // Sertakan role dalam token
      },
      JWT_SECRET,
      { expiresIn: '1h' } // Token berlaku selama 1 jam
    );

    res.cookie("token", token, { httpOnly: true, maxAge: 3600000 });
    if (user.id_role === 1) {
      res.redirect('/roles');
    } else if (user.id_role === 2) {
      res.redirect('/user-management');
    } else {
      res.status(403).json({ message: 'Access denied: Invalid role.' });
    }
    
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'An error occurred during login.' });
  }
});

module.exports = router;