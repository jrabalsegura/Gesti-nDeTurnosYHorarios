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

        console.log(prevEvent);
        //Here, when event type = 'checkOut' we create a new registrosTrabajo'
        if (type === workEvents.checkout) {
            
            
            //Check if previous event is a checkin
            if (prevEvent.type === workEvents.checkin) {

                const evento = new EventoTrabajo({ type, employeeId, date, name });
                await evento.save();

                console.log(evento);

                //Calc hours prom prev event to actual
                const prevEventDate = new Date(prevEvent.date);
                const currentDate = new Date(date);

                const hours = (currentDate - prevEventDate) / (1000 * 60 * 60);

                //If hours > 24, then there is an error
                console.log(date)
                console.log(prevEvent.date)
                console.log(hours);
                if (hours > 24) {
                    return res.status(400).json({ "ok": false, msg: 'There is no checkin in the previous 24 hours' });
                }

                if (!isNaN(hours)) {
                    const registro = new RegistroTrabajo({ employeeId, date: currentDate, hours });
                    await registro.save();
                } else {
                    return res.status(400).json({ "ok": false, msg: 'Invalid hours calculation' });
                }

                //Create a new registro
                const registro = new RegistroTrabajo({ employeeId, date, hours });
                await registro.save();

                res.status(201).json({ evento });
            } else {
                res.status(500).json({"ok": false, error, msg:"Último evento fue una salida"})
            }
        } else {
            //Check if previous event is a checkout o no existe
            if (prevent && prevEvent.type === workEvents.checkout) {

                const evento = new EventoTrabajo({ type, employeeId, date, name });
                await evento.save();

                console.log(evento);

                res.status(201).json({ evento });
            } else if (!prevent) {
                const evento = new EventoTrabajo({ type, employeeId, date, name });
                await evento.save();

                console.log(evento);

                res.status(201).json({ evento });
            } else {
                res.status(500).json({"ok": false, error, msg:"Último evento fue una entrada"})
            }
        }
    } catch (error) {
        res.status(500).json({ "ok": false, error, msg: 'Error creating event' });
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



