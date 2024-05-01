const express = require('express');
const router = express.Router();
const {validateJWT} = require('../middlewares/validate-JWT');
const {downloadFile} = require('../controllers/download')

router.use(validateJWT);

router.post('/', downloadFile);

module.exports = router;