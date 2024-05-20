const express = require('express');
require('dotenv').config();
const { dbConnection } = require('./database/config');
const cors = require('cors');
const { createUser } = require('./helpers/createUser');
const fileUpload = require('express-fileupload');
const { default: mongoose } = require('mongoose');



const app = express();

// CORS
const allowedOrigins = ['http://localhost:5173', 'https://gestion-horarios-cd0d24b996c6.herokuapp.com', 'http://gestionhorarios.eu-west-1.elasticbeanstalk.com/'];

app.use(cors({
    origin: allowedOrigins
    //origin: true
}));

// Public directory
app.use(express.static('public'));

// Body parsing
app.use(express.json());

app.use(fileUpload());

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/shifts', require('./routes/shifts'));
app.use('/eventosTrabajo', require('./routes/eventosTrabajo'));
app.use('/registrosTrabajo', require('./routes/registrosTrabajo'));
app.use('/notificaciones', require('./routes/notifications'));
app.use('/ausencias', require('./routes/ausencias'));
app.use('/holidays', require('./routes/holidays'));
app.use('/nominas', require('./routes/nominas'));
app.use('/employees', require('./routes/employees'));
app.use('/upload', require('./routes/upload'));
app.use('/download', require('./routes/download'));

let server;

async function startApp() {
    await dbConnection(); // Ensure DB connection is ready
    server = app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
        createUser({name: "admin", username: "admin@admin.com", password: "12345678"}); // Consider moving this out if it doesn't need to run every time
    });
    return server;
}



function stopApp() {
    mongoose.connection.close();
    if (server) {
        server.close();
    }
}

if (process.env.NODE_ENV !== 'test') {
    const cron = require('./cronjobs/cronjobs');
    startApp(); // Start the server automatically unless in test environment
}

module.exports = { app, startApp, stopApp };


