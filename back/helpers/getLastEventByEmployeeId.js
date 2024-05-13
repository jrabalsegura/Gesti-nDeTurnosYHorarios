const EventoTrabajo = require('../models/EventoTrabajo');

const getLastEventByEmployeeId = async (employeeId) => {

    const events = await EventoTrabajo.find({ employeeId }).sort('-date');
    console.log(events)
    return events[0];
}

module.exports = {
    getLastEventByEmployeeId
}

