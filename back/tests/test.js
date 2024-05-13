const request = require('supertest');
let { app, stopApp } = require('../index');
// Ensure this exports your Express app

describe("Test suitcase", () => {
    let token;
    const currentDate = new Date();
    

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

        //Fail creation user without username
        it("should not allow the creation of a user without username", async () => {
            const response = await request(app)
                .post(`/auth/new`)
                .send({
                    name: "AdminTest",
                    password: "test12"
                })

            expect(response.status).toBe(400);
            expect(response.body.errors.username.msg).toBe('The username is required');
        });

        //Allow login of user
        it("should allow login of user", async () => {
            const response = await request(app).post(`/auth/`).send({
                username: "admintest",
                password: "test12"
            });
            expect(response.status).toBe(200);
            expect(response.body.uid).toBe(userId);
        });

        //Fail login without providing username
        it("should not allow login without providing username", async () => {
            const response = await request(app).post(`/auth/`).send({
                password: "test12"
            });
            expect(response.status).toBe(400);
            expect(response.body.errors.username.msg).toBe('The username is required');
        });

        //Fail login with incorrect password
        it("should not allow login with incorrect password", async () => {
            const response = await request(app).post(`/auth/`).send({
                username: "admintest",
                password: "incorrect"
            });
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Password is incorrect');
        });

        //Fail login user does not exist
        it("should not allow login of user that does not exist", async () => {
            const response = await request(app).post(`/auth/`).send({
                username: "userdoesnotexist",
                password: "test12"
            });
            expect(response.status).toBe(400);
            expect(response.body.message).toBe("User doesn't exist");
        });

        //Renew token
        it("should allow renew token", async () => {
            
            const response = await request(app)
                .get(`/auth/renew`)
                .send({
                    username: "admintest",
                    password: "test12"
                })
                .set('x-token', token);
            expect(response.status).toBe(200);
        });

        //Fail to renew token with incorrect token
        it("should not allow renew token with incorrect token", async () => {
            const response = await request(app)
                .get(`/auth/renew`)
                .set('x-token', 'incorrecttoken');
            expect(response.status).toBe(401);
        });

        
    });

    describe("Employees Workflow", () => {
        let employeeId;

        beforeAll(async () => {
            const employeeResponse = await request(app).post(`/employees/new`).set('x-token', token).send({
                username: 'testUser',
                password: 'testPass123',
                name: 'Test User',
                date: currentDate.toISOString()
            });
            employeeId = employeeResponse.body.employee._id;
        });

        afterAll(async () => {

            // remove created user
            await request(app).delete(`/employees/${employeeId}`).set('x-token', token);

        });

        //Get employee created
        it("get employee test user", async () => {
            const response = await request(app).get(`/employees/${employeeId}`).set('x-token', token);
            expect(response.status).toBe(200);
            expect(response.body.employee).toBeDefined();
            expect(response.body.employee._id).toBe(employeeId);
        });

        //Fail get employee with incorrect id
        it("should not allow get employee with incorrect id", async () => {
            const response = await request(app).get(`/employees/123456789012`).set('x-token', token);
            expect(response.status).toBe(500);
            expect(response.body.msg).toBe('Error getting employee');
        });

        //Update employee name correctly
        it("should allow update employee name correctly", async () => {
            const response = await request(app).put(`/employees/${employeeId}`).set('x-token', token).send({
                username: 'testUser',
                password: 'testPass123',
                name: 'Test User Updated',
            });
            expect(response.status).toBe(200);
            expect(response.body.employee.name).toBe('Test User Updated');
        });

        //Fail if name = admin in update
        it("should not allow update employee if username = admin", async () => {
            const response = await request(app).put(`/employees/${employeeId}`).set('x-token', token).send({
                username: 'admintest',
                password: 'test12',
                name: 'admin',
            });
            expect(response.status).toBe(400);
            expect(response.body.errors.name.msg).toBe('The name is not admin');
        });

        //Get all employees, at least get 1
        it("should return all employees", async () => {
            const response = await request(app).get(`/employees/`).set('x-token', token);
            expect(response.status).toBe(200);
            expect(response.body.employees.length).toBeGreaterThanOrEqual(1);
        });

        //Create employee and test default sallary = 10
        it("should create employee and test default sallary = 10", async () => {
            const response = await request(app).post(`/employees/new`).set('x-token', token).send({
                username: 'testUser2',
                password: 'testPass123',
                name: 'Test User2',
                date: currentDate.toISOString()
            });
            expect(response.status).toBe(201);
            expect(response.body.employee.hourlySallary).toBe(10);
            await request(app).delete(`/employees/${response.body.employee._id}`).set('x-token', token);
        });

        //Create employee and test that gets the sallary provided in hourlySallary
        it("should create employee and test that gets the sallary provided in hourlySallary", async () => {
            const response = await request(app).post(`/employees/new`).set('x-token', token).send({
                username: 'testUser3',
                password: 'testPass123',
                name: 'Test User3',
                date: currentDate.toISOString(),
                hourlySallary: 30
            });
            expect(response.status).toBe(201);
            expect(response.body.employee.hourlySallary).toBe(30);
            await request(app).delete(`/employees/${response.body.employee._id}`).set('x-token', token);
        });

        //Fail if the provided hourlySallary is not a number
        it("should not allow create employee if the provided hourlySallary is not a number", async () => {
            const response = await request(app).post(`/employees/new`).set('x-token', token).send({
                username: 'testUser4',
                password: 'testPass123',
                name: 'Test User4',
                date: currentDate.toISOString(),
                hourlySallary: 'not-a-number'
            });
            expect(response.status).toBe(400);
            expect(response.body.errors.hourlySallary.msg).toBe('The sallary must be a number');           
        });

        //Ensure that deleted employee is not anymore in the database
        it("should not allow delete employee that does not exist", async () => {
            const response = await request(app).post(`/employees/new`).set('x-token', token).send({
                username: 'testUser4',
                password: 'testPass123',
                name: 'Test User4',
                date: currentDate.toISOString()
            });

            //Get number of users
            const users = await request(app).get(`/employees/`).set('x-token', token);
            
            await request(app).delete(`/employees/${response.body.employee._id}`).set('x-token', token);

            const afterDelete = await request(app).get(`/employees/`).set('x-token', token);

            expect(response.status).toBe(201);
            expect(afterDelete.body.employees.length).toBe(users.body.employees.length - 1);
        });

        //Fail if id provided to delete not exist
        it("should not allow delete employee that does not exist", async () => {
            const response = await request(app).delete(`/employees/123456789012`).set('x-token', token);
            expect(response.status).toBe(500);
            expect(response.body.msg).toBe('Error deleting employee');
        });

        //Post extra hours and get them
        it("should allow post extra hours and get them", async () => {
            const response = await request(app).post(`/employees/${employeeId}/extraHours`).set('x-token', token).send({
                hours: 10
            });
            expect(response.status).toBe(200);

            const responseHours = await request(app).get(`/employees/${employeeId}/extraHours`).set('x-token', token);
            
            expect(responseHours.status).toBe(200);
            expect(responseHours.body.extraHours).toBe(10);
        });

        //Fail if provided extra hours is not a number
        it("should not allow post extra hours if provided hours is not a number", async () => {
            const response = await request(app).post(`/employees/${employeeId}/extraHours`).set('x-token', token).send({
                hours: 'not-a-number'
            });
            expect(response.status).toBe(400);
            expect(response.body.errors.hours.msg).toBe('The hours must be a number');
        });

        //Check that getSallary returns the correct sallary
        it("should allow get sallary", async () => {
            const response = await request(app).get(`/employees/${employeeId}/sallary`).set('x-token', token);
            expect(response.status).toBe(200);
            expect(response.body.sallary).toBe(10);
        });

        //Fail if provided id is not in the system
        it("should not allow get sallary if provided id is not in the system", async () => {
            const response = await request(app).get(`/employees/123456789012/sallary`).set('x-token', token);
            expect(response.status).toBe(500);
            expect(response.body.msg).toBe('Error getting sallary');
        });

         //Post holidays and get them
         it("should allow post holidays and get them", async () => {
            const response = await request(app).post(`/employees/${employeeId}/holidays`).set('x-token', token).send({
                days: 10
            });
            expect(response.status).toBe(200);

            const responseHours = await request(app).get(`/employees/${employeeId}/holidays`).set('x-token', token);
            
            expect(responseHours.status).toBe(200);
            expect(responseHours.body.holidays).toBe(10);

            const responseTwo = await request(app).post(`/employees/${employeeId}/holidays`).set('x-token', token).send({
                days: 15
            });
            const responseHoursTwo = await request(app).get(`/employees/${employeeId}/holidays`).set('x-token', token);

            expect(responseTwo.status).toBe(200);
            expect(responseHoursTwo.body.holidays).toBe(25);
        });

        //Fail if provided holidays is not a number
        it("should not allow post holidays if provided days is not a number", async () => {
            const response = await request(app).post(`/employees/${employeeId}/holidays`).set('x-token', token).send({
                days: 'not-a-number'
            });
            expect(response.status).toBe(400);
            expect(response.body.errors.days.msg).toBe('The days must be a number');
        });

        //Toggle onHolidays ang get its value
        it("should allow toggle onHolidays and get its value", async () => {

            const response = await request(app).get(`/employees/${employeeId}/libre`).set('x-token', token);
            expect(response.status).toBe(200);
            expect(response.body.onHolidays).toBe(false);

            const responseTwo = await request(app).post(`/employees/${employeeId}/libre`).set('x-token', token);
            expect(responseTwo.status).toBe(200);
            expect(responseTwo.body.employee.onHolidays).toBe(true);
        });

        //Get valid start date
        it("should allow get valid start date", async () => {
            const response = await request(app).get(`/employees/${employeeId}/startDate`).set('x-token', token);
            const responseUser = await request(app).get(`/employees/${employeeId}`).set('x-token', token);
            const date = new Date(responseUser.body.employee.startDate);

            expect(response.status).toBe(200);
            expect(response.body.startDate).toBe(date.toISOString());
        });

        //Clear Hours and Holidays working
        it("should allow clear hours and holidays working", async () => {
            const response = await request(app).post(`/employees/${employeeId}/clear`).set('x-token', token);
            expect(response.status).toBe(200);
            expect(response.body.employee.extraHours).toBe(0);
            expect(response.body.employee.holidays).toBe(0);
        });
        
    });

    describe("Eventos Trabajo Workflow", () => {
        let employeeId;

        beforeAll(async () => {
            const employeeResponse = await request(app).post(`/employees/new`).set('x-token', token).send({
                username: 'testUser',
                password: 'testPass123',
                name: 'Test User',
                date: currentDate.toISOString()
            });
            employeeId = employeeResponse.body.employee._id;
        });

        afterAll(async () => {

            // remove created user
            await request(app).delete(`/employees/${employeeId}`).set('x-token', token);

        });
        
        //Get all the events
        it("should allow get all the events", async () => {
            const response = await request(app).get(`/eventosTrabajo/`).set('x-token', token);
            expect(response.status).toBe(200);
            console.log(response.body)
            expect(response.body.eventos.length).toBeGreaterThanOrEqual(1);
        });

        //Should allow to create a checkin event
        it("should allow to create a checkin event", async () => {
            const response = await request(app).post(`/eventosTrabajo/new`).set('x-token', token).send({
                employeeId,
                type: 'checkin',
                date: currentDate.toISOString()
            });
            expect(response.status).toBe(201);
            expect(response.body.evento.type).toBe('checkin');

            await request(app).delete(`/eventosTrabajo/${response.body.evento._id}`).set('x-token', token);
        });

        //Should failed if two consecutive checkin events
        it("should failed if two consecutive checkin events", async () => {
            const initialResponse = await request(app).post(`/eventosTrabajo/new`).set('x-token', token).send({
                employeeId,
                type: 'checkin',
                date: currentDate.toISOString()
            });

            expect(initialResponse.status).toBe(201);

            const response = await request(app).post(`/eventosTrabajo/new`).set('x-token', token).send({
                employeeId,
                type: 'checkin',
                date: currentDate.toISOString()
            });
            expect(response.status).toBe(400);
            expect(response.body.msg).toBe('Cannot have consecutive checkin events');

            await request(app).delete(`/eventosTrabajo/${initialResponse.body.evento._id}`).set('x-token', token);
        });

        //Should failed if checkout without previous checkin
        it("should failed if checkout without previous checkin", async () => {
            const response = await request(app).post(`/eventosTrabajo/new`).set('x-token', token).send({
                employeeId,
                type: 'checkout',
                date: currentDate.toISOString()
            });
            expect(response.status).toBe(400);
            expect(response.body.msg).toBe('Cannot have checkout without checkin');
        });

        //Should allow to create a checkout event after a checkin, create a Registr and failed two checkouts
        it("should allow to create a checkout event after a checkin", async () => {
            //current date - 8 hours
            const date = new Date(currentDate.getTime() - (8 * 60 * 60 * 1000));
            const initialResponse = await request(app).post(`/eventosTrabajo/new`).set('x-token', token).send({
                employeeId,
                type: 'checkin',
                date: date.toISOString()
            });

            expect(initialResponse.status).toBe(201);


            const response = await request(app).post(`/eventosTrabajo/new`).set('x-token', token).send({
                employeeId,
                type: 'checkout',
                date: currentDate.toISOString()
            });
            expect(response.status).toBe(201);
            expect(response.body.evento.type).toBe('checkout');
            expect(response.body.registro).toBeDefined();
            expect(response.body.registro.hours).toBe(8);

            const lastResponse = await request(app).post(`/eventosTrabajo/new`).set('x-token', token).send({
                employeeId,
                type: 'checkout',
                date: currentDate.toISOString()
            });
            expect(lastResponse.status).toBe(400);
            expect(lastResponse.body.msg).toBe('Cannot have consecutive checkout events');

            await request(app).delete(`/eventosTrabajo/${initialResponse.body.evento._id}`).set('x-token', token);
            await request(app).delete(`/eventosTrabajo/${response.body.evento._id}`).set('x-token', token);
            await request(app).delete(`/registrosTrabajo/${response.body.registro._id}`).set('x-token', token);
        });

        //Should failed if the checkin was more than 24 hours ago
        it("should failed if the checkin was more than 24 hours ago", async () => {
            //current date - 25 hours
            const date = new Date(currentDate.getTime() - (25 * 60 * 60 * 1000));
            const initialResponse = await request(app).post(`/eventosTrabajo/new`).set('x-token', token).send({
                employeeId,
                type: 'checkin',
                date: date.toISOString()
            });

            expect(initialResponse.status).toBe(201);


            const response = await request(app).post(`/eventosTrabajo/new`).set('x-token', token).send({
                employeeId,
                type: 'checkout',
                date: currentDate.toISOString()
            });
            expect(response.status).toBe(400);
            expect(response.body.msg).toBe('There is no checkin in the previous 24 hours');

            await request(app).delete(`/eventosTrabajo/${initialResponse.body.evento._id}`).set('x-token', token);
            await request(app).delete(`/eventosTrabajo/${response.body.evento._id}`).set('x-token', token);
        });

        //Should return at least 1 event recently created in getLastHour
        it("should return at least 1 event recently created in getLastHour", async () => {
            const response = await request(app).post(`/eventosTrabajo/new`).set('x-token', token).send({
                employeeId,
                type: 'checkin',
                date: currentDate.toISOString()
            });

            const responseLast = await request(app).get(`/eventosTrabajo/last`).set('x-token', token);
            expect(responseLast.status).toBe(200);
            expect(responseLast.body.events.length).toBeGreaterThanOrEqual(1);

            await request(app).delete(`/eventosTrabajo/${response.body.evento._id}`).set('x-token', token);
        });

    });


    


    
});

