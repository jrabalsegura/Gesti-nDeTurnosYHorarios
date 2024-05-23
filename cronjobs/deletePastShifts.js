const {api} = require('../api/api');

const deletePastShifts = async () => {

    //Get all the the sifts and delete the ones that have finished
    const shifts = await api.get('/shifts');

    const today = new Date();
    for (const shift of shifts.data.shifts) {
        const endDate = new Date(shift.end);
        if (endDate < today) {
            try {
                await api.delete(`/shifts/${shift._id}`);
            } catch (error) {
                console.error(`Error deleting shift ${shift._id}:`, error);
            }
        }
    }
}

module.exports = {
    deletePastShifts
}

