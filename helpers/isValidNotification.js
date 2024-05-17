const config = require('../config/config')

const isValidNotification = (notification) => {
    return Object.keys(config.notifications).includes(notification)
}

module.exports = {isValidNotification}