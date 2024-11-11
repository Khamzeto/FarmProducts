// routes/productRoutes.js

const express = require('express');
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getTopDiscountedProducts,
  getLatestProducts,
  getProductsByUserId, // Import the new controller function
} = require('../controllers/productController');

const router = express.Router();

// Route to get top discounted products
router.get('/top-discounted', getTopDiscountedProducts);

// Route to get latest products
router.get('/latest', getLatestProducts);

// Route to get all products
router.get('/', getAllProducts);

// Route to get all products by a specific user ID
router.get('/user/:userId', getProductsByUserId); // New route for products by userId

// Route to get a single product by ID
router.get('/:id', getProductById);

// Route to create a new product
router.post('/', createProduct);

// Route to update a product by ID
router.put('/:id', updateProduct);

// Route to delete a product by ID
router.delete('/:id', deleteProduct);

module.exports = router;
