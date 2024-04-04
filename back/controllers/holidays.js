const Holiday = require('../models/Holiday');

const getHolidaysStartToday = async (req, res) => {

    try {
        
        const today = new Date();
        const holidays = await Holiday.find({
            $expr: {
                $and: [
                    { $eq: [{ $dayOfMonth: "$startDate" }, today.getDate()] },
                    { $eq: [{ $month: "$startDate" }, today.getMonth() + 1] },
                    { $eq: [{ $year: "$startDate" }, today.getFullYear()] }
                ]
            }
        });
        res.status(200).json({ ok: true, holidays });
        
    } catch (error) {
        res.status(500).json({ok: false, msg: 'Error fetching holidays'});
    }
}

const getHolidaysEndToday = async (req, res) => {
    try {
        const today = new Date();
        const holidays = await Holiday.find({
            $expr: {
                $and: [
                    { $eq: [{ $dayOfMonth: "$endDate" }, today.getDate()] },
                    { $eq: [{ $month: "$endDate" }, today.getMonth() + 1] },
                    { $eq: [{ $year: "$endDate" }, today.getFullYear()] }
                ]
            }
        });
        res.status(200).json({ ok: true, holidays });
    } catch (error) {
        res.status(500).json({ok: false, msg: 'Error fetching holidays'});
    }
}

const createHoliday = async (req, res) => {

    try {
        const {startDate, endDate, employeeId} = req.body;
        const holiday = new Holiday({startDate, endDate, employeeId});
        await holiday.save();
        res.status(200).json({ok: true, holiday});
    } catch (error) {
        res.status(500).json({ok: false, msg: 'Error creating holiday'});
    }
}

module.exports = {
    getHolidaysStartToday,
    getHolidaysEndToday,
    createHoliday
}