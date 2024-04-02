const Employee = require('../models/Employee');
const bcrypt = require('bcryptjs');
const {generateJWT} = require('../helpers/jwt');

const createAdmin = async (req, res) => {

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
				name: "admin",
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

const loginEmployee = async (req, res) => {
	const {username, password} = req.body;

	try {
		let employee = await Employee.findOne({username});

		if (!employee) {
			res.status(400).json({
				"ok": false,
				"message": "User doesn't exist"
			});

		} else {

			//Validar la contraseña
			const validPassword = bcrypt.compareSync(password, employee.password);

			if (!validPassword) {
				return res.status(400).json({
					"ok": false,
					"message": "Password is incorrect"
				});
			}		

			//Generar JWT
			const token = await generateJWT(employee.id, employee.name);

			//Respuesta al usuario
			res.json({
				"ok": true,
				uid: employee.id,
				name: employee.name,
				token
			});

		}
	} catch (error) {
		res.status(500).json({
			"ok": false,
			"message": "Error logging user",
			error
		});
	}
}

const renewToken = async(req, res) => {

	const {uid, name} = req;

	//Generar un nuevo JWT
	const token = await generateJWT(uid, name);

	res.json({
		"ok": true,
		uid,
		name,
		token
	});
}

module.exports = {
    createAdmin,
    loginEmployee,
    renewToken
}

