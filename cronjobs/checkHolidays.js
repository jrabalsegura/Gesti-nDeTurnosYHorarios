const {api} = require('../api/api');

const checkHolidays = async () => {
  try {

    //Holidays that start today
    const response = await api.get('/holidays/start');

    if (response.data.holidays.length > 0) {
        //For each holiday, get the user and change its status tu onHolidays
        response.data.holidays.forEach(async (holiday) => {
            await api.post(`/employees/${holiday.employeeId}/libre`);
        });
    }

    //Holidays that end today
    const responseHolidaysEnd = await api.get('/holidays/end');

    if(responseHolidaysEnd.data.holidays.length > 0) {
        //For each holiday, get the user and change its status tu onHolidays
        responseHolidaysEnd.data.holidays.forEach(async (holiday) => {
            try {
                await api.post(`/employees/${holiday.employeeId}/libre`);
            } catch (error) {
                console.error('Error updating employee:', error);
            }
        });
    }
  } catch (error) {
    console.error('Error fetching holidays:', error);
  }
};

module.exports = {
  checkHolidays
};
