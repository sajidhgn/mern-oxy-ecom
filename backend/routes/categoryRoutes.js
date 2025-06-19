const express = require('express');
const router = express.Router();

const categoryController = require('../controllers/category.controller');
const auth = require('../middleware/authMiddleware')

router.post('/add', auth(["ADMIN"]), categoryController.addCategory);
router.get('/edit/:id', auth(["ADMIN"]), categoryController.getCategory);
router.put('/update/:id', auth(["ADMIN"]), categoryController.updateCategory);
router.delete('/delete/:id', auth(["ADMIN"]), categoryController.deleteCategory);

router.get('/list', categoryController.getCategories);

module.exports = router;