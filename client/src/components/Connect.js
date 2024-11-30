const mongoose = require('mongoose');

const CertificateSchema = new mongoose.Schema({
    recipientName: { type: String, required: true },
    completionDate: { type: Date, required: true },
    certificateLink: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Certificate', CertificateSchema);
