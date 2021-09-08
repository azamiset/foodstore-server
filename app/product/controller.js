const fs = require('fs');
const path = require('path');

const Produk = require('./model');
const config = require('../config');


// controller untuk membuat / menambahkan daftar produk
async function store(req, res, next) {
  try {
    // Terima data dari request body atau form
    let payload = req.body;

    // Periksa apakah ada file yang di upload?
    if (req.file) {
      // (1) Jika ada, baca lokasi sementara file yang di upload
      let temp_path = req.file.path;
      // (2) baca extensi file yang di upload
      let originalExt = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1];
      // (3) ubah nama file yang baru dengan extensi yang lama
      let filename = req.file.filename + '.' + originalExt;
      // (4) tetapkan lokasi file yang baru
      let target_path = path.resolve(config.rootPath, `public/upload/${filename}`);

      // (1) baca file yang masih dilokasi sementara
      const src = fs.createReadStream(temp_path);
      // (2) pindahkan file ke lokasi permanen
      const dest = fs.createWriteStream(target_path);
      // (3) mulai pindahkan file dari 'src' ke 'dest'
      src.pipe(dest);

      // Setelah file berhasil di upload
      src.on('end', async () => {
        // (1) buat produk baru dari data payload beserta url image
        let product = new Produk({ ...payload, image_url: filename });

        // (2) simpan data product yang baru dibuat ke mongo db
        await product.save();

        // (3) berikan respon 'json' berupa data product yang baru dibuat kepada client
        return res.json(product);
      })

      // Jika tidak ada file yang di upload!
    } else {
      // (1) buat product baru menggunakan data dari 'payload'
      let product = new Produk(payload);

      // (2) simpan data product yang baru dibuat ke mongo db
      await product.save();

      // (3) berikan respon kepada client dengan mengembalikan 'json' product yang baru dibuat
      return res.json(product);
    }

    // Apabila ada error..?
  } catch (err) {
    // cek tipe error / jika error diketahui!
    if (err && err.name === 'ValidationError') {
      // kembalikan respon 'json' kepada client
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }

    // Jika error tidak diketahui, gunakan method next() agar express meresponse error tersebut.
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
    let { limit = 10, skip = 0 } = req.query;

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

// controller untuk update product
async function update(req, res, next) {
  try {
    let payload = req.body;

    if (req.file) {
      let tmp_path = req.file.path;
      let originalExt = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1];
      let filename = req.file.filename + '.' + originalExt;
      let target_path = path.resolve(config.rootPath, `public/upload/${filename}`);

      const src = fs.createReadStream(tmp_path);
      const dest = fs.createWriteStream(target_path);
      src.pipe(dest);

      src.on('end', async () => {
        // (1) cari product yang akan di update
        let product = new Produk({ ...payload, image_url: filename });

        // (2) dapatkan absolut path ke gambar dari product yang akan di update
        let currentImage = `${config.rootPath}/public/upload/${product.image_url}`;

        // (3) cek apakah apakah absolut path memang ada di system
        if (fs.existsSync(currentImage)) {
          // (4) jika ada, hapus dari file system
          fs.unlinkSync(currentImage);
        }

        // (5) update produk ke mongo db
        product = await Produk.findOneAndUpdate({ _id: req.params.id }, { ...payload, image_url: filename }, { new: true, runValidators: true });

        return res.json(product);
      });

      src.on('error', async () => {
        next(err);
      });
    } else {
      // (6) update product jika tidak ada file di upload
      let product = await Produk.findOneAndUpdate({ _id: req.params.id }, { ...payload }, { new: true, runValidators: true });
      return res.json(product);
    }
  } catch (err) {
    // (7) jika ada error, cek tipe error 
    if (err && err.name === 'ValidationError') {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }

    // (8) jika terjadi kesalahan gunakan method next() agar express meresponse error tersebut.
    next(err);
  }
}

// controller untuk menghapus data product
async function destroy(req, res, next) {
  try {
    let product = await Produk.findOneAndDelete({ _id: req.params.id });
    let currentImage = `${config.rootPath}/public/upload/${product.image_url}`;

    if (fs.existsSync(currentImage)) {
      fs.unlinkSync(currentImage);
    }

    return res.json(product);
  } catch (err) {
    next(err)
  }
}


module.exports = { store, index, update, destroy };