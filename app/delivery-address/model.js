const { Schema, model } = require("mongoose");

const deliveryAddressSchema = Schems({
  nama: {
    type: String,
    required: [true, 'Nama almat harus diisi'],
    maxlength: [255, 'Panjang maksimal nama alamat 255 karakter'],
  },

  kelurahan: {
    type: String,
    required: [true, 'Kelurahan harus diisi'],
    maxlength: [255, 'Panjang maksimal kelurahan 255 karakter'],
  },

  kecamatan: {
    type: String,
    required: [true, 'Kecamatan harus diisi'],
    maxlength: [255, 'Panjang Kecamatan maksimal 255 karakter']
  },

  kabupaten: {
    type: String,
    required: [true, 'Kabupaten harus diisi'],
    maxlength: [255, 'Panjang kabupaten maksimal 255 karakter']
  },
  provinsi: {
    type: String,
    required: [true, 'Provinsi harus diisi'],
    maxlength: [255, 'Panjang provinsi maksimal 255 karakter']
  },

  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  }
}, { timestamps: true });


module.exports = model('DeliveryAddress', deliveryAddressSchema);