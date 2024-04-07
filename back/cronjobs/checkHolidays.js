const {api} = require('../api/api');

const checkHolidays = async () => {
  try {

    //Holidays that start today
    const response = await api.get('/holidays/start');
    console.log('Holidays starting today:', response.data.holidays);

    if (response.data.holidays.length > 0) {
        //For each holiday, get the user and change its status tu onHolidays
        response.data.holidays.forEach(async (holiday) => {
            const employee = await Employee.findById(holiday.employeeId);
            await api.post(`/employees/${employee._id}/changeOnHolidays`);
        });
    }

    //Holidays that end today
    response = await api.get('/holidays/end');
    console.log('Holidays ending today:', response.data.holidays);

    if(response.data.holidays.length > 0) {
        //For each holiday, get the user and change its status tu onHolidays
        response.data.holidays.forEach(async (holiday) => {
            const employee = await Employee.findById(holiday.employeeId);
            await api.post(`/employees/${employee._id}/changeOnHolidays`);
        });
    }
  } catch (error) {
    console.error('Error fetching holidays:', error);
  }
};

module.exports = {
  checkHolidays
};
