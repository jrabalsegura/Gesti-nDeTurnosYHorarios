const EventoTrabajo = require('../models/EventoTrabajo');
const RegistroTrabajo = require('../models/RegistroTrabajo');
const { getLastEventByEmployeeId } = require('../helpers/getLastEventByEmployeeId');
const { workEvents } = require('../config/config');
const { uploadFileToS3 } = require('../aws/config')

const getEvents = async (req, res) => {
    const eventos = await EventoTrabajo.find();

    // Convert eventos to a JSON string
    const eventosString = JSON.stringify(eventos);

    let fileName = '';

    // Upload to S3
    try {
        //Probando en local no funciona por falta de aws env variables
        fileName = await uploadFileToS3('events.txt', eventosString);
        console.log('File URL:', fileName);
    } catch (err) {
        console.error(err);
    }

    res.status(200).json({ eventos, fileName });
}

const createEvent = async (req, res) => {
    const { type, employeeId, date, name } = req.body;

    try {
        const prevEvent = await getLastEventByEmployeeId(employeeId);

        // Prevent consecutive same type events
        if (prevEvent && prevEvent.type === type) {
            return res.status(400).json({ "ok": false, msg: `Cannot have consecutive ${type} events` });
        }

        if (type === workEvents.checkout && !prevEvent) {
            return res.status(400).json({ "ok": false, msg: 'Cannot have checkout without checkin' });
        }

        // Proceed with creating the event
        const evento = new EventoTrabajo({ type, employeeId, date, name });
        await evento.save();

        // Additional logic for checkout events
        if (type === workEvents.checkout) {
            const prevEventDate = new Date(prevEvent.date);
            const currentDate = new Date(date);
            const hours = (currentDate - prevEventDate) / (1000 * 60 * 60);

            if (hours > 24) {
                return res.status(400).json({ "ok": false, evento,msg: 'There is no checkin in the previous 24 hours' });
            }

            if (!isNaN(hours)) {
                const registro = new RegistroTrabajo({ employeeId, date: currentDate, hours });
                await registro.save();

                return res.status(201).json({ evento, registro });
            } else {
                return res.status(400).json({ "ok": false, msg: 'Invalid hours calculation' });
            }
        }

        res.status(201).json({ evento });
    } catch (error) {
        res.status(500).json({ "ok": false, error, msg: 'Error creating event' });
    }
}

const deleteEvent = async (req, res) => {
    const { id } = req.params;
    await EventoTrabajo.findByIdAndDelete(id);
    res.status(200).json({ "ok": true, msg: 'Event deleted' });
}

const getLastHour = async (req, res) => {
    // Find all events generated in the last hour
    const events = await EventoTrabajo.find({ date: { $gte: new Date(new Date().getTime() - 3600000) } });
    res.json({ events });
}


module.exports = {
    getEvents,
    createEvent,
    getLastHour,
    deleteEvent
}



