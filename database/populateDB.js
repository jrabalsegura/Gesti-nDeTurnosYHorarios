const mongoose = require('mongoose');
const Employee = require('../models/Employee');
const EventoTrabajo = require('../models/EventoTrabajo');
const RegistroTrabajo = require('../models/RegistroTrabajo');
const Shift = require('../models/Shift');
const Holiday = require('../models/Holiday');

const populateDB = async () => {
  await mongoose.connect(process.env.DB_CNN);

  // Create sample employees
  const employees = await Employee.insertMany([
    { name: "admin", username: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD},
    { name: 'John Doe', username: 'johndoe', password: 'password1' },
    { name: 'Jane Smith', username: 'janesmith', password: 'password2' },
    { name: 'Mike Johnson', username: 'mikejohnson', password: 'password3' }
  ]);

  // Create sample work events
  const workEvents = [];
  for (let i = 0; i < 25; i++) {
    workEvents.push({
      type: i % 2 === 0 ? 'checkin' : 'checkout',
      employeeId: employees[Math.floor(Math.random() * employees.length)]._id,
      date: new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 30))
    });
  }
  await EventoTrabajo.insertMany(workEvents);

  // Create sample work registries
  const workRegistries = [];
  for (let i = 0; i < 10; i++) {
    workRegistries.push({
      employeeId: employees[Math.floor(Math.random() * employees.length)]._id,
      date: new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 30)),
      hours: Math.floor(Math.random() * 8) + 1
    });
  }
  await RegistroTrabajo.insertMany(workRegistries);

  // Create sample shifts at 8:00 am and 16:00 pm
  const shifts = [
    {
      type: 'morning',
      start: new Date(2023, 5, 1, 8, 0, 0),
      end: new Date(2023, 5, 1, 16, 0, 0),
      employeeId: employees[0]._id
    },
    {
      type: 'afternoon',
      start: new Date(2023, 5, 2, 16, 0, 0),
      end: new Date(2023, 5, 2, 24, 0, 0),
      employeeId: employees[1]._id
    },
    {
      type: 'morning',
      start: new Date(2023, 5, 3, 8, 0, 0),
      end: new Date(2023, 5, 3, 16, 0, 0),
      employeeId: employees[2]._id
    }
  ];
  await Shift.insertMany(shifts);

  // Create sample holidays
  const holidays = [
    {
      employeeId: employees[0]._id,
      start: new Date(2023, 6, 1),
      end: new Date(2023, 6, 15)
    },
    {
      employeeId: employees[1]._id,
      start: new Date(2023, 7, 1),
      end: new Date(2023, 7, 10)
    }
  ];
  await Holiday.insertMany(holidays);

  console.log('Database populated with sample data.');
  await mongoose.disconnect();
};

module.exports = {
    populateDB
}