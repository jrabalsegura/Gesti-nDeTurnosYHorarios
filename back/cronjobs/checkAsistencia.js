const api = require('../api/api');
const {  workEvents } = require('../config/config');
const { sendMail } = require('../helpers/sendMail');

const checkAsistencia = async () => {
    console.log('Checking asistencia');

    //Get the shifts that started in the past hour
    const shifts = await api.get('/shifts/getJustStartedShifts');
    
    //Get employee id from each shift
    const employeeIds = shifts.data.shifts.map(shift => shift.employeeId);

    //Check if the employee has check in after the first hour every shift
    const events = await api.get('/eventosTrabajo/last');
    const checkIns = events.data.eventosTrabajo.filter(event => event.type === workEvents.checkin);

    const checkInsIds = checkIns.map(event => event.employeeId);

    //Loop all the employeeids and check if present in checkInsIds
    employeeIds.forEach(employeeId => {
        if (!checkInsIds.includes(employeeId)) {
            sendMail('Falta de asistencia', `El empleado ${employeeId} no ha realizado el checkin después de la primera hora del turno`);
            console.log(`The employee ${employeeId} has not check in after the first hour of the shift`);
        }
    });
}

module.exports = {
    checkAsistencia
}

