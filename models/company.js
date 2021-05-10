var mongoose = require('mongoose');

mongoose.pluralize(null);

var companySchema = new mongoose.Schema({
    name: { type: String, required: true, max: 40 },
    email: { type: String, required: true, max: 40 },
    token: { type: String, required: true, max: 100 },
    icon: { type: String, required: true, max: 1000 },
    qty_exposed_users: { type: Number, required: true },
})

// Export the model
module.exports = mongoose.model('company', companySchema);