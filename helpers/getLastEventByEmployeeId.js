const EventoTrabajo = require('../models/EventoTrabajo');

const getLastEventByEmployeeId = async (employeeId) => {
    const events = await EventoTrabajo.find({ employeeId }).sort('-date');
    return events[0];
}

module.exports = {
    getLastEventByEmployeeId
}

