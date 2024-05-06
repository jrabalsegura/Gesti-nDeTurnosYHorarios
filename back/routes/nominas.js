const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-JWT');
const { validateAdmin } = require('../middlewares/validate-admin');
const { isDate } = require('../helpers/isDate');

const {getNominas, createNomina} = require('../controllers/nominas');

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

module.exports = router;

