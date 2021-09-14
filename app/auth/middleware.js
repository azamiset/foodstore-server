const { getToken } = require('../utils/get-token');
const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../user/model');

function decodeToken() {
  return async function (req, res, next) {
    try {
      let token = getToken(req);

      if (!token) return next();

      req.user = jwt.verify(token, config.secretKey);

      let user = User.findOne({ token: { $in: [token] } });

      // token expire jika user tidak ditemukan
      if (!user) {
        return res.json({
          error: 1,
          message: 'Token Expired',
        });
      }

    } catch (err) {
      //  (1) Tangani error yang terkait JsonWebTokenError
      if (err && err.name === 'JsonWebTokenError') {
        return res.json({
          error: 1,
          message: err.message,
        });
      }

      // (2) tangani error lainnya
      next(err);
    }

    return next();
  }
}


module.exports = { decodeToken };