const { createPDF } = require('../helpers/createPDF');
const Nomina = require('../models/Nomina');

const getNominas = async (req, res) => {

    //Find all then nominas by employeeId
    const {employeeId, month, year} = req.query;

    try {
        const nomina = await Nomina.find({ employeeId, month: parseInt(month), year: parseInt(year) });
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
    
    try {
        const fileName = await createPDF(req.body);
        console.log(fileName);

        const nomina = new Nomina({employeeId, month, year, baseSallary, horasExtra, socialSecurity, pago, fileName});
        await nomina.save();

        console.log('Nomina creada!');

        res.status(200).json({ok: true, nomina});
    } catch (error) {
        try {
            const existingNomina = await Nomina.findOne({employeeId, month, year});
            if (existingNomina) {
                res.status(409).json({ok: false, msg: 'Nomina already exists', existingNomina, error: error.message});
            } else {
                res.status(500).json({ok: false, msg: 'Error creating nomina', error: error.message});
            }
        } catch (dbError) {
            res.status(500).json({ok: false, msg: 'Database error', error: dbError.message});
        }
    }
}

module.exports = {
    getNominas,
    createNomina
}

