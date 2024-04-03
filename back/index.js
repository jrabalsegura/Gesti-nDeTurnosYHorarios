const express = require('express');
require('dotenv').config();
const { dbConnection } = require('./database/config');
const cors = require('cors');
const { createUser } = require('./helpers/createUser');

const app = express();

//DB
dbConnection();

// CORS
app.use(cors());

//Directorio pblico
app.use(express.static('public'));

// Lectura y parsing the body
app.use(express.json());

// Rutas
app.use('/auth', require('./routes/auth'));
app.use('/shifts', require('./routes/shifts'));
app.use('/eventosTrabajo', require('./routes/eventosTrabajo'));
app.use('/registrosTrabajo', require('./routes/registrosTrabajo'));
app.use('/notificaciones', require('./routes/notifications'));
app.use('/ausencias', require('./routes/ausencias'));
app.use('/holidays', require('./routes/holidays'));

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);

    //Create initial admin user
    createUser();
});



