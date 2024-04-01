const { validationResult } = require('express-validator');

const createEmployee = (req, res) => {

	const {name, email, password} = req.body;

  	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).json({
			"ok": false,
			"errors": errors.mapped()
		});
	}

	res.status(201).json({
		"ok": true,
		"message": "New user created",
		name,
		email,
		password
	});
}

const loginEmployee = (req, res) => {

	const {email, password} = req.body;

	res.json({
		"ok": true,
		"message": "Login",
		email,
		password
	});
}

const renewToken = (req, res) => {
	res.json({
		"ok": true,
		"message": "Token renewed"
	});
}

module.exports = {
    createEmployee,
    loginEmployee,
    renewToken
}

