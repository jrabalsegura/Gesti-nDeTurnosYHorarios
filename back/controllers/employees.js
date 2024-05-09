const { createUser } = require('../helpers/createUser');
const Employee = require('../models/Employee');
const bcrypt = require('bcryptjs');
const { legislacion } = require('../config/config');

const getEmployees = async (req, res) => {

    try {
        //Filter out the ones with name admin
        const employees = await Employee.find({ name: { $ne: 'admin' } });
        res.status(200).json({ok: true, employees});
    } catch (error) {
        res.status(500).json({ok: false, msg: 'Error getting employees'});
    } 
}

const createEmployee = async (req, res) => {
    const {name, username, password, startDate, hourlySallary} = req.body;

    try {

        if (hourlySallary == null) {
            hourlySallary = legislacion.sallary;
        }
        const employee = await createUser({name, username, password, startDate, hourlySallary});

        res.status(201).json({ok: true, employee});
    } catch (error) {
        res.status(500).json({ok: false, error, msg: 'Error creating employee'});
    }
}

const getEmployee = async (req, res) => {
    const {id} = req.params;

    try {
        const employee = await Employee.findById(id);
        res.status(200).json({ok: true, employee});
    } catch (error) {
        res.status(500).json({ok: false, msg: 'Error getting employee'});
    }
}

const updateEmployee = async (req, res) => {
    const {id} = req.params;
    const {name, username, hourlySallary} = req.body;

    //Encriptar la contraseña
    const salt = bcrypt.genSaltSync(10);

    const password = bcrypt.hashSync(req.body.password, salt);

    try {
        //Return the updated employee
        const employee = await Employee.findByIdAndUpdate(id, {name, username, password, hourlySallary}, {new: true});
        res.status(200).json({ok: true, employee, password});
    } catch (error) {
        console.log(error)
        res.status(500).json({ok: false, msg: 'Error updating employee', error});
    }
}

const deleteEmployee = async (req, res) => {
    const {id} = req.params;

    try {
        const employee = await Employee.findByIdAndDelete(id);
        res.status(200).json({ok: true, employee});
    } catch (error) {
        res.status(500).json({ok: false, msg: 'Error deleting employee'});
    }
}

const getExtraHours = async (req, res) => {
    const {id} = req.params;

    try {
        //Get extra hours of the employee
        const employee = await Employee.findById(id);
        if (!employee) {
            return res.status(404).json({ok: false, msg: 'Employee not found'});
        }
        
        const extraHours = employee.extraHours;
        res.status(200).json({ok: true, extraHours});
    } catch (error) {
        res.status(500).json({ok: false, msg: 'Error getting extra hours'});
    }
}

const getSallary = async (req, res) => {
    const {id} = req.params;

    try {
        //Get sallary of the employee
        const employee = await Employee.findById(id);
        if (!employee) {
            return res.status(404).json({ok: false, msg: 'Employee not found'});
        }
        
        const sallary = employee.hourlySallary;
        console.log(sallary);
        res.status(200).json({ok: true, sallary});
    } catch (error) {
        res.status(500).json({ok: false, msg: 'Error getting sallary'});
    }
}

const addExtraHours = async (req, res) => {
    const {id} = req.params;
    const {hours} = req.body;

    try {
        const employee = await Employee.findById(id);
        if (!employee) {
            return res.status(404).json({ok: false, msg: 'Employee not found'});
        }

        employee.extraHours = hours + employee.extraHours;
        await employee.save();
        res.status(200).json({ok: true, employee});
    } catch (error) {
        res.status(500).json({ok: false, error, msg: 'Error adding extra hours'});
    }
}

const getHolidays = async (req, res) => {
    const {id} = req.params;

    try {
        const employee = await Employee.findById(id);
        if (!employee) {
            return res.status(404).json({ok: false, msg: 'Employee not found'});
        }

        const holidays = employee.holidays;
        res.status(200).json({ok: true, holidays});
    } catch (error) {
        res.status(500).json({ok: false, msg: 'Error getting holidays'});
    }
}

const addHolidays = async(req, res) => {
    const {id} = req.params;
    const {days} = req.body;

    try {
        const employee = await Employee.findById(id);
        if (!employee) {
            return res.status(404).json({ok: false, msg: 'Employee not found'});
        }

        employee.holidays = days + employee.holidays;
        await employee.save();
        res.status(200).json({ok: true, employee});
    } catch (error) {
        res.status(500).json({ok: false, msg: 'Error adding holidays'});
    }
}

const getOnHolidays = async (req, res) => {
    const {id} = req.params;

    try {
        const employee = await Employee.findById(id);
        if (!employee) {
            return res.status(404).json({ok: false, msg: 'Employee not found'});
        }

        const onHolidays = employee.onHolidays;
        res.status(200).json({ok: true, onHolidays});
    } catch (error) {
        res.status(500).json({ok: false, msg: 'Error getting on holidays'});
    }
}

const changeOnHolidays = async (req, res) => {
    const {id} = req.params;

    try {
        const employee = await Employee.findById(id);
        if (!employee) {
            return res.status(404).json({ok: false, msg: 'Employee not found'});
        }

        employee.onHolidays = !employee.onHolidays;
        await employee.save();
        res.status(200).json({ok: true, employee});
    } catch (error) {
        res.status(500).json({ok: false, msg: 'Error changing on holidays'});
    }
}

const getStartDate = async (req, res) => {
    const {id} = req.params;

    try {
        const employee = await Employee.findById(id);
        if (!employee) {
            return res.status(404).json({ok: false, msg: 'Employee not found'});
        }

        const startDate = employee.startDate;
        res.status(200).json({ok: true, startDate});
    } catch (error) {
        res.status(500).json({ok: false, msg: 'Error getting start date'});
    }   
}

const clearHoursAndHolidays = async (req, res) => {
    const {id} = req.params;

    try {
        const employee = await Employee.findById(id);
        if (!employee) {
            return res.status(404).json({ok: false, msg: 'Employee not found'});
        }

        employee.extraHours = 0;
        employee.holidays = 0;
        await employee.save();
        res.status(200).json({ok: true, employee});
    } catch (error) {
        res.status(500).json({ok: false, msg: 'Error clearing hours and holidays'});
    }
}

module.exports = {
    getEmployees,
    createEmployee,
    getEmployee,
    updateEmployee,
    deleteEmployee,
    getExtraHours,
    getSallary,
    addExtraHours,
    getHolidays,
    addHolidays,
    getOnHolidays,
    changeOnHolidays,
    getStartDate,
    clearHoursAndHolidays
}
