const Employee = require('../models/Employee');
const bcrypt = require('bcryptjs');

const createEmployee = async (req, res) => {

	const {username, password} = req.body;

	try {
		let employee = await Employee.findOne({username});

		if (!employee) {
			employee = new Employee(req.body);

			//Encriptar la contraseña
			const salt = bcrypt.genSaltSync(10);
			employee.password = bcrypt.hashSync(password, salt);

			await employee.save();

			res.status(201).json({
				"ok": true,
				"message": "New user created",
				uid: employee.id,
				name: employee.name,
				username: employee.username
			});
		} else {
			res.status(400).json({
				"ok": false,
				"message": "User already exists"
			});
		}
	} catch (error) {
		res.status(500).json({
			"ok": false,
			"message": "Error creating user",
			error
		});
	}
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

