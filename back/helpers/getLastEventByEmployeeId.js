const EventoTrabajo = require('../models/EventoTrabajo');

const getLastEventByEmployeeId = async (employeeId) => {

    const events = await EventoTrabajo.find({ employeeId }).sort('-date').limit(2);
    return events[1];
}

module.exports = {
    getLastEventByEmployeeId
}

