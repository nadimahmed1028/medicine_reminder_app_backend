/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');

const MedicineSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        frequency: {
            type: Number,
            required: true,
        },
        startDate: {
            type: Date,
            required: true,
        },
        startTime: {
            type: String,
            required: true,
        },
        minInterval: {
            type: Number,
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        schedule: {
            type: [Date],
            required: true,
        },
    },
    { timestamps: true },
);

const Medicine = mongoose.model('Medicine', MedicineSchema);

module.exports = Medicine;
