const router = require('express').Router();
const multer = require('multer');
const os = require('os');

const productController = require('./controller');

// router untuk menambahkan product
router.post('/products', multer({ dest: os.tmpdir() }).single('image'), productController.store);

// router untuk mendapatkan produk
router.get('/products', productController.index);

module.exports = router;