/*
* Rutas de autenticación
* host + /auth
*/

const express = require('express');
const router = express.Router();

const { createEmployee, loginEmployee, renewToken } = require('../controllers/auth');


router.post('/new', createEmployee);

router.post('/', loginEmployee);

router.get('/renew', renewToken);




module.exports = router;

