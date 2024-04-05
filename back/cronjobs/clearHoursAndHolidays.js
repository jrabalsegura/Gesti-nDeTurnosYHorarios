const api = require('../api/api');

const clearHoursAndHolidays = async () => {
    console.log('Clearing hours and holidays');

    const employees = await api.get('/employees');
    employees.forEach(async (employee) => {
        await api.post(`/employees/${employee._id}/clear`);
    });

}

module.exports = { clearHoursAndHolidays };


