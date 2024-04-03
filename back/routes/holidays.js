const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-JWT');
const { isDate } = require('../helpers/isDate');

const {getHolidaysStartToday, getHolidaysEndToday, createHoliday} = require('../controllers/holidays');

router.use(validateJWT);

router.get('/start', getHolidaysStartToday);

router.get('/end', getHolidaysEndToday);

router.post('/new', [
    check('startDate', 'The startDate is required').custom(isDate),
    check('endDate', 'The endDate is required').custom(isDate),
    check('employeeId', 'The employeeId is required').isMongoId(),
    validateFields
], createHoliday);

module.exports = router;

