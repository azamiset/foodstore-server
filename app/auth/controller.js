const User = require('../user/model');
const passport = require('passport');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const config = require('../config');
const { getToken } = require('../utils/get-token');

// Membuat endpoint register pada auth
async function register(req, res, next) {
  try {
    // (1) tangkap payload dari request
    const payload = req.body;
    // (2) buat object user baru
    let user = new User(payload);
    // (3) simpan user baru pada MongoDb
    await user.save();
    // (4) berikan respon json ke client
    return res.json(user);

  } catch (err) {
    // (1) cek kemungkinan kesalahan  terkait validasi
    if (err && err.name === 'ValidationError') {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors
      });

      // (2) error lainnya ditangani oleh middleware express
      next(err);
    }
  }
}

async function localStrategy(email, password, done) {
  try {
    // (1) cari user ke MongoDb
    let user = await User.findOne({ email })
      .select('-__v -createdAt -updateAt -cart_items -token');
    // (2) jika user tidak ditemukan, akhiri proses lopgin.
    if (!user) return done();
    // (3) jika user ditemukan, cek apakah password sesuai atau tidak?
    if (bcrypt.compareSync(password, user.password)) {
      ({ password, ...userWithoutPassword } = user.toJSON());
      return done(null, userWithoutPassword);
    }

  } catch (err) {
    done(err, null);
  }

  done();
}

// Membuat endpoint login pada auth
async function login(req, res, next) {
  passport.authenticate('local', async function (err, user) {
    // Jika terjadi error dari hasil 'local strategy' serahkan ke express
    if (err) return next(err);
    // jika 'user' tidak ditemukan, kirimkan respon json ke client
    if (!user) return res.json({ error: 1, message: 'email or password incorret' });

    // Tapi, apabila user ditemukan:
    // (1) buat json web token
    let signed = jwt.sign(user, config.secretKey);
    // (2) SIMPAN TOKEN tersebut ke user terkait
    await User.findOneAndUpdate({ _id: user.id }, { $push: { token: signed } }, { new: true });
    // (3) response ke client
    return res.json({
      message: 'logged in successfully',
      user: user,
      token: signed,
    });
  })(req, res, next);
}

// Membuat endpoint me pada auth
function me(req, res, next) {
  if (!req.user) {
    return res.json({
      error: 1,
      message: 'Your are not login or toekn expired',
    });
  }

  return res.json(req.user);
}

// Membuat endpoint logout pada auth
async function logout(req, res, next) {
  // (1) Dapatkan token dari request
  let token = getToken(req);
  // (2) hapus token dari user
  let user = await User.findOneAndUpdate({ toke: { $in: [token] } },
    { $pull: { token } }, { useFindAndModify: false });
  // cek user atau token
  if (!user || !token) {
    return res.json({
      error: 1,
      message: 'User tidak ditemukan',
    });
  }
  // logout berhasil
  return res.json({
    error: 0,
    message: 'Logout Berhasil',
  });
}

module.exports = { register, localStrategy, login, me, logout };