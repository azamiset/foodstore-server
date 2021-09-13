const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const { model, Schema } = mongoose;
const HASH_ROUND = 10;

let userSchema = Schema({
  full_name: {
    type: String,
    required: [true, 'Nama harus diisi'],
    maxlength: [255, 'Panjang nama harus antara 3 - 255 karakter'],
    minlength: [3, 'Panjang nama harus antara 3 - 255 karakter']
  },

  customer_id: {
    type: Number
  },

  email: {
    type: String,
    required: [true, 'Email harus diisi'],
    maxlength: [255, 'Panjang email maximal 255 karakter']
  },

  password: {
    type: String,
    required: [true, 'Password harus diisi'],
    maxlength: [255, 'Panjang password maximal 255 karakter']
  },

  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },

  token: [String]

}, { timestamps: true });

// Validasi email dengan mongoose custom validation
userSchema.path('email').validate(function (value) {
  // (1) email reguler expression
  const EMAIL_RE = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
  /* 
    (2) test email, hasilnya adalah 'true' atu 'false'.
    - jika 'true' maka validasi berhasil.
    - jika 'false' maka validasi gagal.
     */
  return EMAIL_RE.test(value);
}, attr => `${attr.value} harus merupakan email yang valid!`);

// Validasi apakah email sudah terdaftar?
userSchema.path('email').validate(async function (value) {
  try {
    // (1) lakukan pencarian ke _collection_user berdasarkan email
    const count = await this.model('User').count({ email: value });
    /* 
    (2) kode ini mengindikasikan bahwa jika user ditemukan akan mengembalikan 'false', jika tidak ditemukan mengembalikan 'true'.
    - jika 'false' maka validasi gagal.
    - jika 'true' maka validasi berhasil.
    */
    return count;

  } catch (err) {
    throw err;
  }
}, attr => `${attr.value} sudah terdaftar`);

// Hashing Password pada Mongoose Hooks
userSchema.pre('save', function (next) {
  this.password = bcrypt.hashSync(this.password, HASH_ROUND);
  next();
})

// Auto Increment pada Schema
userSchema.plugin(AutoIncrement, { inc_field: 'customer_id' });


module.exports = model('user', userSchema);