const {Schema, model} = require('mongoose');

const RegistroTrabajoSchema = Schema({
    date: {
        type: Date,
        required: true
    },
    hours: {
        type: Number,
        required: true
    },
    employeeId: {
        type: Schema.Types.ObjectId,
        ref: 'Empleado',
        required: true
    }
});

module.exports = model('RegistroTrabajo', RegistroTrabajoSchema);

