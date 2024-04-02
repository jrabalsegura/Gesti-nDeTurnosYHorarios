const {Schema, model} = require('mongoose');

const HolidaySchema = Schema({
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    employeeId: {
        type: Schema.Types.ObjectId,
        ref: 'Empleado',
        required: true
    }
});

module.exports = model('Holiday', HolidaySchema);


