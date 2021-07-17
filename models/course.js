var mongoose = require('mongoose');

var courseSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    image: {
        type: String,
        require: true
    }
}, {
    timestamps: true
});

var Courses = mongoose.model('Course', courseSchema);

module.exports = Courses;