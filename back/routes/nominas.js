const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-JWT');
const { validateAdmin } = require('../middlewares/validate-admin');
const { isDate } = require('../helpers/isDate');

const {getNominas, createNomina} = require('../controllers/nominas');

router.use(validateJWT);

router.get('/', getNominas);

router.post('/new', [
    check('employeeId', 'The employeeId is required').isMongoId(),
    check('month', 'The month is required').isNumeric(),
    check('year', 'The year is required').isNumeric(),
    check('file', 'The ruta to the file is required').isString(),
    validateFields,
    validateAdmin
], createNomina);

module.exports = router;

