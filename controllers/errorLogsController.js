const { db } = require('../config/connect');

// Controller untuk mengambil data error logs
const getErrorLogs = async (req, res, next) => {
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
        title:'Logs Error',
        name: req.user.name,
        rol: req.user.role,
        profile_image: req.user.profile_image || 'default.jpg',
        currentPage: page,
        totalPages,
        limit,
    });
  } catch (err) {
    // Jika terjadi error, lempar ke global error handler
    next(err);
  }
};

// const ErrorLog = getErrorLogs ();
// exports.deleteErrorLog = async (req, res) => {
//   try {
//     const { id } = req.params.id; // Mengambil ID dari parameter URL

//     // Cari dan hapus log berdasarkan ID
//     const deletedLog = await ErrorLog.findByIdAndDelete(id);

//     if (!deletedLog) {
//       return res.status(404).send({ message: 'Error log not found' });
//     }

//     // Kirimkan respon sukses dan arahkan kembali ke halaman log
//     req.flash('success', 'Error log deleted successfully');
//     res.redirect('/error-logs');
//   } catch (error) {
//     console.error('Error deleting log:', error);
//     req.flash('error', 'An error occurred while deleting the log');
//     res.redirect('/error-logs');
//   }
// };


module.exports = {
  getErrorLogs,
};
