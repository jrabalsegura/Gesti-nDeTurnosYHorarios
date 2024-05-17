const config = require('../config/config')

const isWorkEvent = (workEvent) => {
    return Object.keys(config.workEvents).includes(workEvent)
}

module.exports = {isWorkEvent}