// routes/authRoutes.js

const express = require('express');
const {
  sendVerificationCode,
  confirmCode,
  updateUserRole,
  getUserById,
  updateUserInfo,
  getSellersWithProducts,
  deleteUser, // Импортируем контроллер для удаления пользователя
  getAllUsers, // Импортируем контроллер для получения всех пользователей
} = require('../controllers/authController');

const router = express.Router();

router.post('/send-code', sendVerificationCode);
router.post('/confirm-code', confirmCode);
router.put('/update-role', updateUserRole);
router.get('/user/:userId', getUserById);
router.patch('/:userId', updateUserInfo);
router.get('/sellers', getSellersWithProducts);
router.delete('/user/:userId', deleteUser); // Новый маршрут для удаления пользователя
router.get('/users', getAllUsers); // Новый маршрут для получения всех пользователей

module.exports = router;
