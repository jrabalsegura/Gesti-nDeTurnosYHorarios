const {api} = require('../api/api');

const clearHoursAndHolidays = async () => {
    console.log('Clearing hours and holidays');

    const response = await api.get('/employees');
    const employees = response.data.employees;
    employees.forEach(async (employee) => {
        console.log(employee._id);
        await api.post(`/employees/${employee._id}/clear`);
    });

}

module.exports = { clearHoursAndHolidays };


