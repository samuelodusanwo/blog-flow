const mongoose = require('mongoose');

const TagSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Tag name is required'],
        unique: true,
        trim: true,
        lowercase: true,
        maxlength: [30, 'Tag name cannot be more than 30 characters']
    },
    slug: {
        type: String,
        unique: true
    },
    description: String
}, { timestamps: true });

TagSchema.pre('save', function(next) {
    if (this.name && this.isModified('name')) {
        this.slug = this.name
            .toLowerCase()
            .replace(/[^a-zA-Z0-9 ]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');
    }
    next();
});

module.exports = mongoose.model('Tag', TagSchema);