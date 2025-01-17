const { db } = require('../config/connect');

class LogsController {
 
  static async getErrorLogs(req, res, next) {
    const limit = parseInt(req.query.limit) || 3; // Default 3 items per page
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const offset = (page - 1) * limit;

    try {
      const [errorLogs, totalLogs] = await Promise.all([
        db('error_logs').select('*').orderBy('timestamp', 'desc').limit(limit).offset(offset),
        db('error_logs').count('id as count').first(),
      ]);

      const totalPages = Math.ceil(totalLogs.count / limit);
      
      // Kirim data ke EJS untuk dirender
      res.render('errorLogs', {
        errorLogs,
        title: 'Logs Error',
        name: req.user.name,
        rol: req.user.role,
        profile_image: req.user.profile_image || 'default.jpg',
        currentPage: page,
        totalPages,
        limit,
      });
      console.log('errorLogs:', errorLogs);
    } catch (err) {
      // Jika terjadi error, lempar ke global error handler
      next(err);
    }
  }

  static async deleteErrorLog(req, res, next) {
    const { id } = req.body; // Ambil id dari body request

    try {
      // Pastikan id log yang akan dihapus ada di database
      const log = await db('error_logs').where({ id }).first();
      
      if (!log) {
        return res.status(404).json({ message: 'Error log not found' }); // Jika tidak ditemukan
      }
  
      // Hapus log dari database
      await db('error_logs').where({ id }).del();
  
      // Kirim respons sukses
      return res.redirect('/error-logs')
    } catch (err) {
      // Tangani error dan lempar ke global error handler
      next(err);
    }
  }
  
}

module.exports = LogsController;
