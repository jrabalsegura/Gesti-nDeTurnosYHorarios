const {Schema, model} = require('mongoose');

const EmployeeSchema = Schema({
    name: {
        type: String
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    extraHours: {
        type: Number,
        default: 0
    },
    hourlySallary: {
        type: Number,
        default: 0
    },
    holidays: {
        type: Number,
        default: 0
    },
    onHolidays: {
        type: Boolean,
        default: false
    },
    startDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = model('Employee', EmployeeSchema);


