const { db } = require('../config/connect');
const path = require('path');
const fs = require('fs');

class ParkingLotController {
  // Get all parking lots
  async getParkingLots(req, res) {
    try {
      const userId = req.user.id; // Ambil ID pengguna yang sedang login
      
      // Ambil data dari tabel parking_lot hanya untuk id_user yang sesuai
      const lots = await db('parking_lot').where({ id_user: userId }).select('*');
      
      // Render halaman dengan data yang difilter
      res.render('users_management/parkingLots', {
        lots,
        title: 'Manage Lots',
        name: req.user.name,
        rol: req.user.role,
        profile_image: req.user.profile_image || 'default.jpg',
      });
    } catch (error) {
      console.error('Error fetching parking lots:', error);
      res.status(500).send('Error fetching parking lots');
    }
  }

  // Create a new parking lot
  async createParkingLot(req, res) {
    try {
      // Pastikan pengguna sudah login
      if (!req.user || !req.user.id) {
        return res.status(401).send('User is not authenticated');
      }
  
      // Ambil data dari body
      let { nama_lot, latitude, longitude, status_lot } = req.body;
      let lot_image = null;
  
      // Validasi input
      if (!nama_lot || !latitude || !longitude || !status_lot) {
        return res.status(400).send('All fields are required');
      }
  
      // Jika ada file yang diunggah, simpan nama file
      if (req.file) {
        lot_image = req.file.filename;
      }
  
      // Ambil id_user dari session atau token (misalnya dari req.user)
      const id_user = req.user.id;  // Ambil id_user yang sudah ada di req.user
  
      // Masukkan data ke database, sertakan id_user
      await db('parking_lot').insert({
        nama_lot,
        lot_image,
        latitude: parseFloat(latitude), // Konversi jika diperlukan
        longitude: parseFloat(longitude), // Konversi jika diperlukan
        status_lot,
        id_user,  // Menambahkan id_user ke dalam insert query
      });
  
      // Redirect ke halaman parking
      res.redirect('/parking');
    } catch (error) {
      console.error('Error creating parking lot:', error);
      res.status(500).send('Error creating parking lot');
    }
  }
  
  
  

  // Delete a parking lot
  async deleteParkingLot(req, res) {
    try {
      const { id_lot } = req.params;
      await db('parking_lot').where('id_lot', id_lot).del();
      res.redirect('/parking-lot');
    } catch (error) {
      res.status(500).send('Error deleting parking lot');
    }
  }
}

module.exports = new ParkingLotController();
