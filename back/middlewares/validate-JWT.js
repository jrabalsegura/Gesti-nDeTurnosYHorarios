const jwt = require('jsonwebtoken');

const validateJWT = (req, res, next) => {

    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            "ok": false,
            "message": "There is no token in the request"
        });
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.uid = payload.uid;
        req.name = payload.name;

    } catch (error) {
        return res.status(401).json({
            "ok": false,
            "message": "Token is not valid"
        });
    }

    next();
}

module.exports = {
	validateJWT
}

