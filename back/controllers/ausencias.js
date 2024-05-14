const Ausencia = require('../models/Ausencia');
const Notification = require('../models/Notification');
const Employee = require('../models/Employee');

const getAusencias = async (req, res) => {

    try {
        //Get all ausencias by employeeId
        const ausencias = await Ausencia.find({employeeId: req.params.employeeId});
        res.status(200).json({ok: true, ausencias});
    } catch (error) {
        res.status(404).json({ok: false, msg: 'Error fetching ausencias'});
    }
}

const getAusencia = async (req, res) => {
    const {id} = req.params;
    try {
        const ausencia = await Ausencia.findById(id);
        res.status(200).json({ok: true, ausencia});
    } catch (error) {
        res.status(404).json({ok: false, msg: 'Error fetching ausencia'});
    }
}

const createAusencia = async (req, res) => {
    let {date, employeeId, motivo, justificante, name} = req.body;
    try {
        const ausencia = new Ausencia({date, employeeId, motivo, justificante});
        await ausencia.save();

        //If name === undefined
        if (name === undefined) {
            const employeeResponse = await Employee.findById(employeeId);
            const employee = employeeResponse.data.employee;
            name = employee.name;
        }

        //Create notification for admin
        const type = 'ausencia';
        const startDate = date;
        const notification = new Notification({type, name, employeeId, startDate, justificante});
        await notification.save();

        res.status(200).json({ok: true, ausencia, notification});
    } catch (error) {
        console.log(error);
        res.status(500).json({ok: false, msg: 'Error creating ausencia', error});
    }
}

const deleteAusencia = async (req, res) => {
    const {id} = req.params;
    try {
        await Ausencia.findByIdAndDelete(id);
        res.status(200).json({ok: true});
    } catch (error) {
        res.status(404).json({ok: false, msg: 'Error deleting ausencia'});
    }
}

module.exports = {
    getAusencias,
    getAusencia,
    createAusencia,
    deleteAusencia
}
