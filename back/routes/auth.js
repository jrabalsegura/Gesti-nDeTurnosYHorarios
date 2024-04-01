/*
* Rutas de autenticación
* host + /auth
*/

const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validate-fields');

const { createEmployee, loginEmployee, renewToken } = require('../controllers/auth');


router.post(
    '/new', 
    [
        check('name', 'The name is required').not().isEmpty(),
        check('email', 'The email is required').isEmail(),
        check('password', 'The password is required').not().isEmpty(),
        check('password', 'The password must be at least 6 characters').isLength({ min: 6 }),
        validateFields
    ], 
    createEmployee);

router.post(
    '/',
    [
        check('email', 'The email is required').isEmail(),
        check('password', 'The password is required').not().isEmpty(),
        validateFields
    ],
    loginEmployee);

router.get('/renew', renewToken);




module.exports = router;

