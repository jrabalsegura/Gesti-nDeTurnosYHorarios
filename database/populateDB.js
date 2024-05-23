const mongoose = require('mongoose');
const { createUser } = require('../helpers/createUser');
const RegistroTrabajo = require('../models/RegistroTrabajo');
const Shift = require('../models/Shift');
const Holiday = require('../models/Holiday');

const populateDB = async () => {
  await mongoose.connect(process.env.DB_CNN);

  await createUser({name: "admin", username: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD});
  await createUser({name: "John Doe", username: "johndoe", password: "password1", hourlySallary: 25, startDate: new Date(2022, 2, 15)});
  await createUser({name: "Jane Smith", username: "janesmith", password: "password2", hourlySallary: 15, startDate: new Date(2023, 0, 10)});
  await createUser({name: "Mike Johnson", username: "mikejohnson", password: "password3", hourlySallary: 15, startDate: new Date(2022, 11, 1)});

  /*
  // Create sample work events
  const employees = await Employee.find({});
  const workEvents = [];
  for (let i = 0; i < 50; i++) {
    const randomEmployeeIndex = Math.floor(Math.random() * employees.length);
    const randomEmployee = employees[randomEmployeeIndex];
    if (randomEmployee.name.toLowerCase() !== 'admin') {
      workEvents.push({
        type: i % 2 === 0 ? 'checkin' : 'checkout',
        employeeId: randomEmployee._id,
        name: randomEmployee.name,
        date: new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 30))
      });
    }
  }
  await EventoTrabajo.insertMany(workEvents);
  */

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
      start: new Date(2024, 5, 18, 8, 0, 0),
      end: new Date(2024, 5, 24, 16, 0, 0),
      employeeId: employees[1]._id
    },
    {
      type: 'afternoon',
      start: new Date(2024, 5, 25, 16, 0, 0),
      end: new Date(2024, 5, 29, 24, 0, 0),
      employeeId: employees[2]._id
    },
    {
      type: 'morning',
      start: new Date(2024, 5, 30, 8, 0, 0),
      end: new Date(2024, 6, 3, 16, 0, 0),
      employeeId: employees[3]._id
    }
  ];
  await Shift.insertMany(shifts);

  // Create sample holidays
  const holidays = [
    {
      employeeId: employees[1]._id,
      startDate: new Date(2024, 5, 1),
      endDate: new Date(2024, 5, 15)
    },
    {
      employeeId: employees[2]._id,
      startDate: new Date(2024, 5, 16),
      endDate: new Date(2024, 5, 25)
    }
  ];
  await Holiday.insertMany(holidays);

  console.log('Database populated with sample data.');
  await mongoose.disconnect();
};

populateDB();

