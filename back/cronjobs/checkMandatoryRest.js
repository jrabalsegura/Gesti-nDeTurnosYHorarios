const api = require('../api/api');
const RegistroTrabajo = require('../models/RegistroTrabajo'); // Import the model
const mandatoryRest = require('../config/config').legislacion.minHorasDescansoIninterrumpido;
const workEvents = require('../config/config').workEvents;

const checkMandatoryRest = async () => {
    console.log('Checking mandatory rest');

    const oneWeekAgo = new Date(new Date().setDate(new Date().getDate() - 7));
    const registros = await RegistroTrabajo.find({ date: { $gte: oneWeekAgo } }).sort({ employeeId: 1, date: 1 });

    const employees = await api.get('/employees');
    for (const employee of employees) {
        const employeeRegistros = registros.filter(registro => registro.employeeId.toString() === employee._id);
        let hasLongEnoughRest = false;
        let lastCheckout = null;

        for (const registro of employeeRegistros) {
            if (registro.type === workEvents.checkin && lastCheckout && (registro.date - lastCheckout) / (1000 * 60 * 60) >= mandatoryRest) {
                hasLongEnoughRest = true;
                break;
            }
            if (registro.type === workEvents.checkout) {
                lastCheckout = registro.date;
            }
        }

        if (!hasLongEnoughRest) {
            console.log(`Employee ID ${employee._id} did not have a rest period longer than ${mandatoryRest} hours in the past week.`);
        }
    }
}

module.exports = { checkMandatoryRest };

