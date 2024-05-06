const Shift = require('../models/Shift');
const EventoTrabajo = require('../models/EventoTrabajo');
const Holiday = require('../models/Holiday');
const { workEvents } = require('../config/config');

const validateShift = async (req, res, next) => {
  const { employeeId, start, end } = req.body;

  try {
    // Check if the employee already has a shift assigned in any of those days
    const overlappingShift = await Shift.findOne({
      employeeId,
      $or: [
        { start: { $gte: start, $lte: end } },
        { end: { $gte: start, $lte: end } },
        { start: { $lte: start }, end: { $gte: end } }
      ]
    });

    if (overlappingShift) {
      return res.status(400).json({
        ok: false,
        msg: 'The employee already has a shift assigned between those dates'
      });
    }

    // Check if the last eventoTrabajo was a checkout in the previous 12 hours
    //const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);
    const twelveHoursAgo = new Date(start);
    const lastEvent = await EventoTrabajo.findOne({
        employeeId,
        date: { $gte: twelveHoursAgo }
      }).sort({ date: -1 });

    if (lastEvent && lastEvent.type === workEvents.checkout) {
      return res.status(400).json({
        ok: false,
        msg: 'The employee checked out within the last 12 hours'
      });
    }
    console.log(employeeId);
    // Check if employee has holidays aproved in the same dates
    const overlappingHolidays = await Holiday.findOne({
        employeeId,
        $or: [
          { startDate: { $gte: start, $lte: end } },
          { endDate: { $gte: start, $lte: end } },
          { startDate: { $lte: start }, endDate: { $gte: end } }
        ]
      });
  
      if (overlappingHolidays) {
        return res.status(400).json({
          ok: false,
          msg: 'The employee already has holidays assigned between those dates'
        });
      }

    next();

  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: 'Server error'
    });
  }

  

};

module.exports = {
  validateShift
};