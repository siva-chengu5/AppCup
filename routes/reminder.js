const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Reminder = require('../models/Reminder');

router.post('/add', auth, async (req, res) => {
    const { medName, dosage, numOfDays, numOfTimes } = req.body;
    try {
        console.log('Request body:', req.body);
        console.log('Request user:', req.user);
        const reminder = new Reminder({
            userId: req.user.id,
            medName,
            dosage,
            numOfDays,
            numOfTimes
        });
        await reminder.save();

       var json = JSON.stringify(reminder);

       console.log("json => " + json);
        try {
            res.json(json);
        }
        catch {
            console.log("Bad json");
        }
    } catch (err) {
        console.log(err);
        res.status(500).send('Server error');
    }
});

module.exports = router;
