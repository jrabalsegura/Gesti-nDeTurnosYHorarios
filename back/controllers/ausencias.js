const Ausencia = require('../models/Ausencia');
const Notification = require('../models/Notification');

const getAusencias = async (req, res) => {

    try {
        //Get all ausencias by employeeId
        const ausencias = await Ausencia.find({employeeId: req.params.employeeId});
        res.status(200).json({ok: true, ausencias});
    } catch (error) {
        res.status(500).json({ok: false, msg: 'Error fetching ausencias'});
    }
}

const getAusencia = async (req, res) => {
    const {id} = req.params;
    try {
        const ausencia = await Ausencia.findById(id);
        res.status(200).json({ok: true, ausencia});
    } catch (error) {
        res.status(500).json({ok: false, msg: 'Error fetching ausencia'});
    }
}

const createAusencia = async (req, res) => {
    const {date, employeeId, motivo, rutaJustificante} = req.body;
    try {
        const ausencia = new Ausencia({date, employeeId, motivo, rutaJustificante});
        await ausencia.save();

        //Create notification for admin
        const type = 'ausencia';
        const startDate = date;
        const notification = new Notification({type, employeeId, startDate});
        await notification.save();

        res.status(200).json({ok: true, ausencia});
    } catch (error) {
        res.status(500).json({ok: false, msg: 'Error creating ausencia', error});
    }
}

module.exports = {
    getAusencias,
    getAusencia,
    createAusencia
}
