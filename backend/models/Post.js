const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: [200, 'Title cannot be more than 200 characters']
    },
    content: {
        type: String,
        required: [true, 'Content is required'],
    },
    excerpt: {
        type: String,
        required: true,
        maxlength: [500, 'Excerpt cannot be more than 500 characters']
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Author is required']
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Category is required']
    },
    tags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag'
    }],
    published: {
        type: Boolean,
        default: false
    },
    slug: {
        type: String,
        unique: true,
        sparse: true
    },
    featuredImage: String,
    readTime: {
        type: Number,
        default: 0
    },
    views: {
        type: Number,
        default: 0
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, { 
    timestamps: true 
});

// Pre-save middleware
PostSchema.pre('save', function(next) {
    // Generate slug
    if (this.title && this.isModified('title')) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^a-zA-Z0-9 ]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');
    }
    
    // Calculate read time (approx 200 words per minute)
    if (this.content && this.isModified('content')) {
        const wordCount = this.content.split(/\s+/).length;
        this.readTime = Math.ceil(wordCount / 200);
    }
    
    // Generate excerpt if not provided
    if (!this.excerpt && this.content) {
        this.excerpt = this.content.substring(0, 150) + '...';
    }
    
    next();
});

// Index for better performance
PostSchema.index({ title: 'text', content: 'text' });
PostSchema.index({ category: 1, published: 1, createdAt: -1 });

module.exports = mongoose.model('Post', PostSchema);