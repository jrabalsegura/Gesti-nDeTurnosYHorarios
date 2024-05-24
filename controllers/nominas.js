const { createPDF } = require('../helpers/createPDF');
const { createPDFFiniquito } = require('../helpers/createPDFFiniquito');
const Nomina = require('../models/Nomina');
const { calcNomina } = require('../helpers/calcNomina');
const { calcFiniquito } = require('../helpers/calcFiniquito');

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
    const {user} = req.body;
    let fileName = '';

    const finiquito = calcFiniquito(user.hourlySallary, user.startDate, user.holidays);

    const data = {
        employeeName: user.name,
        months: finiquito.months,
        baseSallary: finiquito.baseSallary,
        totalVacation: finiquito.totalVacation,
        pago: finiquito.pago
    }

    try {    
        if (process.env.NODE_ENV !== 'test') {
            fileName = await createPDFFiniquito(data);       
        } else {
            fileName = 'test.pdf';
        }
        finiquito.fileName = fileName;

        res.status(200).json({ok: true, finiquito});
    } catch (error) {       
        res.status(500).json({ok: false, msg: 'Database error', error});        
    }
}

const createNomina = async (req, res) => {
    const {user} = req.body;   
    const now = new Date();
    const currentMonth = now.getMonth() + 1; // January is 0, not 1
    const currentYear = now.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
    const employeeId = user._id;
    const existingNomina = await Nomina.findOne({employeeId, month: currentMonth, year: currentYear});
    
    if (existingNomina) {
        return res.status(409).json({ok: false, msg: 'Nomina already exists', existingNomina});
    }

    const {baseSallary, socialSecurity, pago} = calcNomina(user.hourlySallary, user.extraHours, daysInMonth);

    const data = {
        employeeName: user.name,
        month: currentMonth,
        year: currentYear,
        baseSallary,
        horasExtra: user.extraHours,
        socialSecurity,
        pago
    }

    let fileName = '';
    try {
        if (process.env.NODE_ENV !== 'test') {
            fileName = await createPDF(data);       
        } else {
            fileName = 'test.pdf';
        }
        
        const nomina = new Nomina({employeeId, month: currentMonth, year: currentYear, baseSallary, horasExtra: user.extraHours, socialSecurity, pago, fileName});
        await nomina.save();

        return res.status(200).json({ok: true, nomina});
    } catch (error) {
        return res.status(500).json({ok: false, msg: 'Database error', error: error.message});        
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

