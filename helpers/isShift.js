const config = require('../config/config')

const isShift = (shift) => {
    return Object.keys(config.shifts).includes(shift)
}

module.exports = {isShift}

