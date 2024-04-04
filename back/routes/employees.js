const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validate-fields');
const {validateJWT} = require('../middlewares/validate-JWT');
const { validateAdmin } = require('../middlewares/validate-admin');
const { isDate } = require('../helpers/isDate');
const { isNotAdmin } = require('../helpers/isNotAdmin');

const {
    getEmployees,
    createEmployee,
    getEmployee,
    updateEmployee,
    deleteEmployee,
    getExtraHours,
    getSallary,
    addExtraHours,
    getHolidays,
    addHolidays,
    getOnHolidays,
    changeOnHolidays,
    getStartDate
} = require('../controllers/employees');

router.use(validateJWT);
router.use(validateAdmin);

router.get('/', getEmployees);

router.post(
    '/new', 
    [
        check('name', 'The name is required').not().isEmpty(),
        check('username', 'The username is required').not().isEmpty(),
        check('password', 'The password is required').not().isEmpty(),
        check('startDate', 'The start date is a date').optional().custom(isDate),
        check('sallary', 'The sallary must be a number').optional().isNumeric(),
        validateFields
    ], 
    createEmployee);

router.get('/:id', getEmployee);

router.put(
    '/:id', 
    [
        check('name', 'The name is required').not().isEmpty(),
        check('name', 'The name is not admin').custom(isNotAdmin),
        check('username', 'The username is required').not().isEmpty(),
        check('password', 'The password is required').not().isEmpty(),
        check('startDate', 'The start date is a date').optional().custom(isDate),
        validateFields
    ], 
    updateEmployee);

router.delete('/:id', deleteEmployee);

router.get('/:id/extraHours', getExtraHours);

router.get('/:id/sallary', getSallary);

router.post(
    '/:id/extraHours', 
    [
        check('hours', 'The hours must be a number').isNumeric(),
        validateFields
    ], 
    addExtraHours);

router.get('/:id/holidays', getHolidays);

router.post(
    '/:id/holidays', 
    [
        check('days', 'The days must be a number').isNumeric(),
        validateFields
    ], 
    addHolidays);

router.get('/:id/libre', getOnHolidays);

router.post('/:id/libre', changeOnHolidays);

router.get('/:id/startDate', getStartDate);

module.exports = router;


