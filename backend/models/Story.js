const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    contributions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Contribution' }],
}, { timestamps: true });

const Story = mongoose.model('Story', storySchema);
module.exports = Story;