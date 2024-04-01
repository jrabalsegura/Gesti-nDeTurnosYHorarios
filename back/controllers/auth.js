const Employee = require('../models/Employee');

const createEmployee = async (req, res) => {

	const {username, password} = req.body;

	try {
		let employee = await Employee.findOne({username});

		if (!employee) {
			employee = new Employee(req.body);
			await employee.save();

			res.status(201).json({
				"ok": true,
				"message": "New user created",
				employee
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

