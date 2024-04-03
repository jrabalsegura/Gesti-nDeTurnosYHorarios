const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-JWT');
const { isDate } = require('../helpers/isDate');
const { getEvents, createEvent, getLastHour} = require('../controllers/eventosTrabajo');

router.use(validateJWT);

router.get('/', getEvents);

router.post('/new', [
    check('type', 'The type of event is required').not().isEmpty(),
    check('employeeId', 'The employeeId is required').not().isEmpty(),
    check('date', 'The date is required').custom(isDate),
    validateFields
], createEvent);

router.get('/last', getLastHour);


module.exports = router;

