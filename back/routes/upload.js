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
  console.log(req.file); // Log the file information
  console.log(req.headers);
  res.send('File uploaded');
}, (error, req, res, next) => {
  console.error('Error handling multer:', error);
  res.status(500).send('Error uploading file');
});

module.exports = router;


