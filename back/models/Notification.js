const {Schema, model} = require('mongoose');

const NotificationSchema = Schema({
    type: {
        type: String,
        required: true
    },
    employeeId: {
        type: Schema.Types.ObjectId,
        ref: 'Empleado',
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date
    }
});

module.exports = model('Notification', NotificationSchema);


