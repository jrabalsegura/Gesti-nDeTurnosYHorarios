require('dotenv').config();
const mongoose = require('mongoose');
const EventoTrabajo = require("../models/EventoTrabajo");
const Holiday = require("../models/Holiday");
const Nomina = require("../models/Nomina");
const RegistroTrabajo = require("../models/RegistroTrabajo");
const Shift = require("../models/Shift");
const Employee = require("../models/Employee");
const Ausencia = require("../models/Ausencia");
const Notification = require("../models/Notification");


const deleteDB = async () => {
    try {
        await mongoose.connect(process.env.DB_CNN);

        await Employee.deleteMany({});
        await Ausencia.deleteMany({});
        await EventoTrabajo.deleteMany({});
        await Holiday.deleteMany({});
        await Nomina.deleteMany({});
        await Notification.deleteMany({});
        await RegistroTrabajo.deleteMany({});
        await Shift.deleteMany({});

        console.log('Database cleared successfully.');
    } catch (error) {
        console.error('Error clearing database:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
};

deleteDB();


