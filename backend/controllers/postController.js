const Post = require('../models/Post');
const Category = require('../models/Category');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all posts
// @route   GET /api/posts
// @access  Public
exports.getPosts = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, category, search, published = true } = req.query;
        
        let query = {};
        
        // Filter by published status
        if (published !== 'all') {
            query.published = published === 'true';
        }
        
        // Filter by category
        if (category) {
            query.category = category;
        }
        
        // Search in title and content
        if (search) {
            query.$text = { $search: search };
        }

        const posts = await Post.find(query)
            .populate('author', 'username profile')
            .populate('category', 'name slug')
            .populate('tags', 'name slug')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Post.countDocuments(query);

        res.status(200).json({
            success: true,
            count: posts.length,
            total,
            pages: Math.ceil(total / limit),
            data: posts
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single post
// @route   GET /api/posts/:id
// @access  Public
exports.getPost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('author', 'username profile firstName lastName')
            .populate('category', 'name slug description')
            .populate('tags', 'name slug');

        if (!post) {
            return next(new ErrorResponse('Post not found', 404));
        }

        // Increment views
        post.views += 1;
        await post.save();

        res.status(200).json({
            success: true,
            data: post
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create new post
// @route   POST /api/posts
// @access  Private
exports.createPost = async (req, res, next) => {
    try {
        // Add author to req.body
        req.body.author = req.user.id;

        const post = await Post.create(req.body);

        // Populate the created post
        const populatedPost = await Post.findById(post._id)
            .populate('author', 'username profile')
            .populate('category', 'name')
            .populate('tags', 'name');

        res.status(201).json({
            success: true,
            data: populatedPost
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private
exports.updatePost = async (req, res, next) => {
    try {
        let post = await Post.findById(req.params.id);

        if (!post) {
            return next(new ErrorResponse('Post not found', 404));
        }

        // Make sure user is post author or admin
        if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
            return next(new ErrorResponse('Not authorized to update this post', 401));
        }

        post = await Post.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        }).populate('author', 'username profile')
          .populate('category', 'name')
          .populate('tags', 'name');

        res.status(200).json({
            success: true,
            data: post
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
exports.deletePost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return next(new ErrorResponse('Post not found', 404));
        }

        // Make sure user is post author or admin
        if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
            return next(new ErrorResponse('Not authorized to delete this post', 401));
        }

        await Post.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get posts by category
// @route   GET /api/posts/category/:categoryId
// @access  Public
exports.getPostsByCategory = async (req, res, next) => {
    try {
        const posts = await Post.find({ 
            category: req.params.categoryId,
            published: true 
        })
        .populate('author', 'username profile')
        .populate('category', 'name slug')
        .populate('tags', 'name slug')
        .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: posts.length,
            data: posts
        });
    } catch (error) {
        next(error);
    }
};