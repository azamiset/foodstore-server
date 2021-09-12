// (1) import router dari Express
const router = require('express').Router();
// (2) import multer
const multer = require('multer');
// (3) import tag controller
const tagController = require('./controller');


// (4.1) router Tag untuk endpoint store
router.post('/tags', multer().none(), tagController.store);

// (4.2) router Tag untuk endpoint update
router.put('/tags/:id', multer().none(), tagController.update);

// (4.3) router Tag untuk endpoint delete
router.delete('/tags/:id', multer().none(), tagController.destroy);


// (5) export router agar bisa digunakan di app.js
module.exports = router;