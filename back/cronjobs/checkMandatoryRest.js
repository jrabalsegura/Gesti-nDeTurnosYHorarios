const {api} = require('../api/api');
const { sendMail } = require('../helpers/sendMail');
const EventoTrabajo = require('../models/EventoTrabajo'); // Import the model
const mandatoryRest = require('../config/config').legislacion.minHorasDescansoIninterrumpido;
const workEvents = require('../config/config').workEvents;

const checkMandatoryRest = async () => {
    console.log('Checking mandatory rest');

    let alerta = false;

    const oneWeekAgo = new Date(new Date().setDate(new Date().getDate() - 7));
    const registros = await EventoTrabajo.find({ date: { $gte: oneWeekAgo } }).sort({ employeeId: 1, date: 1 });

    const employees = await api.get('/employees/');
    console.log(employees);
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
            alerta = true;
            //TODO: Notify by mail
            if (process.env.NODE_ENV !== 'test') {
                sendMail('Falta de descanso obligatorio', `El empleado ${employee._id} no ha realizado un descanso obligatorio durante la semana.`);
            }
            console.log(`Employee ID ${employee._id} did not have a rest period longer than ${mandatoryRest} hours in the past week.`);
        }
    }

    return alerta;
}

module.exports = { checkMandatoryRest };

