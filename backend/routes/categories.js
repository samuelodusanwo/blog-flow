const express = require('express');
const {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory
} = require('../controllers/categoryController');
const { protect, authorize } = require('../middleware/auth');
const { categoryValidationRules, validate } = require('../middleware/validation');

const router = express.Router();

router.route('/')
    .get(getCategories)
    .post(protect, authorize('admin'), categoryValidationRules(), validate, createCategory);

router.route('/:id')
    .get(getCategory)
    .put(protect, authorize('admin'), categoryValidationRules(), validate, updateCategory)
    .delete(protect, authorize('admin'), deleteCategory);

module.exports = router;