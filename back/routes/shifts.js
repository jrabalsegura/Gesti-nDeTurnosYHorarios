const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validate-fields');
const {validateJWT} = require('../middlewares/validate-JWT');

const { getShifts, addShift, updateShift, deleteShift } = require('../controllers/shifts');
const { isDate } = require('../helpers/isDate');

router.use(validateJWT);


// Get turns, primero todos
// TODO: Filtrar por usuario
router.get('/', getShifts);

// Create new shift
router.post(
    '/new',
    [
        check('type', 'El tipo de turno es obligatorio').not().isEmpty(),
        check('employeeId', 'El id del empleado es obligatorio').not().isEmpty(),
        check('start', 'La fecha de inicio es obligatoria').custom(isDate),
        check('end', 'La fecha de fin es obligatoria').custom(isDate),
        validateFields
    ],
    addShift);

//Update shift
router.put(
    '/:id',
    [
        check('type', 'El tipo de turno es obligatorio').not().isEmpty(),
        check('employeeId', 'El id del empleado es obligatorio').not().isEmpty(),
        check('start', 'La fecha de inicio es obligatoria').custom(isDate),
        check('end', 'La fecha de fin es obligatoria').custom(isDate),
        validateFields
    ],
    updateShift);

// Delete shift
router.delete('/:id', deleteShift);

module.exports = router;

