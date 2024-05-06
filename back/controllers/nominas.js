const Nomina = require('../models/Nomina');

const getNominas = async (req, res) => {

    //Find all then nominas by employeeId
    const {employeeId, month, year} = req.body;

    try {
        const nomina = await Nomina.find({employeeId, month, year});
        if (nomina.length > 0) {
            res.status(200).json({ok: true, nomina});
        } else {
            res.status(404).json({ok: false, msg: "Nómina no existe"})
        }
        
    } catch (error) {
        res.status(500).json({ok: false, msg: 'Error fetching nominas'});
    }
}

const createNomina = async (req, res) => {
    const {employeeId, month, year, baseSallary, horasExtra, socialSecurity, pago} = req.body;

    const nominas = await Nomina.find({employeeId, month, year});
    if (nominas.length > 0) {
        res.status(500).json({ok: false, msg: 'Nomina ya existe para empleado y mes'});
    } else {
        try {
            const nomina = new Nomina({employeeId, month, year, baseSallary, horasExtra, socialSecurity, pago});
            await nomina.save();
            res.status(200).json({ok: true, nomina});
        } catch (error) {
            res.status(500).json({ok: false, msg: 'Error creating nomina'}, error);
        }
    }
    
}

module.exports = {
    getNominas,
    createNomina
}

