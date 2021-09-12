// (1) import mongoose;
const mongoose = require('mongoose');

// (2) dapatkan module model dan schema dari package mongoose
const { model, Schema } = mongoose;

// (3) buat schema 
const tagSchema = ({
  name: {
    type: String,
    minlength: [3, 'Panjang nama kategori minimal 3 karakter'],
    maxlength: [20, 'Panjang nama kategori maximal 20 karakter'],
    required: [true, 'Nama kategori harus diisi'],
  }
});

// (4) buat model berdasarkan schema sekaligus export
module.exports = model('Tag', tagSchema);
