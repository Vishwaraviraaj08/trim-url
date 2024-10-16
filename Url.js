const mongoose = require('mongoose');

const UrlSchema = new mongoose.Schema({
    endpoint: { type: String, required: true, unique: true },
    redirectTo: { type: String, required: true },
});

module.exports = mongoose.model('Url', UrlSchema);
