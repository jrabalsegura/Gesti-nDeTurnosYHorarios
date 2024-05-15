const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-JWT');
const { validateAdmin } = require('../middlewares/validate-admin');
const { isDate } = require('../helpers/isDate');

const {getNominas, createNomina, deleteNomina, createFiniquito} = require('../controllers/nominas');

router.use(validateJWT);

router.get('/', [
    check('employeeId', 'The employeeId is required').isMongoId(),
    check('month', 'The month is required').isNumeric(),
    check('year', 'The year is required').isNumeric(),
    validateFields
], getNominas);

router.post('/new', [
    check('employeeId', 'The employeeId is required').isMongoId(),
    check('month', 'The month is required').isNumeric(),
    check('year', 'The year is required').isNumeric(),
    check('baseSallary', 'The sallary is required').isNumeric(),
    check('horasExtra', 'The extra hours are required').isNumeric(),
    check('socialSecurity', 'The social security payment is required').isNumeric(),
    check('pago', 'The payment is required').isNumeric(),
    validateFields,
    validateAdmin
], createNomina);

router.post('/newFiniquito', [
    check('employeeId', 'The employeeId is required').isMongoId(),
    check('baseSallary', 'The sallary is required').isNumeric(),
    check('months', 'The months are required').isNumeric(),
    check('totalVacation', 'The total vacation payment is required').isNumeric(),
    check('pago', 'The payment is required').isNumeric(),
    validateFields,
    validateAdmin
], createFiniquito);



router.delete('/:id', [
    check('id', 'The id is required').isMongoId(),
    validateFields,
    validateAdmin
], deleteNomina);

module.exports = router;

