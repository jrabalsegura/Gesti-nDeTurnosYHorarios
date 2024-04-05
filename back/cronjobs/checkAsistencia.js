const axios = require('axios');
const { API_ENDPOINT, workEvents } = require('../config/config');

const checkAsistencia = async () => {
    console.log('Checking asistencia');

    //Get the shifts that started in the past hour
    const shifts = await axios.get(`${API_ENDPOINT}/shifts/getJustStartedShifts`);
    
    //Get employee id from each shift
    const employeeIds = shifts.data.shifts.map(shift => shift.employeeId);

    //Check if the employee has check in after the first hour every shift
    const events = await axios.get(`${API_ENDPOINT}/eventosTrabajo/last`);
    const checkIns = events.data.eventosTrabajo.filter(event => event.type === workEvents.checkin);

    const checkInsIds = checkIns.map(event => event.employeeId);

    //Loop all the employeeids and check if present in checkInsIds
    employeeIds.forEach(employeeId => {
        if (!checkInsIds.includes(employeeId)) {
            //TODO: Notify by mail
            console.log(`The employee ${employeeId} has not check in after the first hour of the shift`);
        }
    });
}

module.exports = {
    checkAsistencia
}

