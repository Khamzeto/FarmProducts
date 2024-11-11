// routes/categoryRoutes.js

const express = require('express');
const {
  getCategories,
  createCategory,
  addSubcategory,
  deleteCategory,
  createCategoryWithSubcategories,
} = require('../controllers/categoryController');

const router = express.Router();

// Получение всех категорий
router.get('/', getCategories);

// Создание новой категории

router.post('/bulk', createCategoryWithSubcategories);

// Добавление подкатегории к категории
router.post('/:categoryId/subcategories', addSubcategory);

// Удаление категории
router.delete('/:categoryId', deleteCategory);

module.exports = router;
