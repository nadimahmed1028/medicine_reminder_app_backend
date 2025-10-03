const mongoose = require('mongoose');

const MedicineSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    frequency: {
        type: String,
        required: true,
    },
    startTime: {
        type: String,
        required: true,
    },
    minInterval: {
        type: Number, // Interval in hours
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    schedule: {
        type: [Date], // Store calculated reminder times
        required: true,
    },
});

const Medicine = mongoose.model('Medicine', MedicineSchema);

module.exports = Medicine;
