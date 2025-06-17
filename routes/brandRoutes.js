const express = require('express');
const router = express.Router();

const brandController = require('../controllers/brand.controller');
const auth = require('../middleware/authMiddleware')

router.post('/add', auth(["ADMIN"]), brandController.addBrand);
router.get('/edit/:id', auth(["ADMIN"]), brandController.getBrand);
router.put('/update/:id', auth(["ADMIN"]), brandController.updateBrand);
router.delete('/delete/:id', auth(["ADMIN"]), brandController.deleteBrand);

router.get('/list', brandController.getBrands);

module.exports = router;