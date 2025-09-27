const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const productController = require('../controllers/productController');


// POST /api/v1/products (multipart/form-data) field name: image
router.post('/', upload.single('image'), productController.createProduct);
// GET /api/v1/products
router.get('/', productController.getProducts);
// GET /api/v1/products/:id
router.get('/:id', productController.getProduct);
// PUT /api/v1/products/:id (use multipart if updating image)
router.put('/:id', upload.single('image'), productController.updateProduct);
// DELETE /api/v1/products/:id
router.delete('/:id', productController.deleteProduct);


module.exports = router;