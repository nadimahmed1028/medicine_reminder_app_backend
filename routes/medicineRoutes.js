/* eslint-disable object-curly-newline */
/* eslint-disable no-use-before-define */
const express = require('express');

const router = express.Router();
const Medicine = require('../models/Medicine');

// Create a new medicine reminder
router.post('/reminders', async (req, res) => {
    try {
        const { name, frequency, startTime, minInterval, userId } = req.body;

        const schedule = calculateSchedule(startTime, frequency, minInterval);

        const newMedicine = new Medicine({
            name,
            frequency,
            startTime,
            minInterval,
            userId,
            schedule,
        });

        await newMedicine.save();
        res.status(201).json(newMedicine);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Read all reminders for a specific user
router.get('/reminders/:userId', async (req, res) => {
    try {
        const medicines = await Medicine.find({ userId: req.params.userId });
        res.json(medicines);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update a medicine reminder
router.put('/reminders/:id', async (req, res) => {
    try {
        const { name, frequency, startTime, minInterval } = req.body;
        const updatedMedicine = await Medicine.findByIdAndUpdate(
            req.params.id,
            {
                name,
                frequency,
                startTime,
                minInterval,
            },
            // eslint-disable-next-line comma-dangle
            { new: true }
        );
        res.json(updatedMedicine);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete a medicine reminder
router.delete('/reminders/:id', async (req, res) => {
    try {
        await Medicine.findByIdAndDelete(req.params.id);
        res.json({ message: 'Reminder deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

function calculateSchedule(startTime, frequency, minInterval) {
    const schedule = [];
    const startDate = new Date(`2022-01-01T${startTime}:00`);

    // Example: Generate schedule for 3 times daily (you can adjust based on frequency and interval)
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < 3; i++) {
        const reminderTime = new Date(startDate);
        reminderTime.setHours(reminderTime.getHours() + minInterval * i);
        schedule.push(reminderTime);
    }
    return schedule;
}

module.exports = router;
