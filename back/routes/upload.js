const express = require('express');
const router = express.Router();
const {validateJWT} = require('../middlewares/validate-JWT');
const {uploadFile} = require('../controllers/upload');
const fileUpload = require('express-fileupload');

//router.use(validateJWT);

router.use(fileUpload())

router.post('/', uploadFile);

module.exports = router;


