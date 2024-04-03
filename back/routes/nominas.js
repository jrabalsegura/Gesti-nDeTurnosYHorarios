const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-JWT');
const { isDate } = require('../helpers/isDate');

const {getNominas, createNomina} = require('../controllers/nominas');

router.use(validateJWT);

router.get('/:id', getNominas);

router.post('/new', [
    check('employeeId', 'The employeeId is required').isMongoId(),
    check('date', 'The startDate is required').custom(isDate),
    check('file', 'The ruta to the file is required').isString(),
    validateFields
], createNomina);

module.exports = router;

