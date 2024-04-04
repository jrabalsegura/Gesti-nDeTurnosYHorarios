
const validateAdmin = (req, res, next) => {
    
    const name = req.name;

    if (name === 'admin') {
        next();
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
}

module.exports = {
    validateAdmin
}


