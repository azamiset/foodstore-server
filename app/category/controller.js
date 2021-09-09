const { json } = require('express');
const Category = require('./model');


// Membuat Endpoint Create Category
async function store(req, res, next) {
  try {
    // (1) tangkap payload dari client request
    let payload = req.body;
    // (2) buat kategori baru dengan model Category
    let category = new Category(payload);
    // (3) simpan kategori baru tadi ke MongoDb
    await category.save();
    // (4) respon ke client dengan data Category yang baru dibuat
    return res.json(category);

    // Jika terjadi error?
  } catch (err) {
    // (1) Tangani error yang disebabkan validasi dari MongoDb
    if (err && err.name === 'ValidationError') {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }

    // (2) Tangani error yang tidak diketahui
    next(err);
  }
}

// Membuat Endpoint Update Category
async function update(req, res, next) {
  try {
    let payload = req.body;

    let category = await Category.findByIdAndUpdate({ _id: req.params.id }, payload, { new: true, runValidators: true });

    return res.json(category);

  } catch (err) {
    if (err && err.name === 'ValidationError') {
      return json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }

    next(err);
  }
}

// Membuat Endpoint Delete Category
async function destroy(req, res, next) {
  try {
    // (1) cari dan hapus category di MongoDb berdasarkan field _id
    let deleted = await Category.findOneAndDelete({ _id: req.params.id });
    // (2) respon ke client dengan data kategory yang barusan dihapus
    return res.json(deleted);

  } catch (err) {
    // (3) handle kemungkinan error
    next(err);
  }
}


module.exports = { store, update, destroy };