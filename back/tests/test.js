const request = require('supertest');
let { app, stopApp } = require('../index');
// Ensure this exports your Express app

describe("Test suitcase", () => {
    let token;
    

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
        token = loginResponse.body.token; 
    });

    afterAll(async () => {
        stopApp();
    });

    describe("Ausencias Workflow", () => {
        let employeeId;
        let ausenciaId;

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
        });

        // Create ausencia
        beforeAll(async () => {
            const ausenciaResponse = await request(app).post(`/ausencias/new`).set('x-token', token).send({
                date: new Date('2023-01-01').toISOString(),
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

        });

        // Test retrieving the ausencia
        it("should return all ausencias by employeeId", async () => {
            const response = await request(app)
                .get(`/ausencias/all/${employeeId}`)
                .set('x-token', token); // Set the header

            expect(response.status).toBe(200);
            expect(response.body.ausencias.length).toBeGreaterThanOrEqual(1);
        });

        //Try to crate ausencia usando login de testUser
        it("should not allow to delete ausencias by employeeId", async () => {
            const loginResponse = await request(app).post(`/auth/`).send({
                username: 'testUser',
                password: 'testPass123'
            });
            const userToken = loginResponse.body.token;

            const response = await request(app).delete(`/ausencias/${ausenciaId}`).set('x-token', userToken);

            expect(response.status).toBe(401);
        });

        // Test retrieving a single ausencia by ID
        it("should return a specific ausencia by ID", async () => {
            const response = await request(app)
                .get(`/ausencias/${ausenciaId}`)
                .set('x-token', token);

            expect(response.status).toBe(200);
            expect(response.body.ausencia).toBeDefined();
            expect(response.body.ausencia._id).toBe(ausenciaId);
        });

        // Test retrieving a non-existing ausencia
        it("should return 404 for a non-existing ausencia", async () => {
            const response = await request(app)
                .get(`/ausencias/123456789012`)
                .set('x-token', token);

            expect(response.status).toBe(404);
        });

        // Test creating an ausencia with missing fields
        it("should not create an ausencia with missing fields", async () => {
            const response = await request(app)
                .post(`/ausencias/new`)
                .set('x-token', token)
                .send({
                    // intentionally missing 'date' and 'motivo'
                    employeeId: employeeId,
                });

            expect(response.status).toBe(400);
            expect(response.body.errors.date.msg).toBe('The date is required');
            expect(response.body.errors.motivo.msg).toBe('The motivo is required');
        });

        // Test creating an ausencia with invalid date
        it("should not create an ausencia with invalid date", async () => {
            const response = await request(app)
                .post(`/ausencias/new`)
                .set('x-token', token)
                .send({
                date: 'not-a-date',
                employeeId: employeeId,
                motivo: 'Test invalid date'
            });

            expect(response.status).toBe(400);
            expect(response.body.errors.date.msg).toContain('The date is required');
        });

        // Test deleting an ausencia with invalid ID
        it("should return 404 when trying to delete a non-existing ausencia", async () => {
            const response = await request(app)
                .delete(`/ausencias/123456789012`)
                .set('x-token', token);

            expect(response.status).toBe(404);
        });

        // Test deleting an ausencia without admin privileges
        it("should not allow deleting an ausencia without admin privileges", async () => {
            const userLoginResponse = await request(app).post(`/auth/`).send({
                username: 'testUser',
                password: 'testPass123'
            });
            const userToken = userLoginResponse.body.token;

            const response = await request(app)
                .delete(`/ausencias/${ausenciaId}`)
                .set('x-token', userToken);

            expect(response.status).toBe(401);
        });
    });

    describe("Auth Workflow", () => {
        let userId;

        afterAll(async () => {
            await request(app).delete(`/employees/${userId}`).set('x-token', token);
        });

        it("should allow the creation of a user", async () => {
            const response = await request(app)
                .post(`/auth/new`)
                .send({
                    name: "AdminTest",
                    username: "admintest",
                    password: "test12"
                })
    
            expect(response.status).toBe(201);
            expect(response.body.name).toBe("AdminTest");
            userId = response.body.uid;
        });

        //Fail creation username with the same username
        it("should not allow the creation of a user with the same username", async () => {
            const response = await request(app)
                .post(`/auth/new`)
                .send({
                    name: "AdminTest",
                    username: "admintest",
                    password: "test12"
                })

                expect(response.status).toBe(400);
                expect(response.body.message).toBe('User already exists');
        });

        
    });
    


    
});

