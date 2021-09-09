const mongoose = require('mongoose');
const { model, Schema } = mongoose;


let categorySchema = Schema({
  name: {
    type: String,
    minlength: [3, 'Panjang nama Kategori minimal 3 karakter'],
    maxlength: [255, 'Panjang nama Kategori maximal 255 karakter'],
    require: [true, 'Nama Kategori harus diisi'],
  }
});


module.exports = model('Category', categorySchema);