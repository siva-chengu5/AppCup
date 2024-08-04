const mongoose = require('mongoose');

const ReminderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    medName: {
        type: String,
        required: true
    },
    dosage: {
        type: String,
        required: true
    },
    numOfDays: {
        type: Number,
        required: true
    },
    numOfTimes: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Reminder', ReminderSchema);
