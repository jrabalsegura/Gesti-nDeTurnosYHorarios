const {Schema, model} = require('mongoose');

const EventoTrabajoSchema = Schema({
    date: {
        type: Date,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    employeeId: {
        type: Schema.Types.ObjectId,
        ref: 'Empleado',
        required: true
    }
});

module.exports = model('EventoTrabajo', EventoTrabajoSchema);

