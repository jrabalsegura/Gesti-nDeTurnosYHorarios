const Notification = require('../models/Notification');

const getNotifications = async (req, res) => {
    const notifications = await Notification.find();
    res.status(200).json({ok: true, notifications});
}

const createNotification = async (req, res) => {
    const {type, employeeId, startDate, endDate, name, justificante} = req.body;

    try {
        const notification = new Notification({type, employeeId, startDate, endDate, name, justificante});
        await notification.save();
        res.status(201).json({ok: true, notification});        
    } catch (error) {
        res.status(500).json({ok: false, msg: 'Error creating notification'});
    }
}

const deleteNotification = async (req, res) => {
    const {id} = req.params;
    try {
        await Notification.findByIdAndDelete(id);
        res.status(200).json({ok: true, msg: 'Notification deleted successfully'});
    } catch (error) {
        res.status(500).json({ok: false, msg: 'Error deleting notification'});
    }
}

module.exports = {
    getNotifications,
    createNotification,
    deleteNotification
}
