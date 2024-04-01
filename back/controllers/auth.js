

const createEmployee = (req, res) => {
  res.json({
      "ok": true,
      "message": "New user created"
  });
}

const loginEmployee = (req, res) => {
  res.json({
      "ok": true,
      "message": "Login"
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

