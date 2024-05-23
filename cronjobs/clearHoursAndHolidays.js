const {api} = require('../api/api');

const clearHoursAndHolidays = async () => {
    const response = await api.get('/employees');
    const employees = response.data.employees;
    
    for (const employee of employees) {
        try {
            await api.post(`/employees/${employee._id}/clear`);
        } catch (error) {
            console.error(error);     
       }
    }
}

module.exports = { clearHoursAndHolidays };


