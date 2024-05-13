const RegistroTrabajo = require('../models/RegistroTrabajo');

const getHours = async (req, res) => {
    const { id, from, to } = req.params;

    try {
        const registros = await RegistroTrabajo.find({ employeeId: id, date: { $gte: from, $lte: to } });

        // Loop all the registros and sum the hours worked
        let hoursWorked = 0;
        for (const registro of registros) {
            hoursWorked += registro.hours;
        }
        res.status(200).json({ ok: true, hoursWorked });
    } catch (error) {
        res.status(500).json({ "ok": false, msg: 'Error getting hours' });
    }
}

const createRegistry = async (req, res) => {
    const { employeeId, date, hours } = req.body;

    try {
        const registro = new RegistroTrabajo({ employeeId, date, hours });
        await registro.save();

        res.status(200).json({ ok: true, msg: 'Registry created successfully' });
    } catch (error) {
        res.status(500).json({ ok: false, msg: 'Error creating registry' });
    }
}

const deleteRegistry = async (req, res) => {
    const { id } = req.params;

    try {
        await RegistroTrabajo.findByIdAndDelete(id);
        res.status(200).json({ ok: true, msg: 'Registry deleted successfully' });
    } catch (error) {
        res.status(500).json({ ok: false, msg: 'Error deleting registry' });
    }
}

module.exports = {
    getHours,
    createRegistry,
    deleteRegistry
}
