const express = require('express');
const router = express.Router();

const orderController = require('../controllers/order.controller');
const auth = require('../middleware/authMiddleware')

router.post('/add', auth(["ADMIN"]), orderController.addCategory);

module.exports = router;