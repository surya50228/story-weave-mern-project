const mongoose = require('mongoose');

const contributionSchema = new mongoose.Schema({
    text: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    story: { type: mongoose.Schema.Types.ObjectId, ref: 'Story', required: true },
}, { timestamps: true });

const Contribution = mongoose.model('Contribution', contributionSchema);
module.exports = Contribution;