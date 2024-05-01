const express = require('express');
const router = express.Router();
const {validateJWT} = require('../middlewares/validate-JWT');
const {uploadFile} = require('../controllers/upload');
const multer = require('multer');

// Configure multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.use(validateJWT);

router.post('/', (req, res, next) => {
  console.log(req.headers);
  req.on('data', chunk => console.log('Received data chunk'));
  req.on('end', () => console.log('Request data transmission ended'));
  next();
}, upload.single('file'), (req, res) => {
  console.log(req.file); // Log the file information
  res.send('File uploaded');
});

module.exports = router;


