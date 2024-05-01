const express = require('express');
const router = express.Router();
const {validateJWT} = require('../middlewares/validate-JWT');
const {uploadFile} = require('../controllers/upload');
const multer = require('multer');

// Configure multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.use(validateJWT);

router.post('/', upload.single('file'), (req, res, next) => {
  console.log(req.file); // This should log the file info
  console.log(req.files); // This might be undefined unless configured differently
  next();
}, uploadFile);

module.exports = router;


