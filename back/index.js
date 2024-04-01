const express = require('express');
const app = express();

// Rutas
app.get('/', (req, res) => {
    res.json({
        "ok": true
    });
});

app.listen(4000, () => {
    console.log(`Server is running on port ${4000}`);
});



