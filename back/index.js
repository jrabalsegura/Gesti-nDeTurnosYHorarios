const express = require('express');
require('dotenv').config();

const app = express();

//Directorio pblico
app.use(express.static('public'));

// Rutas
app.use('/auth', require('./routes/auth'));

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});



