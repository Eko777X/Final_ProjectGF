const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = {
  authenticate: (req, res, next) => {
    const token = req.cookies.token;
    
    if (!token) {
      return res.status(401).json({ message: 'Access token is missing or invalid.' });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded; // Tambahkan data pengguna ke req
      next(); // Lanjutkan ke route berikutnya
    } catch (error) {
      console.error('Invalid token:', error);
      res.status(401).json({ message: 'Invalid or expired token.' });
    }
  },

  authorizeRole: (allowedRoles) => {
    return (req, res, next) => {
  
      const userRole = req.user?.role;

      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({ message: 'You do not have permission to access this resource.' });
      }

      next();
    };
  },
};

module.exports = authMiddleware;