const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const blogLabelSchema = new Schema({
    'title': {
        type: String,
        required: true,
        unique: [true, "Label title is required"]
    },
    'color': {
        type: String,
        default: 'grey',
        unique: true
    }
})

const BlogLabel = mongoose.model('BlogLabel', blogLabelSchema);

module.exports = BlogLabel;
