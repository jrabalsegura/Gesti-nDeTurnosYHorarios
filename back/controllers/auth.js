

const createEmployee = (req, res) => {

	const {name, email, password} = req.body;


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

