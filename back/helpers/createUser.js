const Employee = require("../models/Employee")

//Create employee user
const createUser = async () => {

    try {
        // Check if admin user exists before creating it
        const adminExists = await Employee.findOne({ username: 'admin@admin.com' });
        if (adminExists) {
            console.log('Admin user already exists');
            return;
        }

        const admin = new Employee({ name: 'admin', username: 'admin@admin.com', password: '12345678'});
        await admin.save();
        console.log('Admin user created successfully');
    } catch (error) {
        console.log('Error creating admin user');
    }
    
}

module.exports = {
    createUser
}

