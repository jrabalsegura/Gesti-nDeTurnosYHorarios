const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-JWT');
const { isDate } = require('../helpers/isDate');
const {getHolidaysStartToday, getHolidaysEndToday, createHoliday, getHolidays, deleteHoliday, updateHoliday} = require('../controllers/holidays');
const { validateAdmin } = require('../middlewares/validate-admin');

router.use(validateJWT);

router.get('/start', validateAdmin, getHolidaysStartToday);

router.get('/end', validateAdmin, getHolidaysEndToday);

router.get('/:id', getHolidays);

router.post('/new', [
    check('startDate', 'The startDate is required').custom(isDate),
    check('endDate', 'The endDate is required').custom(isDate),
    check('employeeId', 'The employeeId is required').isMongoId(),
    validateFields
], createHoliday);

router.delete('/:id', [
    check('id', 'The id is required').isMongoId(),
    validateFields,
    validateAdmin
], deleteHoliday);

router.put('/:id', [
    check('startDate', 'The startDate is required').custom(isDate),
    check('endDate', 'The endDate is required').custom(isDate),
    validateFields,
    validateAdmin
], updateHoliday);

module.exports = router;