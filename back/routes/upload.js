const express = require('express');
const router = express.Router();
const {validateJWT} = require('../middlewares/validate-JWT');
const {uploadFile} = require('../controllers/upload');

router.use(validateJWT);

router.post('/', uploadFile);

module.exports = router;


