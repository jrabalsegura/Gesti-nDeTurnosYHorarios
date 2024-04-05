const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validate-fields');
const {validateJWT} = require('../middlewares/validate-JWT');
const { validateShift } = require('../middlewares/validate-shift');
const { validateAdmin } = require('../middlewares/validate-admin');
const { getShifts, addShift, updateShift, deleteShift } = require('../controllers/shifts');
const { isDate } = require('../helpers/isDate');
const { isShift } = require('../helpers/isShift');
const { getJustStartedShifts } = require('../controllers/shifts');

router.use(validateJWT);


router.get('/justStarted', getJustStartedShifts);
// Get turns, primero todos
// TODO: Filtrar por usuario
router.get('/:id', getShifts);

// Create new shift
router.post(
    '/new',
    [
        check('type', 'El tipo de turno no es válido').custom(isShift),
        check('employeeId', 'El id del empleado es obligatorio').not().isEmpty(),
        check('start', 'La fecha de inicio es obligatoria').custom(isDate),
        check('end', 'La fecha de fin es obligatoria').custom(isDate),
        validateFields,
        validateAdmin,
        validateShift
    ],
    addShift);

//Update shift
router.put(
    '/:id',
    [
        check('type', 'El tipo de turno es obligatorio').custom(isShift),
        check('employeeId', 'El id del empleado es obligatorio').not().isEmpty(),
        check('start', 'La fecha de inicio es obligatoria').custom(isDate),
        check('end', 'La fecha de fin es obligatoria').custom(isDate),
        validateFields,
        validateAdmin,
        validateShift
    ],
    updateShift);

// Delete shift
router.delete('/:id', validateAdmin, deleteShift);



module.exports = router;

