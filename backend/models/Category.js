const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Category name is required'],
        unique: true,
        trim: true,
        maxlength: [50, 'Category name cannot be more than 50 characters']
    },
    slug: {
        type: String,
        unique: true,
        sparse: true
    },
    description: {
        type: String,
        maxlength: [200, 'Description cannot be more than 200 characters']
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

// Generate slug before saving
CategorySchema.pre('save', function(next) {
    if (this.name && this.isModified('name')) {
        this.slug = this.name
            .toLowerCase()
            .replace(/[^a-zA-Z0-9 ]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');
    }
    next();
});

module.exports = mongoose.model('Category', CategorySchema);