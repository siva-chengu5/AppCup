const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// User registration route
router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }
        user = new User({ email, password });
        await user.save();
        const payload = { userId: user.id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// User login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }
        const payload = { userId: user.id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// User profile update route
router.post('/updateProfile', async (req, res) => {
    const { token, fullName, bloodType, dob, guardianPhoneNumber, address, gender, medicalHistory } = req.body;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        user.fullName = fullName || user.fullName;
        user.bloodType = bloodType || user.bloodType;
        user.dob = dob || user.dob;
        user.guardianPhoneNumber = guardianPhoneNumber || user.guardianPhoneNumber;
        user.address = address || user.address;
        user.gender = gender || user.gender;
        user.medicalHistory = medicalHistory || user.medicalHistory;

        await user.save();
        res.json({ msg: 'User profile updated successfully' });
    } catch (err) {
        res.status(500).send('Server error');
    }
});

module.exports = router;
