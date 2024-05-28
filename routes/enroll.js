const express = require('express');
const router = express.Router();
const Enroll = require('../models/enroll');

// Add a new enrollment
router.post('/add', async (req, res) => {
    try {
        const { userID, courseID, remark } = req.body;
        const enrollment = new Enroll({ userID, courseID, remark });
        await enrollment.save();
        res.status(201).json({ message: 'Enrollment added successfully', enrollment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add enrollment' });
    }
});

// Get all enrollments
router.get('/all', async (req, res) => {
    try {
        const enrollments = await Enroll.find().populate('userID courseID');
        res.status(200).json(enrollments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch enrollments' });
    }
});


module.exports = router;
