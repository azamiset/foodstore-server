// (1) IMPORT exprss dan multer
const router = require('express').Router()
const multer = require('multer');

// (2) import controller delivery-address
const addressController = require('./controller');


// (3.1) definisikan route untuk endpoint 'create' alamat pengiriman
router.post('/delivery-address', multer().none(), addressController.store);

// (3.2) definisikan route untuk endpoint 'update' alamat pengiriman
router.put('/delivery-address', multer().none(), addressController.update);

// (3.3) definisikan route untuk endpoint 'delete' alamat pengiriman
router.delete('/delivery-address', multer().none(), addressController.destroy);

// (3.4) definisikan route untuk endpoint 'delete' alamat pengiriman
router.get('/delivery-address', multer().none(), addressController.index);


module.exports = router;