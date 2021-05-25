var mongoose = require('mongoose');

mongoose.pluralize(null);

var blackUserSchema = new mongoose.Schema({
    email: { type: String, required: true, max: 40 },
    phone: { type: String, required: false, max: 40 },
    companies: { type: [Object] },
    report_date: { type: Date },
    exported: { type: Boolean }
})

// Export the model
module.exports = mongoose.model('black_user', blackUserSchema);