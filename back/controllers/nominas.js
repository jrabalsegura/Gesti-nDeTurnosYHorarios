const Nomina = require('../models/Nomina');

const getNominas = async (req, res) => {

    //Find all then nominas by employeeId
    const {id} = req.params;

    try {
        const nominas = await Nomina.find({employeeId: id});
        res.status(200).json({ok: true, nominas});
    } catch (error) {
        res.status(500).json({ok: false, msg: 'Error fetching nominas'});
    }
}

const createNomina = async (req, res) => {
    const {employeeId, date, file} = req.body;
    try {
        const nomina = new Nomina({employeeId, date, file});
        await nomina.save();
        res.status(200).json({ok: true, nomina});
    } catch (error) {
        res.status(500).json({ok: false, msg: 'Error creating nomina'});
    }
}

module.exports = {
    getNominas,
    createNomina
}

