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
    check('user', 'The user is required').isObject(),
    validateFields,
    validateAdmin
], createNomina);

router.post('/newFiniquito', [
    check('user', 'The user is required').isObject(),
    validateFields,
    validateAdmin
], createFiniquito);



router.delete('/:id', [
    check('id', 'The id is required').isMongoId(),
    validateFields,
    validateAdmin
], deleteNomina);

module.exports = router;