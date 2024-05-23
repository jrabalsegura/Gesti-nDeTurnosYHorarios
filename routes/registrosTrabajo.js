const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-JWT');
const { validateAdmin } = require('../middlewares/validate-admin');
const { isDate } = require('../helpers/isDate');
const { getHours, createRegistry, deleteRegistry } = require('../controllers/registrosTrabajo');

router.use(validateJWT);

router.get('/:id&:from&:to', validateAdmin, getHours);

router.post('/new',
    [
        check('employeeId', 'EmployeeId is required').not().isEmpty(),
        check('date', 'Date is required').custom(isDate),
        check('hours', 'Hours is required').not().isEmpty(),
        validateFields
    ],
    createRegistry
);

router.delete('/:id', validateAdmin, deleteRegistry);

module.exports = router;