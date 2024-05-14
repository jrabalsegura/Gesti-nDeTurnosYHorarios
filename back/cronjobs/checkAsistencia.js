const {api} = require('../api/api');
const {workEvents} = require('../config/config');
const {sendMail} = require('../helpers/sendMail');

const checkAsistencia = async () => {
    console.log('Checking asistencia');

    let ausencia = false;

    try {
        // Get the shifts that started in the past hour
        const shiftsResponse = await api.get('/shifts/justStarted');
        const shifts = shiftsResponse.data.shifts;
        
        // Get employee id from each shift
        const employeeIds = shifts.map(shift => shift.employeeId);

        // Check if the employee has checked in after the first hour of every shift
        const eventsResponse = await api.get('/eventosTrabajo/last');

        const checkIns = eventsResponse.data.events.filter(event => event.type === workEvents.checkin);

        const checkInsIds = new Set(checkIns.map(event => event.employeeId));

        // Loop all the employeeIds and check if present in checkInsIds
        await employeeIds.forEach(async employeeId => {
            if (!checkInsIds.has(employeeId)) {

                //Get user name
                const employeeResponse = await api.get(`/employees/${employeeId}`);
                const employeeName = employeeResponse.data.employee.name;
                ausencia = true;
                api.post(`/ausencias/new`, {
                    employeeId,
                    type: 'ausencia',
                    motivo: 'Falta de asistencia',
                    date: new Date().toISOString(),
                    name: employeeName
                });
                if (process.env.NODE_ENV !== 'test') {
                    sendMail('Falta de asistencia', `El empleado ${employeeId} no ha realizado el checkin después de la primera hora del turno`);
                }
                
                console.log(`The employee ${employeeId} has not checked in after the first hour of the shift`);
            }
        });
    } catch (error) {
        console.error('Error checking asistencia:', error);
        // Optionally, send an email or alert to notify an admin or developer of the error
        // sendMail('Error Checking Asistencia', `An error occurred while checking asistencia: ${error.message}`);
    }
    return ausencia;
}

module.exports = {
    checkAsistencia
}
