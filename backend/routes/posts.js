const express = require('express');
const {
    getPosts,
    getPost,
    createPost,
    updatePost,
    deletePost,
    getPostsByCategory
} = require('../controllers/postController');
const { protect } = require('../middleware/auth');
const { postValidationRules, validate } = require('../middleware/validation');

const router = express.Router();

router.route('/')
    .get(getPosts)
    .post(protect, postValidationRules(), validate, createPost);

router.route('/:id')
    .get(getPost)
    .put(protect, postValidationRules(), validate, updatePost)
    .delete(protect, deletePost);

router.route('/category/:categoryId')
    .get(getPostsByCategory);

module.exports = router;