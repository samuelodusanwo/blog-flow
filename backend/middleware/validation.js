const { body, validationResult } = require('express-validator');

// Validation middleware
exports.validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }
    next();
};

// Validation rules
exports.postValidationRules = () => {
    return [
        body('title').notEmpty().withMessage('Title is required').isLength({ max: 200 }),
        body('content').notEmpty().withMessage('Content is required'),
        body('excerpt').notEmpty().withMessage('Excerpt is required').isLength({ max: 500 }),
        body('category').isMongoId().withMessage('Valid category ID is required')
    ];
};

exports.categoryValidationRules = () => {
    return [
        body('name').notEmpty().withMessage('Category name is required').isLength({ max: 50 })
    ];
};

exports.userValidationRules = () => {
    return [
        body('username').isLength({ min: 3, max: 30 }).withMessage('Username must be between 3-30 characters'),
        body('email').isEmail().withMessage('Please enter a valid email'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    ];
};