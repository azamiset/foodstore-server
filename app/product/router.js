const router = require('express').Router();
const multer = require('multer');
const os = require('os');

const productController = require('./controller');


// router untuk menambahkan data product
router.post('/products', multer({ dest: os.tmpdir() }).single('image'), productController.store);

// router untuk mendapatkan data produk
router.get('/products', productController.index);

// router untuk update data produk
router.put('/products/:id', multer({ dest: os.tmpdir() }).single('image'), productController.update);

// router untuk menghapus data product
router.delete('/products/:id', productController.destroy);


module.exports = router;