const Shift = require('../models/Shift');

const getALLShifts = async (req, res) => {
    const shifts = await Shift.find();
    res.status(200).json({shifts});
}

const getShifts = async (req, res) => {
    const {id} = req.params;

    
    const shifts = await Shift.find({employeeId: id});
    res.status(200).json({shifts});
}

const getJustStartedShifts = async (req, res) => {
    const shifts = await Shift.find({
        start: { $gte: new Date(new Date().getTime() - 30 * 60 * 1000) }
    });
    res.status(200).json({shifts});
}

const addShift = async (req, res) => {
    const {type, start, end, employeeId} = req.body;

    try {
        const shift = new Shift({type, start, end, employeeId});
        await shift.save();
        res.status(201).json({
            "ok": true,
            shift
        });
    } catch (error) {
        res.status(500).json({
            "ok": false,
            "msg": "Error al crear el turno"
        });
    }
}

const updateShift = async (req, res) => {
    const {id} = req.params;
    const {type, start, end, employeeId} = req.body;

    try {
        const shift = await Shift.findById(id);
        if (!shift) {
            return res.status(404).json({
                "ok": false,
                "msg": "Turno no encontrado"
            });
        }
        shift.type = type;
        shift.start = start;
        shift.end = end;
        shift.employeeId = employeeId;
        await shift.save();
        res.status(200).json({
            "ok": true,
            shift
        });

    } catch (error) {
        res.status(500).json({
            "ok": false,
            "msg": "Error al actualizar el turno"
        });
    }
}

const deleteShift = async (req, res) => {
    const {id} = req.params;

    try {
        const shift = await Shift.findById(id);
        if (!shift) {
            return res.status(404).json({
                "ok": false,
                "msg": "Turno no encontrado"
            });
        }
        await shift.deleteOne();
        res.status(200).json({
            "ok": true,
            "msg": "Turno eliminado"
        });
        
    } catch (error) {
        res.status(500).json({
            "ok": false,
            "msg": "Error al eliminar el turno"
        });
    }
    
}

module.exports = {
    getShifts,
    addShift,
    updateShift,
    deleteShift,
    getJustStartedShifts,
    getALLShifts
}

