const {Schema, model} = require('mongoose');

const NominaSchema = Schema({
    month: {
        type: Number,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    employeeId: {
        type: Schema.Types.ObjectId,
        ref: 'Empleado',
        required: true
    },
    baseSallary: {
        type: Number,
        required: true
    },
    horasExtra: {
        type: Number,
        required: true
    },
    socialSecurity: {
        type: Number,
        required: true
    },
    pago: {
        type: Number,
        required: true
    }
});

module.exports = model('Nomina', NominaSchema);


