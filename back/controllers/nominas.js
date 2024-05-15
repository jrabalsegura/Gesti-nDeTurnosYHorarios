const { createPDF } = require('../helpers/createPDF');
const { createPDFFiniquito } = require('../helpers/createPDFFiniquito');
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

const createFiniquito = async (req, res) => {
    const {employeeId, months, baseSallary, totalVacation, pago} = req.body;
    let fileName = '';

    try {
        //Check if NODE_ENV is production
        if (process.env.NODE_ENV !== 'test') {
            fileName = await createPDFFiniquito(req.body);
            console.log(fileName);
        } else {
            fileName = 'test.pdf';
        }

        console.log('Finiquito creado!');

        res.status(200).json({ok: true, fileName});
    } catch (error) {
        
        res.status(500).json({ok: false, msg: 'Database error', error});
        
    }
}

const createNomina = async (req, res) => {
    const {employeeId, month, year, baseSallary, horasExtra, socialSecurity, pago} = req.body;
    let fileName = '';
    try {
        //Check if NODE_ENV is production
        if (process.env.NODE_ENV !== 'test') {
            fileName = await createPDF(req.body);
            console.log(fileName);
        } else {
            fileName = 'test.pdf';
        }
        

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

const deleteNomina = async (req, res) => {
    const {id} = req.params;
    try {
        await Nomina.findByIdAndDelete(id);
        res.status(200).json({ok: true});
    } catch (error) {
        res.status(500).json({ok: false, msg: 'Error deleting nomina', error: error.message});
    }
}

module.exports = {
    getNominas,
    createNomina,
    deleteNomina,
    createFiniquito
}

