/* eslint-disable comma-dangle */
/* eslint-disable no-plusplus */
/* eslint-disable object-curly-newline */
/* eslint-disable no-use-before-define */
const express = require('express');

const router = express.Router();
const Medicine = require('../models/Medicine');
const auth = require('../middleware/authMiddleware');

// CREATE a medicine reminder (protected)
router.post('/reminders', auth, async (req, res) => {
    try {
        const { name, frequency, startTime, minInterval } = req.body;

        const schedule = calculateSchedule(startTime, frequency, minInterval);

        const newMedicine = new Medicine({
            name,
            frequency,
            startTime,
            minInterval,
            userId: req.user, // Use user ID from JWT
            schedule,
        });

        await newMedicine.save();
        res.status(201).json(newMedicine);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET reminders for authenticated user
router.get('/reminders', auth, async (req, res) => {
    try {
        const medicines = await Medicine.find({ userId: req.user });
        res.json(medicines);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// UPDATE reminder (protected)
router.put('/reminders/:id', auth, async (req, res) => {
    try {
        const { name, frequency, startTime, minInterval } = req.body;
        const updatedMedicine = await Medicine.findOneAndUpdate(
            { _id: req.params.id, userId: req.user },
            { name, frequency, startTime, minInterval },
            { new: true }
        );
        res.json(updatedMedicine);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE reminder (protected)
router.delete('/reminders/:id', auth, async (req, res) => {
    try {
        await Medicine.findOneAndDelete({ _id: req.params.id, userId: req.user });
        res.json({ message: 'Reminder deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Helper function for schedule calculation
function calculateSchedule(startTime, frequency, minInterval) {
    const schedule = [];
    const startDate = new Date(`2022-01-01T${startTime}:00`);

    for (let i = 0; i < frequency; i++) {
        const reminderTime = new Date(startDate);
        reminderTime.setHours(reminderTime.getHours() + minInterval * i);
        schedule.push(reminderTime);
    }
    return schedule;
}

module.exports = router;
