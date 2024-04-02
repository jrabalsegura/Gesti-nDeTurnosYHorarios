const EventoTrabajo = require('../models/EventoTrabajo');

const getEvents = async (req, res) => {
    const eventos = await EventoTrabajo.find();
    res.status(200).json({ eventos });
}

const createEvent = async (req, res) => {
    const { type, employeeId, date } = req.body;

    try {
        const evento = new EventoTrabajo({ type, employeeId, date });
        await evento.save();

        //Here, when event type = 'checkOut' we create a new registrosTrabajo'
        // calling the controller directly

        res.json({ evento });

    } catch (error) {
        res.status(500).json({ "ok": false, msg: 'Error creating event' });
    }


}

const getLastHour = async (req, res) => {
    // Find all events generated in the last hour
    const events = await EventoTrabajo.find({ date: { $gte: new Date(new Date().getTime() - 3600000) } });
    res.json({ events });
}

module.exports = {
    getEvents,
    createEvent,
    getLastHour
}



