const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-JWT');
const { validateAdmin } = require('../middlewares/validate-admin');
const { isDate } = require('../helpers/isDate');

const {getAusencias, getAusencia, createAusencia, deleteAusencia} = require('../controllers/ausencias');

router.use(validateJWT);

router.get('/all/:employeeId', validateAdmin, getAusencias);

router.get('/:id', validateAdmin, getAusencia);

router.delete('/:id', validateAdmin, deleteAusencia);

router.post(
    '/new', 
    [
        check('date', 'The date is required').custom(isDate),
        check('employeeId', 'The employeeId is required').isMongoId(),
        check('motivo', 'The motivo is required').not().isEmpty(),
        validateFields
    ], 
    createAusencia);

module.exports = router;