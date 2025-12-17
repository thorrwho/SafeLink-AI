const mongoose = require('mongoose');

const ScanLogSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['text', 'url', 'file'],
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    result: {
        risk_score: {
            type: Number,
            required: true,
        },
        label: {
            type: String,
        },
        explanation: {
            type: String,
        },
        keywords: [{
            type: String
        }]
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('ScanLog', ScanLogSchema);
