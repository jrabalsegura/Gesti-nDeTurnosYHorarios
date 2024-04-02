const {Schema, model} = require('mongoose');

const AusenciaSchema = Schema({
    date: {
        type: Date,
        required: true
    },
    employeeId: {
        type: Schema.Types.ObjectId,
        ref: 'Empleado',
        required: true
    },
    motivo: {
        type: String,
        required: true
    },
    justificante: {
        // Ruta del archivo
        type: String
    }
});

module.exports = model('Ausencia', AusenciaSchema);


