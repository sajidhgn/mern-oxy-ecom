const express = require('express');
const router = express.Router();

const productController = require('../controllers/product.controller');
const auth = require('../middleware/authMiddleware')

router.post('/add', auth(["ADMIN"]), productController.addProduct);
router.get('/edit/:id', auth(["ADMIN"]), productController.getProduct);
router.put('/update/:id', auth(["ADMIN"]), productController.updateProduct);
router.delete('/delete/:id', auth(["ADMIN"]), productController.deleteProduct);

module.exports = router;