const cron = require('node-cron');
const {checkHolidays} = require('../controllers/holidays');


//Check holidays every day at 07:00, check if one start or end today
cron.schedule('0 7 * * *', () => checkHolidays);




