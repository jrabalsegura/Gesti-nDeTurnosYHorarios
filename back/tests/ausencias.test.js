const request = require('supertest');
let { app, stopApp } = require('../index');
// Ensure this exports your Express app

describe("Ausencias Workflow", () => {
    let token;
    let employeeId;
    let ausenciaId;

    beforeAll(async () => {
        // Assuming you export a function `startApp` that initializes and returns the app
        app = await require('../index').startApp();
    });

    // Assuming you have a way to start and stop your app if needed
    beforeAll(async () => {
        // login admin
        const loginResponse = await request(app).post(`/auth/`).send({
            username: process.env.ADMIN_EMAIL,
            password: process.env.ADMIN_PASSWORD
        });
        token = loginResponse.body.token; // Change from loginResponse.text.token to loginResponse.body.token
        console.log(loginResponse.body); // Changed from loginResponse.text
        console.log(token)
    });

    

    // Create user and get token
    beforeAll(async () => {
        const currentDate = new Date();
        const userResponse = await request(app).post(`/employees/new`).set('x-token', token).send({
            username: 'testUser',
            password: 'testPass123',
            name: 'Test User',
            date: currentDate.toISOString()
        });
        
        employeeId = userResponse.body.employee._id;
        console.log(userResponse.body)
        console.log(employeeId);
    });

    // Create ausencia
    beforeAll(async () => {
        const ausenciaResponse = await request(app).post(`/ausencias/new`).set('x-token', token).send({
            date: '2023-01-01',
            employeeId: employeeId,
            motivo: 'Test absence'
        });
        ausenciaId = ausenciaResponse.body.ausencia._id;
    });

    afterAll(async () => {
        //Remove ausencia creada
        await request(app).delete(`/ausencias/${ausenciaId}`).set('x-token', token);

        // remove created user
        await request(app).delete(`/employees/${employeeId}`).set('x-token', token);

        stopApp();
    });

    // Test retrieving the ausencia
    it("should return all ausencias by employeeId", async () => {
        const response = await request(app)
            .get(`/ausencias/all/${employeeId}`)
            .set('x-token', token); // Set the header

        expect(response.status).toBe(200);
        expect(response.body.ausencias.length).toBeGreaterThanOrEqual(1);
    });
});

