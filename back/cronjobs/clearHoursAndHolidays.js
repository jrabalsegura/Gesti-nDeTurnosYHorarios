const {api} = require('../api/api');

const clearHoursAndHolidays = async () => {
    console.log('Clearing hours and holidays');

    const response = await api.get('/employees');
    const employees = response.data.employees;
    console.log(employees)
    for (const employee of employees) {
        try {
            await api.post(`/employees/${employee._id}/clear`);
        } catch (error) {
            console.error(error);
     
       }
    }

}

module.exports = { clearHoursAndHolidays };


