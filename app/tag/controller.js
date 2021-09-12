const Tag = require('./model');

// Membuat endpoint store untuk Tag
async function store(req, res, next) {
  try {
    // (1) dapatkan data dari request yang dikirimkan  client
    let payload = req.body;
    // (2) buat object Tag baru berdasarkan payload
    let tag = new Tag(payload);
    // (3) simpan tag ke MomngoDb
    await tag.save();
    // (4) respon json ke client dengan data yang baru disimpan
    return res.json(tag);

  } catch (err) {
    // (5) Tangani kemungkinan error validasi 
    if (err && err.name === 'ValidationError') {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }
    // atau error lainnya
    next(err);
  }
}

// Membuat endpoint update untuk Tag
async function update(req, res, next) {
  try {
    // (1) dapatkan data dari request yang dikirimkan  client
    let payload = req.body;
    // (2) cari data object Tag berdasarkan id, lalu update.
    let tag = await Tag.findOneAndUpdate({ _id: req.params.id }, payload, { new: true, runValidators: true });
    // (3) respon json ke client dengan data yang baru disimpan
    return res.json(tag);

  } catch (err) {
    // (4) Tangani kemungkinan error validasi 
    if (err && err.name === 'ValidationError') {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }
    // atau error lainnya
    next(err);
  }
}

// Membuat endpoint delete untuk Tag
async function destroy(req, res, next) {
  try {
    let tag = await Tag.findByIdAndDelete({ _id: req.params.id });
    return res.json(tag);

  } catch (err) {
    next(err);
  }
}

module.exports = { store, update, destroy };