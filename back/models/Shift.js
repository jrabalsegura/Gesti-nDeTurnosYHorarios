const {Schema, model} = require('mongoose');

const ShiftSchema = Schema({
    type: {
        type: String,
        required: true
    },
    start: {
        type: Date,
        required: true
    },
    end: {
        type: Date,
        required: true
    },
    employeeId: {
        type: Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    }
});

module.exports = model('Shift', ShiftSchema);

