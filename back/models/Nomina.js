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
    file: {
        //Ruta del archivo
        type: String,
        required: true
    }
});

module.exports = model('Nomina', NominaSchema);


