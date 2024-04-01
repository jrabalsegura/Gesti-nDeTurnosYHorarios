const express = require('express');
require('dotenv').config();
const { dbConnection } = require('./database/config');

const app = express();

//DB
dbConnection();

//Directorio pblico
app.use(express.static('public'));

// Lectura y parsing the body
app.use(express.json());

// Rutas
app.use('/auth', require('./routes/auth'));

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});



