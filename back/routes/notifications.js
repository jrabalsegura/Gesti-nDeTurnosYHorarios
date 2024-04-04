const express = require('express');
const router = express.Router();
const {check} = require('express-validator');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-JWT');
const { validateAdmin } = require('../middlewares/validate-admin');
const {isDate} = require('../helpers/isDate');
const {getNotifications, createNotification, deleteNotification} = require('../controllers/notifications');

router.use(validateJWT);

router.get('/', validateAdmin, getNotifications);

router.post(
    '/new', 
    [
        check('type', 'The type is required').not().isEmpty(),
        check('employeeId', 'The employeeId is required').not().isEmpty(),
        check('startDate', 'The startDate is required').custom(isDate),
        check('endDate', 'The endDate must be a date').optional().custom(isDate),
        validateFields
    ], 
    createNotification);

router.delete('/:id', validateAdmin, deleteNotification);

module.exports = router;


