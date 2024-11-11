// controllers/categoryController.js

const Category = require('../models/Category');

// Получение всех категорий с подкатегориями
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().select('name image subcategories');
    const formattedCategories = categories.map(category => ({
      id: category._id,
      name: category.name,
      image: category.image,
      subcategories: category.subcategories.map(sub => ({
        id: sub._id,
        name: sub.name,
      })),
    }));
    res.status(200).json(formattedCategories);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении категорий', error });
  }
};

// Создание категории вместе с подкатегориями
exports.createCategoryWithSubcategories = async (req, res) => {
  const categoriesData = req.body;

  try {
    const createdCategories = await Promise.all(
      categoriesData.map(async categoryData => {
        if (!categoryData.name) {
          throw new Error('Категория должна иметь название');
        }
        const category = new Category({
          name: categoryData.name,
          image: categoryData.image, // Save the image
          subcategories: categoryData.subcategories || [],
        });
        await category.save();
        return category;
      })
    );
    res.status(201).json({ success: true, categories: createdCategories });
  } catch (error) {
    console.error('Ошибка при создании категории с подкатегориями:', error);
    res
      .status(400)
      .json({ message: 'Ошибка при создании категории с подкатегориями', error });
  }
};

// Добавление подкатегории к существующей категории
exports.addSubcategory = async (req, res) => {
  const { categoryId } = req.params;
  const { name } = req.body;

  try {
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Категория не найдена' });
    }

    category.subcategories.push({ name });
    await category.save();

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при добавлении подкатегории', error });
  }
};

// Удаление категории
exports.deleteCategory = async (req, res) => {
  const { categoryId } = req.params;

  try {
    const category = await Category.findByIdAndDelete(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Категория не найдена' });
    }

    res.status(200).json({ message: 'Категория удалена' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при удалении категории', error });
  }
};
