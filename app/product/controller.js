const fs = require('fs');
const path = require('path');

const Produk = require('./model');
const config = require('../config');

// controller untuk membuat / menambahkan daftar produk
async function store(req, res, next) {
  try {
    let payload = req.body;

    if (req.file) {
      let temp_path = req.file.path;
      let originalExt = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1];
      let filename = req.file.filename + '.' + originalExt;
      let target_path = path.resolve(config.rootPath, `public/upload/${filename}`);

      const src = fs.createReadStream(temp_path);
      const dest = fs.createWriteStream(target_path);
      src.pipe(dest);

      src.on('end', async () => {
        let product = new Produk({ ...payload, image_url: filename });
        await product.save();
        return res.json(product);
      })
    } else {
      let product = new Produk(payload);
      await product.save();
      return res.json(product);
    }
  } catch (err) {
    // cek tipe error 
    if (err && err.name === 'ValidationError') {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }
    // jika terjadi kesalahan gunakan method next() agar express meresponse error tersebut.
    next(err);
  }
}

// controller untuk mendapatkan / menampilkan semua data product
/* 
async function index(req, res, next) {
  try {
    let product = await Produk.find();
    return res.json(product);
  } catch (err) {
    next(err);
  }
}
 */

// pagination / mendapatkan sebagian data product

async function index(req, res, next) {
  try {
    let { limit = 2, skip = 0 } = req.query;

    let product =
      await Produk
        .find()
        .limit(parseInt(limit))
        .skip(parseInt(skip));

    return res.json(product);
  } catch (err) {
    next(err);
  }
}



module.exports = { store, index };