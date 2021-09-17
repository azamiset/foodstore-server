// (1) import `router` dan `multer`
const router = require('express').Router();
const multer = require('multer');

// (2) import `cartController`
const cartController = require('./controller');

// (3.1) route untuk `update` cart
router.put('/carts', multer().none(), cartController.update);

// (3.2) route untuk `daftar item` cart
router.get('/carts', cartController.index);

// (4) export router
module.exports = router;