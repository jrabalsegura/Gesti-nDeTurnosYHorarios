const {api} = require('../api/api');

const clearHoursAndHolidays = async () => {
    console.log('Clearing hours and holidays');

    const response = await api.get('/employees');
    const employees = response.data.employees;
    console.log(employees)
    employees.forEach(async (employee) => {
        console.log(employee._id);
        try {
            await api.post(`/employees/${employee._id}/clear`);
        } catch (error) {
            console.error(error);
        }
    });

}

module.exports = { clearHoursAndHolidays };


