/*
* Rutas de autenticación
* host + /auth
*/

const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-JWT');

const { createEmployee, loginEmployee, renewToken } = require('../controllers/auth');


router.post(
    '/new', 
    [
        check('name', 'The name is required').not().isEmpty(),
        check('username', 'The username is required').not().isEmpty(),
        check('password', 'The password is required').not().isEmpty(),
        check('password', 'The password must be at least 6 characters').isLength({ min: 6 }),
        validateFields
    ], 
    createEmployee);

router.post(
    '/',
    [
        check('username', 'The username is required').not().isEmpty(),
        check('password', 'The password is required').not().isEmpty(),
        validateFields
    ],
    loginEmployee);

router.get('/renew', validateJWT, renewToken);




module.exports = router;

