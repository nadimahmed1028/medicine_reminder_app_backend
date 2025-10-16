/* eslint-disable consistent-return */
/* eslint-disable comma-dangle */
/* eslint-disable no-plusplus */
/* eslint-disable object-curly-newline */
/* eslint-disable no-use-before-define */
const express = require('express');

const router = express.Router();
const Medicine = require('../models/Medicine');
const auth = require('../middleware/authMiddleware');

router.post('/reminders', auth, async (req, res) => {
    try {
        const { name, frequency, startDate, startTime, minInterval } = req.body;

        if (!name || !frequency || !startDate || !startTime || !minInterval) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const schedule = calculateSchedule(startDate, startTime, frequency, minInterval);

        const newMedicine = new Medicine({
            name,
            frequency,
            startDate,
            startTime,
            minInterval,
            userId: req.user,
            schedule,
        });

        await newMedicine.save();
        res.status(201).json(newMedicine);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/reminders', auth, async (req, res) => {
    try {
        const medicines = await Medicine.find({ userId: req.user });
        res.json(medicines);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/reminders/:id', auth, async (req, res) => {
    try {
        const { name, frequency, startDate, startTime, minInterval } = req.body;

        const schedule = calculateSchedule(startDate, startTime, frequency, minInterval);

        const updatedMedicine = await Medicine.findOneAndUpdate(
            { _id: req.params.id, userId: req.user },
            { name, frequency, startDate, startTime, minInterval, schedule },
            { new: true }
        );

        if (!updatedMedicine) {
            return res.status(404).json({ message: 'Reminder not found' });
        }

        res.json(updatedMedicine);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/reminders/:id', auth, async (req, res) => {
    try {
        const deleted = await Medicine.findOneAndDelete({ _id: req.params.id, userId: req.user });
        if (!deleted) return res.status(404).json({ message: 'Reminder not found' });

        res.json({ message: 'Reminder deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

function calculateSchedule(startDate, startTime, frequency, minInterval) {
    const schedule = [];
    const [hours, minutes] = startTime.split(':').map(Number);
    const start = new Date(startDate);

    start.setHours(hours, minutes, 0, 0);

    start.setMinutes(start.getMinutes());

    for (let i = 0; i < frequency; i++) {
        const doseTime = new Date(start);
        doseTime.setHours(doseTime.getHours() + minInterval * i);
        schedule.push(doseTime);
    }

    return schedule;
}

module.exports = router;
