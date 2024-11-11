const express = require('express');
const {
  createOrder,
  getOrdersBySeller,
  updateOrderStatus,
  getOrdersByUser,
} = require('../controllers/orderController');
const router = express.Router();

// Создание новой заявки
router.post('/', createOrder);

// Получение заявок продавца
router.get('/seller/:sellerId', getOrdersBySeller);
router.get('/user/:userId', getOrdersByUser);

// Обновление статуса заявки
router.patch('/:id/status', updateOrderStatus);

module.exports = router;
