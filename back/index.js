const express = require('express');
require('dotenv').config();
const { dbConnection } = require('./database/config');
const cors = require('cors');
const { createUser } = require('./helpers/createUser');
const fileUpload = require('express-fileupload');
const cron = require('./cronjobs/cronjobs');

const app = express();

//DB
dbConnection();

// CORS
//Configure correctly when deploying
//app.use(cors({
//    origin: 'http://localhost:5173' // Adjust this to match the domain of your frontend app
//}));

//Directorio pblico
app.use(express.static('public'));

// Lectura y parsing the body
app.use(express.json());

app.use(fileUpload());


// Rutas
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

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);

    //Create initial admin user
    createUser({name: "admin", username: "admin@admin.com", password: "12345678"});
});



