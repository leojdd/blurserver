var mongoose = require('mongoose');

mongoose.pluralize(null);

var phraseSchema = new mongoose.Schema({
    code: { type: Number, required: true },
    language: { type: String },
    description: { type: String },
    phrase: { type: String }
})

// Export the model
module.exports = mongoose.model('phrase', phraseSchema);