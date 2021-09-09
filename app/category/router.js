// (1) Dapatkan router dari Express
const router = require('express').Router();
// (2) Import Multer untuk menangani form data
const multer = require('multer');
// (3) Import Category controller
const categoryController = require('./controller');


// (4.1) Endpoint untuk membuat kategori baru
router.post('/categories', multer().none(), categoryController.store);

// (4.2) Endpoint untuk merubah kategori berdasarkan id
router.put('/categories/:id', multer().none(), categoryController.update);

// (4.2) Endpoint untuk menghapus kategori berdasarkan id
router.delete('/categories/:id', multer().none(), categoryController.destroy);


// (5) Export Router agar bisa dipakai di file app.js
module.exports = router;